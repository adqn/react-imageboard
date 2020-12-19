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

const app = express() 

app.use(express.urlencoded())
app.use(express.json())
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

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

createDb();


//
// post functions
//

function newPost(post) {
  let {threadId, name, comment} = post;
  const postSql = `INSERT INTO posts 
                   (threadId, postName, comment)
                   VALUES 
                   (${threadId},
                    '${name}', 
                    '${comment}');`

  db.serialize(() => {
    db.run(postSql, err => {
      if (err) {console.log(err)}
    })
  })               
}

function newThread(post) {
  let {comment} = post;
  const threadSql = `INSERT INTO threads 
                     (opComment) 
                     VALUES 
                     ('${comment}');`

  db.serialize(() => {
    db.run(threadSql, err => {
      if (err) {console.log(err)}
    })

    newPost(post);
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
  // newPost(req.body)
  //.then
  res.sendStatus(200)
})

// query for thread ID (no separate boards for now)
app.get('/api/posts', (req, res) => {
  getPosts();
})

const port = 5001;
const server = app.listen(port, () => console.log("Server listening on port: " + port))