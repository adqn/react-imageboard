import express, { Express, Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import fileUpload from "express-fileupload";
import fs from "fs";
import sqlite3 from "sqlite3";
import path from "path";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const api = require('./api/api');

dotenv.config();
const app: Express = express();
const port = 5001;

app.use(express.urlencoded());
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(fileUpload({ createParentPath: true }))
app.use('/img', express.static('./api/img'));
app.use('/api', api);

app.get("/test", (req: Request, res: Response) => {
  res.writeHead(200, { "content-type": "text/html" });
  fs.createReadStream(__dirname + "/api/test.html").pipe(res);
});

app.listen(port, () =>
  console.log("Server listening on port " + port)
);