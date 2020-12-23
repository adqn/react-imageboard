const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3");
const fs = require("fs");
const url = require("url");

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
  let { thread, email, name, comment, file } = post;
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

function newThread(board, post) {
  let { subject, email, name, comment } = post;
  const sql = `INSERT INTO posts_${board} 
                     VALUES 
                     (NULL,
                      ${newThread},
                      "${subject}",
                      current_timestamp,
                      "${email}",
                      "${name}",
                      "${comment}",
                      NULL);`;

  let maxThread = "SELECT * FROM threads ORDER BY thread DESC LIMIT 1;";
  let newThread;

  db.serialize(() => {
    db.get(maxThread, (row) => {
      newThread = row.thread + 1;
    });

    db.exec(sql);
  });
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
      () => callback.send(result)
    );
  });
};

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

app.get("/test", (req, res) => {
  res.writeHead(200, { "content-type": "text/html" });
  fs.createReadStream(__dirname + "/test.html").pipe(res);
});

app.get("/api/newthread", (req, res) => {
  newThread(req.body);
  res.sendStatus(200);
});

app.get("/api/testpost", (req, res) => {
  res.send(JSON.stringify(testPost));
});

app.post("/api/newpost", (req, res) => {
  console.log(req.body);
  newPost(req.body);
  //.then
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