const path = require("path");
const express = require("express");
const fileUpload = require("express-fileupload");
const sqlite3 = require("sqlite3");
const fs = require("fs")
  , gm = require('gm').subClass({ imageMagick: true });
const url = require("url");
const formidable = require("formidable");

const im = require('./images');

const router = express.Router();

let db = new sqlite3.Database("./api/db/boards.db", (err) => {
  if (err) {
    console.log("Unable to open database: \n" + "\t" + err.message);
  } else {
    console.log("Board database up");
  }
});

// const createDb = () =>
//   new Promise((resolve, reject) =>
//     fs.readFile(path.join(__dirname, "../schema.sql"), (err, data) => {
//       if (err) return reject(err);

//       db.exec(data.toString(), (err) => {
//         if (err) return reject(err);
//         resolve();
//       });
//     })
//   );

// createDb();

//
// misc
//
const deleteImages = file => {
  let name = file.match(/\d+/)[0]
  let ext = file.match(/\..+/)[0]
  let fileThumb = name + "s" + ext;

  try {
    fs.unlinkSync(__dirname + "/img/" + file);
    fs.unlinkSync(__dirname + "/img/" + fileThumb);
  } catch (err) {
    console.log(err);
  }
}

const processImage = (file, filePath, fileName, callback) => {
  file.mv(filePath + fileName);
  im.resize(fileName);
  callback();
}

const validateFile = fileName => {
  let ext = fileName.match(/[^\.]+$/)[0].toUpperCase();
  let acceptedFileTypes = [
    "JPG",
    "JPEG",
    "PNG",
    "BMP",
    "GIF"
  ]

  if (acceptedFileTypes.find(type => type === ext)) {
    return true;
  } else {
    return false;
  }
}

const uploadFile = (req, res) => {
  let file = req.files.img;
  let fileName = file.name;
  let filePath = path.join(__dirname, './img/');

  validateFile(fileName) ? processImage(file, filePath, fileName, () => res.sendStatus(200))
    : res.sendStatus(500)
}

const pruneThreads = (board, callback) => {
  let threadLimit = 100;
  let getCount = `SELECT COUNT(thread) from posts_${board} WHERE thread = post`;
  let getLastThread = `SELECT thread FROM posts_${board} GROUP BY thread ORDER BY bump DESC LIMIT 1;`

  db.each(getCount, (err, row) => {
    let count = row['COUNT(thread)'];

    if (count > threadLimit) {
      db.each(getLastThread, (err, row) => {
        let getFile = `SELECT file FROM posts_${board} WHERE thread = ${row.thread};`
        let deleteThread = `DELETE FROM posts_${board} WHERE thread = ${row.thread};`
        
        db.each(getFile, (err, row) => {
          deleteImages(row.file);
        }, () => db.run(deleteThread))
      })
    }
  })
}

//
// post functions
//

function newPost(post, callback) {
  let {
    board,
    thread,
    email,
    name,
    comment,
    file,
    fileOrig,
    fileSize,
    fileWidth,
    fileHeight,
    sage
  } = post;
  let filehash = password = ip = bump = sticky = locked = null;
  const sql = `INSERT INTO posts_${board} 
               VALUES 
               (null,
                ${thread},
                null,
                current_timestamp,
                "${email}",
                "${name}", 
                "${comment}",
                "${file}",
                "${fileOrig}",
                "${fileSize}",
                "${fileWidth}",
                "${fileHeight}",
                "${filehash}",
                "${password}",
                "${ip}",
                "${bump}",
                "${sticky}",
                "${locked}",
                "${sage}");`
  const setBump = `UPDATE posts_${board} SET bump = 1 where thread = ${thread};`
  const updateBump = `UPDATE posts_${board} SET bump = (bump + 1) where thread = post;`

  if (sage) {
    db.run(sql, err => err ? console.log(err) : () => callback.sendStatus(200))
  } else {
    db.run(updateBump, ok =>
      db.run(setBump, ok =>
        db.run(sql, (ok, err) => err ? console.log(err) : () => callback.sendStatus(200))));
  }
}

function newThread(post, res) {
  let {
    bump,
    board,
    thread,
    subject,
    email,
    name,
    comment,
    file,
    fileOrig,
    fileSize,
    fileWidth,
    fileHeight
  } = post;
  let filehash = password = ip = sticky = locked = sage = null;

  const updateBump = `UPDATE posts_${board} SET bump = (bump + 1)`
  const sql = `INSERT INTO posts_${board} 
               VALUES 
               (NULL,
                "${thread}",
                "${subject}",
                current_timestamp,
                "${email}",
                "${name}", 
                "${comment}",
                "${file}",
                "${fileOrig}",
                ${fileSize},
                ${fileWidth},
                ${fileHeight},
                ${filehash},
                ${password},
                ${ip},
                ${bump},
                ${sticky},
                ${locked},
                ${sage});`
  const sql2 = `UPDATE posts_${board} SET thread = post WHERE thread = "newthread";`
  
  db.run(updateBump, ok =>
    db.run(sql, ok =>
      db.run(sql2, ok => pruneThreads(board, res))
    )
  );
}

