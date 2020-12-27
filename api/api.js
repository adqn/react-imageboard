const path = require("path");
const express = require("express");
const fileUpload = require("express-fileupload");
const sqlite3 = require("sqlite3");
const fs = require("fs")
  , gm = require('gm').subClass({ imageMagick: true });
const url = require("url");
const formidable = require("formidable");

const im = require('./images');

let db = new sqlite3.Database("./api/db/db.db", (err) => {
  if (err) {
    console.log("Unable to open database: \n" + "\t" + err.message);
  } else {
    console.log("Boards database up");
  }
});

// const createDb = () =>
//   new Promise((resolve, reject) =>
//     fs.readFile(path.join(__dirname, "./schema.sql"), (err, data) => {
//       if (err) return reject(err);

//       db.exec(data.toString(), (err) => {
//         if (err) return reject(err);
//         resolve();
//       });
//     })
//   );

//
// misc
//

const validateFile = file => {
  let fileName = file.name;
  let filePath = path.join(__dirname, './img/');
  let ext = fileName.match(/[^\.]+$/)[0].toUpperCase();
  
  let acceptedFileTypes = [
    "JPG",
    "JPEG",
    "PNG",
    "BMP",
    "GIF"
  ]

  if (acceptedFileTypes.find(type => type === ext)) {
    return {file, filePath, fileName}
  } else {
    return null;
  }
}

const processImage = ({file, filePath, fileName}) => 
  file.mv(filePath + fileName);
  im.resize(fileName)

const uploadFile = (req, res) => {
  let file = req.file.img
  validateFile(file) === null ? res.sendStatus(500) : processImage(validateFile(req))
    res.sendStatus(200);
}

//
// post functions
//

function newPost(post, callback) {
  let { board, thread, email, name, comment, file } = post;
  const sql = `INSERT INTO posts_${board} 
               VALUES 
               (null,
                ${thread},
                null,
                current_timestamp,
                "${email}",
                "${name}", 
                "${comment}",
                "${file}");`;

  db.run(sql, (err) => {
    if (err) {
      console.log(err);
    } else {
      () => callback.sendStatus(200);
    }
  });
}

function newThread(newThread, res) {
  let { board, thread, subject, email, name, comment, file } = newThread;
  const sql = `INSERT INTO posts_${board} 
               VALUES 
               (NULL,
                "${thread}",
                "${subject}",
                current_timestamp,
                "${email}",
                "${name}",
                "${comment}",
                "${file}");`;

  const sql2 = `UPDATE posts_${board} SET thread = post WHERE thread = "newthread"`
  db.run(sql, ok => db.run(sql2, ok => res.sendStatus(200)));
}

function getPosts(req, callback) {
  let { query, board, thread, post } = req;
  let result = [];
  let sql;

  if (query === "post") {
    sql = `SELECT * FROM posts_${board} WHERE post = ${post}`;
  }

  if (query === "thread") {
    sql = `SELECT * FROM posts_${board} WHERE thread = ${thread}`;
  }

  if (query === "threads") {
    sql = `SELECT * FROM posts_${board} GROUP BY thread`;
  }

  db.each(sql, (err, row) => {
    result.push(row);
  },
    () => callback.send(result)
  );
}

const getBoards = (callback) => {
  const sql = `SELECT * FROM boards;`;
  let result = [];

  db.serialize(() => {
    db.each(
      sql,
      (err, row) => {
        result.push(row);
      },
      () => {
        if (callback) {
          callback.send(result);
        } else {
          return result;
        }
      }
    );
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

  db.each(sql, (err, board) => {
    dbCalls.push({ uri: board.uri, sql: `SELECT * FROM posts_${board.uri} GROUP BY thread;` })
  }, () => {
    dbCalls.forEach(call => {
      getThreads(call).then(res => boardList.push(res))
        .then(() => { boardList.length === dbCalls.length ? res.send(boardList) : null })
    }
    )
  })
}

//
// routes
//

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(fileUpload({ createParentPath: true }))
app.use('/img', express.static('./api/img'));

app.get("/test", (req, res) => {
  res.writeHead(200, { "content-type": "text/html" });
  fs.createReadStream(__dirname + "/test.html").pipe(res);
});

app.post("/api/uploadfile", (req, res) => {
  uploadFile(req, res);
})

app.post("/api/newthread", (req, res) => {
  newThread(req.body, res);
});

app.post("/api/newpost", (req, res) => {
  newPost(req.body);
  res.sendStatus(200);
});

app.get("/api/getposts", (req, res) => {
  const query = url.parse(req.url, true).query;
  getPosts(query, res);
});

app.get("/api/getboards", (req, res) => {
  getBoards(res);
});

app.get("/api/routes", (req, res) => {
  getRoutes(res);
});

const port = 5001;
const server = app.listen(port, () =>
  console.log("Server listening on port " + port)
);

// createDb();