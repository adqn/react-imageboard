import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import Knex from "knex";
import { Model } from "objection";

export const db = new sqlite3.Database("./api/db/boards.db", (err) => {
  if (err) {
    console.log("Unable to open database: \n" + "\t" + err.message);
  } else {
    console.log("Board database up");
  }
});

const createDb = () =>
  new Promise((resolve, reject) =>
    fs.readFile(path.join(__dirname, "../schema.sql"), (err, data) => {
      if (err) return reject(err);

      db.exec(data.toString(), (err) => {
        if (err) return reject(err);
        resolve("Board database initialized");
      });
    })
  );

// createDb();

 export const knexdb = Knex({
  client: "sqlite3",
  connection: {
    filename: "./db/boards.db",
    database: "boards_test",
  },
  useNullAsDefault: true,
  migrations: {
    directory: "./db/migrations",
  }
})