function getPosts(req, callback) {
  let { query, board, thread, post} = req;
  let result = [];
  let partialThreads = {};
  let sql;
  let sql2 = null;
  let count;

  if (query === "post") {
    sql = `SELECT * FROM posts_${board} WHERE post = ${post}`;

    db.each(sql, (err, row) => result.push(row), () => callback.send(result));
  }

  if (query === "thread") {
    sql = `SELECT * FROM posts_${board} WHERE thread = ${thread}`;

    if (post != "null") {
      sql = sql + ` LIMIT ${post}`
    }

    db.each(sql, (err, row) => result.push(row), () => callback.send(result));
  }

  if (query === "threads") {
    sql = `SELECT * FROM posts_${board} GROUP BY thread`;

    if (post != "null") {
      sql2 = `SELECT * FROM posts_${board} a WHERE a.RowId IN (
              SELECT b.RowId
                FROM posts_${board} b
                WHERE a.thread = b.thread
                ORDER BY b.post DESC LIMIT ${post} 
            ) ORDER BY thread ASC;`

      db.each(sql, (err, row) => partialThreads[row.thread] = [row],
        ok => db.each(sql2, (err, row) => {
          if (row.post != row.thread) {
          partialThreads[row.thread].push(row)
          }
        }, ok => callback.send(partialThreads)))
    } else {
      db.each(sql, (err, row) => result.push(row), () => callback.send(result));
    }
  }

  if (query === "catalog") {
    sql = `SELECT * FROM posts_${board} GROUP BY thread ORDER BY bump;`
    db.each(sql, (err, row) => result.push(row), () => callback.send(result));
  }

  if (query === "omitted") {
    sql = `SELECT COUNT(thread) from posts_${board} WHERE thread=${thread};`

    db.each(sql, (err, row) => {
      count = row['COUNT(thread)'];
    }, () => callback.send(count.toString()))
  }
}

const getThreadStats = (board, callback) => {
  const threads = `SELECT thread FROM posts_${board} GROUP BY thread;`
  let threadStats = [];
  let threadCount = 0;
  let postCount;
  let imageCount;

  db.each(threads, (err, row) => {
    let currentThread = { thread: row.thread, posts: 0, images: 0 };
    postCount = `SELECT COUNT(post) from posts_${board} WHERE thread = ${row.thread};`
    imageCount = `SELECT COUNT(file) from posts_${board} WHERE thread = ${row.thread} and file != "null";`
    threadCount += 1;

    db.serialize(() => {
      db.get(postCount, (err, row) => {
        let posts = row['COUNT(post)'];
        currentThread.posts = posts;
      })

      db.get(imageCount, (err, row) => {
        let images = row['COUNT(file)'];
        currentThread.images = images;
        threadStats.push(currentThread)

        if (threadCount === threadStats.length) {
          callback.send(threadStats)
        }
      })
    })
  })
}

const getBoards = (callback) => {
  const sql = `SELECT * FROM boards;`;
  let result = [];

  db.each(sql, (err, row) => result.push(row), () => {
    if (callback) {
      callback.send(result);
    } else {
      return result;
    }
  });
};

const getRoutes = async (res) => {
  let boardList = [];
  let dbCalls = [];
  const sql = 'SELECT * FROM boards';

  function getThreads(call) {
    return new Promise((resolve, reject) => {
      db.all(call.sql, (err, rows) => {
        resolve({ uri: call.uri, threads: rows })
        reject(reason => console.log(reason))
      })
    });
  }

  db.each(sql, (err, row) => {
    dbCalls.push({ uri: row.uri, sql: `SELECT * FROM posts_${row.uri} GROUP BY thread;` })
  }, () => {
    dbCalls.forEach(call => {
      getThreads(call).then(res => boardList.push(res))
        .then(() => { boardList.length === dbCalls.length ? res.send(boardList) : null })
    })
  })
}

//
// routes
//

router.post("/news/newpost", (req, res) => {
  var post = req.body;
  var sql = `INSERT INTO news VALUES (
          NULL,
          "${post.subject}",
          "${post.author}",
          "${post.post}",
          CURRENT_TIMESTAMP
        );`
        
  db.run(sql, ok => res.sendStatus(200))
});

router.post("/uploadfile", (req, res) => {
  uploadFile(req, res);
});

router.post("/newthread", (req, res) => {
  newThread(req.body, res);
});

router.post("/newpost", (req, res) => {
  newPost(req.body);
  res.sendStatus(200);
});

router.get("/getposts", (req, res) => {
  const query = url.parse(req.url, true).query;
  getPosts(query, res);
});

router.get("/news/getposts", (req, res) => {
  var posts = [];
  var sql = `SELECT * FROM news ORDER BY postId DESC;`

  db.each(sql, (err, row) => posts.push(row), () => res.send(posts));
})

router.get("/getboards", (req, res) => {
  getBoards(res);
});

router.get("/getthreadstats", (req, res) => {
  const query = url.parse(req.url, true).query;
  const board = query.board;
  getThreadStats(board, res);
})

router.get("/routes", (req, res) => {
  getRoutes(res);
});

module.exports = router;