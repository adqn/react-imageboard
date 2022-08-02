"use strict";

import path from "path";
import fs from "fs";
import express, { request, Request, Response } from "express";
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

const getPosts = async (req: Record<string, unknown>, res: Response) => {
  PostModel.tableName = "posts_" + req.board;

  if (req.query === "post") {
    try {
      const posts = await PostModel.query();
      res.status(200).send(posts);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  else if (req.query === "thread") {
    try {
      const thread = await PostModel.query()
        .select("thread", "=", req.thread);
      res.status(200).send(thread);
    } catch (error) {
      res.status(404).send(error);
    }
  }

  else if (req.query === "threads") {
    try {
    } catch (error) {
    }
  }
}

const newPost = async (req: Request, res: Response) => {
  const password = "test";
  const filehash = null;
  const ip = null;
  const sticky = null;
  const locked = null;

  PostModel.tableName = "posts_" + req.body.board;

  try {
    const newPost = await PostModel.query().insert({
      thread: req.body.thread,
      subject: req.body.subject,
      email: req.body.email,
      name: req.body.name,
      comment: req.body.comment,
      sage: req.body.sage,
      bump: null,
      password: password,
      file: req.body.file,
      fileOrig: req.body.fileOrig,
      fileSize: req.body.fileSize,
      fileHeight: req.body.fileHeight,
    });
    
    if (!req.body.sage) {
      await PostModel.query()
        .increment("bump", 1)
        .where("thread", "=", "post")
        .then(async () => await PostModel.query()
          .patch({ bump: 1 })
          .where("thread", "=", req.body.thread))
    }
  } catch (error) { 
    res.send(error);
  }
}

router.get("/posts/:board/:id",
  async (request: Request, response: Response) => {
    try {
      const { board, id } = request.params;
      PostModel.tableName = `posts_${board}`;
      const post = await PostModel.query().findById(id);
      if (!post) {
        throw new Error('Post not found');
      }

      return response.status(200).send(post.postInfo());
    } catch (error) {
      return response.status(404).send("Post not found");
    }
  }
)

module.exports = router;