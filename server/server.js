const http = require('http')
const express = require('express')

// const hostname = '127.0.0.1'
// const port = '5001'

// const server = http.createServer((req, res) => {
//   res.statusCode = 200
//   res.setHeader('Content-Type', 'text/plain')
//   res.end("Hello")
// })

// server.listen(port, hostname, () => {
//   console.log('server up')
// })


const app = express()

app.get('/', (req, res) => {
  res.send('Hi!')
})

const server = app.listen(5001, () => console.log("server up"))
