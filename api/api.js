const http = require('http')
const path = require('path')
const express = require('express')
const sqlite3 = require('sqlite3')
const fs = require('fs')

const testPosts = [
  {
    threadId: 1,
    name: "Anonymous",
    comment: "first post"
  },
  {
    threadId: 1,
    name: "Anonymous",
    comment: "second post",
  },
  {
    threadId: 1,
    name: "Anonymous",
    comment: "third post",
  }
]

let db = new sqlite3.Database('./api/db/testboard.db', (err) => {
  if (err) {
    console.log("Unable to open board database: \n" +  "\t" + err.message)
  } else {
    console.log("Board database up")
  }

  db.exec('PRAGMA foreign_keys = ON;', (err) => {
    if (err) {
      console.log("Couldn't enable foreign keys")
    } 
  })
})

const createDb = () => new Promise((resolve, reject) =>
 fs.readFile( path.join(__dirname, "./schema.sql"),
  (err, data) => {
   if (err) return reject(err);
   db.exec(data.toString(), (err) => {
    if (err) return reject(err);
    resolve();
   })
  }))

//
// post functions
//

function newPost(post) {
  let {threadId, name, comment} = post;
  const sql = `INSERT INTO posts 
                   (threadId, postName, comment)
                   VALUES 
                   (${threadId},
                    '${name}', 
                    '${comment}');`

  db.run(sql, err => {
    if (err) {console.log(err)}
  })
}

function newThread(post) {
  let {comment} = post;
  const sql = `INSERT INTO threads 
                     (opComment) 
                     VALUES 
                     ('${comment}');`

  let sql2 = 'SELECT * FROM threads ORDER BY threadId DESC LIMIT 1;';
  let lastThreadId;

  db.serialize(() => {
    db.run(sql, err => {
      if (err) {console.log(err)}
    })

    db.get(sql2, row => {
      lastThreadId = row.threadId;       
      post.threadId = lastThreadId;
      newPost(post)
    })
  })
}

function getPosts(req) {
  let {boardId, threadId, postId} = req;
  let sql;
  let result = {};

  if (boardId === 'all') {
    sql = 'SELECT * FROM boards;'
  } else {
    sql = `SELECT * FROM boards WHERE boardId = ${boardId};`
  }

  if (threadId === 'all') {
    sql = 'SELECT * FROM threads;'
  } else {
    sql = `SELECT * FROM threads WHERE threadId = ${threadId};`
  }

  if (postId === 'all') {
      sql = 'SELECT * FROM posts;'
  } else {
      sql = `SELECT * FROM posts WHERE postId = ${postId};`
  }

  db.serialize(() => {
    db.each(sql, (err, row) => {

    })
  })
}

//
// routes
//

const app = express() 

app.use(express.urlencoded())
app.use(express.json())
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.get('/', (req, res) => {
  res.send('Hi!')
})

app.get('/api/newthread', (req, res) => {
  newThread(req.body)
  res.sendStatus(200)
})

app.get('/api/testpost', (req, res) => {
  res.send(JSON.stringify(testPost))
})

app.post('/api/newpost', (req, res) => {
  console.log(req.body)
  // newPost(req.body)
  //.then
  res.sendStatus(200)
})

// query for thread ID (no separate boards for now)
app.get('/api/getposts', (req, res) => {
  getPosts(req.body)
  res.sendStatus(200)
})

const port = 5001;
const server = app.listen(port, () => console.log("Server listening on port " + port))

createDb();

//
// tests
//

// for (let post of testPosts) {
//   newPost(post);
// }