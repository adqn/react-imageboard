const http = require('http')
const path = require('path')
const express = require('express')
const sqlite3 = require('sqlite3')

const app = express() 

// const dbPath = path.resolve(__dirname)
let db = new sqlite3.Database('./api/db/board.db', (err) => {
  if (err) {
    console.log("Unable to open board database: \n" +  "\t" + err.message)
  } else {
    console.log("Board database up")
  }
})

app.get('/', (req, res) => {
  res.send('Hi!')
})

app.get('/newpost', (req, res) => {})

// query for thread ID (no separate boards for now)
app.get('/posts', (req, res) => {})

const port = 5001;
const server = app.listen(port, () => console.log("Imageboard server listening on port: " + port))
