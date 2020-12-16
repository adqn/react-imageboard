const http = require('http')
const path = require('path')
const express = require('express')
const sqlite3 = require('sqlite3')

const schema = `CREATE TABLE IF NOT EXISTS post ( 
    postId INTEGER NOT NULL AUTOINCREMENT,
    threadId INTEGER NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    postName TEXT NOT NULL,
    comment TEXT NOT NULL,
    FOREIGN KEY (threadId) 
    REFERENCES threads (threadId)
      ON UPDATE CASCADE
      ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS threads (
    threadId INTEGER NOT NULL,
    opComment TEXT NOT NULL
);`

const testPost = [
  {
    boardId: 1,
    threadId: 1,
    postId: 1,
    name: "Anonymous",
    comment: "first post"
  }
]

const app = express() 

app.use(express.urlencoded())
app.use(express.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

let db = new sqlite3.Database('./api/db/board.db', (err) => {
  if (err) {
    console.log("Unable to open board database: \n" +  "\t" + err.message)
  } else {
    console.log("Board database up")
  }

  db.exec('PRAGMA foreign_keys = ON;', (err) => {
    if (err) {
      console.log("Couldn't enable foreign keys")
    } else {
      console.log("Foreign keys enabled")
    }
  })
})

db.serialize(() => {
  db.exec(schema, err => {
    if (err) {
      console.log("Unable to import database schema")
    }
  })
})

//
// post functions
//

function newPost(postJson) {
  let { boardId, threadId, postId, name, comment } = postJson;
  sql = ``;

  db.run(sql, function(err) {
    //
  })
}

// retrieve posts 
function getPosts() {}

// retrieve single post 
function getPost() {
  sql = ``;

  db.get(sql, (err, row) => {
    //
  })
}

//
// routes
//

app.get('/', (req, res) => {
  res.send('Hi!')
})

app.get('/api/testpost', (req, res) => {
  res.send(JSON.stringify(testPost))
})

app.post('/api/newpost', (req, res) => {
  console.log(req.body)
  res.sendStatus(200)
})

// query for thread ID (no separate boards for now)
app.get('/api/posts', (req, res) => {
  getPosts();
})

const port = 5001;
const server = app.listen(port, () => console.log("Imageboard server listening on port: " + port))
