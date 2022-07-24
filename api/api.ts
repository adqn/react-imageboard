"use strict";

import path from "path";
import fs from "fs";
import url from "url";
import express, { Request, Response, NextFunction } from "express";
import { db, knexInstance } from "./db";
import { PostModel, PostShape } from "./models/post.model";
import { saveThumbnail } from "./imageTools";

interface Post {
  board: string,
  thread?: number | string,
  subject: string,
  email: string,
  name: string,
  comment: string,
  created?: string
  sage?: boolean,
  bump?: number,
  id?: number,
  password?: string,
  file?: string | null,
  fileOrig?: string | null,
  fileSize?: number | null,
  fileWidth?: string | null,
  fileHeight?: string | null,
} 

const router = express.Router();

const seedPosts = async () =>
await knexInstance('posts_b')
  .insert({
    // board: "b",
    thread: "2",
    subject: "second test thread",
    email: "sage",
    name: "Anonymous",
    comment: "First test comment",
    sage: 0,
    bump: 1,
    password: null,
    file: "testfile.jpg",
    fileorig: "testfileorig.jpg",
    filesize: 200200,
    filewidth: "200",
    fileheight: "200",
  })
  .returning("*");

seedPosts();

//
// user functions
//

const getToken = () => {
  return { token: 'test_token' }
}

const login = (user: Record<string, string>, res: Response) => {
  const sql = `SELECT username FROM users 
               WHERE username = "${user.username}"
               AND password = "${user.password}";`;
  
  db.get(sql, (err, row) => {
    if (!row) res.sendStatus(500);
    else {
      const token = getToken();
      res.send(token);
    }
  })
}

//
// image handling
//

const deleteImage = (fileName: string) => {
  const name = fileName.match(/\d+/)![0];
  const ext = fileName.match(/\..+/)![0];
  const fileThumb = name + "s" + ext;

  try {
    fs.unlinkSync(__dirname + "/img/" + fileName);
    fs.unlinkSync(__dirname + "/img/" + fileThumb);
  } catch (err) {
    console.log(err);
  }
}

const processImage = (file: any, filePath: string, fileName: string, callback?: any) => {
  file.mv(filePath + fileName);
  saveThumbnail(fileName);
  callback();
}

const validateFile = (fileName: string) => {
  const ext = fileName.match(/[^\.]+$/)![0].toUpperCase();
  const acceptedFileTypes = [
    "JPG",
    "JPEG",
    "PNG",
    "BMP",
    "GIF"
  ]

  if (acceptedFileTypes.find(type => type === ext)) return true;
  else return false;
  
}

const uploadFile = (req: Request, res: Response) => {
  const file: any = req?.files?.img;
  const fileName = file?.name;
  const filePath = path.join(__dirname, './img/');

  validateFile(fileName) ? processImage(file, filePath, fileName, () => res.sendStatus(200))
    : res.sendStatus(500)
}

//
// thread/post handling
//

const pruneThreads = (board: string, res?: Response) => {
  const threadLimit = 100;
  const getCount = `SELECT COUNT(thread) from posts_${board} WHERE thread = post`;
  const getLastThread = `SELECT thread FROM posts_${board} GROUP BY thread ORDER BY bump DESC LIMIT 1;`

  db.each(getCount, (err, row) => {
    const count = row['COUNT(thread)'];

    if (count > threadLimit) {
      db.each(getLastThread, (err, row) => {
        const getFile = `SELECT file FROM posts_${board} WHERE thread = ${row.thread};`
        const deleteThread = `DELETE FROM posts_${board} WHERE thread = ${row.thread};`
        
        db.each(getFile, (err, row) => {
          deleteImage(row.file);
        }, () => db.run(deleteThread))
      })
    }
  })
}


const deletePost = (post: Post, board: string) => {
  const postDeleteLimit = 900000;
  const getPassword = `SELECT password, created FROM posts_${board} WHERE post = ${post.id};`
  const getImage = `SELECT file FROM posts_${board} WHERE post = ${post.id};`;
  const deletePost = `DELETE FROM posts_${board} WHERE post = ${post.id};`;
  const access = true;

  const queryAndDelete = (getImage: string, deletePost: string) =>
    db.serialize(() => {
      db.get(getImage, (err, row) => {
        if (row.file != "null") {
          deleteImage(row.file);
        }
      })

      db.run(deletePost);
    })

  if (post.password) {
    const currentDate = Date.now();

    db.get(getPassword, (err, row) => {
      if (row.password === post.password) {
        if (row.created - currentDate < postDeleteLimit) {
          queryAndDelete(getImage, deletePost)
        }
      }
    })
  } else {
    queryAndDelete(getImage, deletePost)
  }
}

const newPost = (post: Post, callback?: any) => {
  const {
    board,
    thread,
    created,
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
  const filehash = null;
  const password = null;
  const ip = null;
  const bump = null;
  const sticky = null;
  const locked = null;
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
    db.run(updateBump, _ =>
      db.run(setBump, _ =>
        db.run(sql, (_: any, err: Error | null) => err ? console.log(err) : () => callback.sendStatus(200))));
  }
}

