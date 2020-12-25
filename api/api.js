const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3");
const fs = require("fs");
const url = require("url");
// const async = require('async');

let db = new sqlite3.Database("./api/db/db.db", (err) => {
  if (err) {
    console.log("Unable to open board database: \n" + "\t" + err.message);
  } else {
    console.log("Board database up");
  }
});

const createDb = () =>
  new Promise((resolve, reject) =>
    fs.readFile(path.join(__dirname, "./schema.sql"), (err, data) => {
      if (err) return reject(err);

      db.exec(data.toString(), (err) => {
        if (err) return reject(err);
        resolve();
      });
    })
  );

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

function newThread(thread) {
  let { board, newThreadId, subject, email, name, comment } = thread;
  const sql = `INSERT INTO posts_${board} 
                    VALUES 
                    (NULL,
                      ${newThreadId},
                      "${subject}",
                      current_timestamp,
                      "${email}",
                      "${name}",
                      "${comment}",
                      NULL);`; 

  db.run(sql);
}

function getPosts(req, callback) {
  let { query, board, thread, post } = req;
  let sql;

  if (query === "post") {
    sql = `SELECT * FROM posts_${board}
                        WHERE post = ${post}`;
  }

  if (query === "thread") {
    sql = `SELECT * FROM posts_${board} 
                        WHERE
                        thread = ${thread}`;
  }

  if (query === "threads") {
    sql = `SELECT * FROM posts_${board} GROUP BY thread`;
  }

  if (query === "opPost") {
    sql = `SELECT * FROM posts_${board}
              GROUP BY thread`;
  }

  let result = [];

  db.serialize(() => {
    db.each(
      sql,
      (err, row) => {
        result.push(row);
      },
      () => callback.send(result)
    );
  });
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
  let promises = [];
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
          .then(() => {boardList.length === dbCalls.length ? res.send(boardList) : null})
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
  // res.header('Cache-Control',  'no-store, must-revalidate');
  // res.header('Pragma', 'no-cache');
  // res.header('Expires', '0');
  next();
});

app.get("/test", (req, res) => {
  res.writeHead(200, { "content-type": "text/html" });
  fs.createReadStream(__dirname + "/test.html").pipe(res);
});

app.post("/api/newthread", (req, res) => {
  newThread(req.body);
  res.sendStatus(200);
});

app.get("/api/testpost", (req, res) => {
  res.send(JSON.stringify(testPost));
});

app.post("/api/newpost", (req, res) => {
  newPost(req.body);
  res.sendStatus(200);
});

// query for thread ID (no separate boards for now)
app.get("/api/getposts", (req, res) => {
  const query = url.parse(req.url, true).query;
  getPosts(query, res);
  // res.sendStatus(200)
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

createDb();

//
// tests
//

// for (let post of testPosts) {
//   newPost(post);
// }
// getRoutes();