const newThread = (post: Post, res: Response) => {
  const {
    bump,
    board,
    thread,
    created,
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
  const filehash = null;
  const password = null;
  const ip = null;
  const sticky = null;
  const locked = null;
  const sage = null;

  const updateBump = `UPDATE posts_${board} SET bump = (bump + 1) WHERE post = thread;`
  const sql = `INSERT INTO posts_${board}
               VALUES 
               (null,
                "${thread}",
                "${subject}",
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
  const sql2 = `UPDATE posts_${board} SET thread = post WHERE thread = "newthread";`
  db.run(updateBump, (_: any, err: Error) =>
    err ? console.log("updateBump fail: " + err) :
      db.run(sql, (_: any, err: Error) =>
        err ? console.log("sql insert fail: " + err) :
          db.run(sql2, (_: any, err: Error) => err ? console.log("sql update fail: " + err) : 
            pruneThreads(board, res)
          )));
}

const getPosts = (req: Record<string, unknown>, res: Response) => {
  const { query, board, thread, post} = req;
  const result: any = [];
  const partialThreads: any = {};
  let sql;
  let count: number;

  if (query === "post") {
    sql = `SELECT * FROM posts_${board} WHERE post = ${post}`;

    db.each(sql, (err, row) => result.push(row), () => res.send(result));
  }

  if (query === "thread") {
    sql = `SELECT * FROM posts_${board} WHERE thread = ${thread}`;

    if (post !== "null") {
      sql = sql + ` LIMIT ${post}`
    }

    db.each(sql, (err, row) => result.push(row), () => res.send(result));
  }

  if (query === "threads") {
    sql = `SELECT * FROM posts_${board} GROUP BY thread`;

    if (post !== "null") {
      const sql2 = `SELECT * FROM posts_${board} a WHERE a.RowId IN (
                SELECT b.RowId
                  FROM posts_${board} b
                  WHERE a.thread = b.thread
                  ORDER BY b.post DESC LIMIT ${post} 
              ) ORDER BY thread ASC;`

      db.each(sql, (err, row) => partialThreads[row.thread] = [row],
        _ => db.each(sql2, (err, row) => {
          if (row.post != row.thread) {
          partialThreads[row.thread].push(row)
          }
        }, _ => res.send(partialThreads)))
    } else {
      db.each(sql, (err, row) => result.push(row), () => res.send(result));
    }
  }

  if (query === "catalog") {
    sql = `SELECT * FROM posts_${board} GROUP BY thread ORDER BY bump;`
    db.each(sql, (err, row) => result.push(row), () => res.send(result));
  }

  if (query === "omitted") {
    sql = `SELECT COUNT(thread) from posts_${board} WHERE thread=${thread};`

    db.each(sql, (err, row) => {
      count = row['COUNT(thread)'];
    }, () => res.send(count.toString()))
  }
}

const getThreadStats = (board: string, res: Response) => {
  const threads = `SELECT thread FROM posts_${board} GROUP BY thread;`
  const threadStats: any = [];
  let threadCount = 0;

  db.each(threads, (err, row) => {
    const currentThread = { thread: row.thread, posts: 0, images: 0 };
    const postCount = `SELECT COUNT(post) from posts_${board} WHERE thread = ${row.thread};`
    const imageCount = `SELECT COUNT(file) from posts_${board} WHERE thread = ${row.thread} and file != "null";`
    threadCount += 1;

    db.serialize(() => {
      db.get(postCount, (err, row) => {
        const posts = row['COUNT(post)'];
        currentThread.posts = posts;
      })

      db.get(imageCount, (err, row) => {
        const images = row['COUNT(file)'];
        currentThread.images = images;
        threadStats.push(currentThread)

        if (threadCount === threadStats.length) {
          res.send(threadStats)
        }
      })
    })
  })
}

const getBoards = (res?: Response) => {
  const sql = `SELECT * FROM boards;`;
  const result: any = [];

  db.each(sql, (err, row) => result.push(row), () => {
    if (res) {
      res.send(result);
    } else {
      return result;
    }
  });
};

interface DbCall {
  uri: string,
  sql: string
}

const getRoutes = async (res: Response) => {
  const boardList: any = [];
  const dbCalls: DbCall[] = [];
  const sql = 'SELECT * FROM boards';

  function getThreads(call: any) {
    return new Promise((resolve, reject) => {
      db.all(call.sql, (err, rows) => {
        resolve({ uri: call.uri, threads: rows })
        reject((err: Error) => console.log(err))
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

router.post("/login", (req, res) => {
  login(req.body, res);
})

router.post("/news/newpost", (req, res) => {
  const post = req.body;
  const sql = `INSERT INTO news VALUES (
          NULL,
          "${post.subject}",
          "${post.author}",
          "${post.post}",
          CURRENT_TIMESTAMP
        );`
        
  db.run(sql, () => res.sendStatus(200))
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
  const posts: any = [];
  const sql = `SELECT * FROM news ORDER BY postId DESC;`

  db.each(sql, (err, row) => posts.push(row), () => res.send(posts));
})

// Objection.js GET
router.get("/posts/:id",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;
      //@ts-ignore
      const post: PostShape = await PostModel.query().findById(id);
      if (!post) {
        throw new Error('Post not found');
      }

      return response.status(200).send(post);
    } catch (error) {
      return response.status(404).send("Post not found");
    }
  }
)


router.get("/getboards", (req, res) => {
  getBoards(res);
});

router.get("/getthreadstats", (req, res) => {
  const query = url.parse(req.url, true).query;
  const board = query.board;
  getThreadStats(board as string, res);
})

router.get("/routes", (req, res) => {
  getRoutes(res);
});

module.exports = router;