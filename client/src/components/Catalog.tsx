import React, { useState, useEffect } from "react";
import ReplyArea from "./ReplyArea";
import { formatComment } from "../helpers/postHelpers.js";

const api = (option: string) => "http://localhost:5001/api/" + option;

const getThumb = (fileName: string) => {
  const name = fileName.match(/\d+/)![0];
  const ext = fileName.match(/\..+/)![0];

  return name + "s" + ext;
};

const mapStatsToThreads = (threads: any, threadStats: any) => {
  const mappedThreads = [];

  for (const thread of threads) {
    for (const stats of threadStats) {
      if (stats.thread === thread.thread) {
        thread.posts = stats.posts;
        thread.images = stats.images;
        mappedThreads.push(thread);
      }
    }
  }

  return mappedThreads;
};

interface Post {
  bump: number;
  id: number;
  board: string;
  thread: number;
  subject: string;
  email: string;
  name: string;
  comment: string;
  file: string;
  password: string;
  fileOrig: string;
  fileSize: string;
  fileWidth: string;
  fileHeight: string;
  sage: boolean;
  created: string;
  posts?: any;
  images?: any;
}

const OpPost = ({ post }: { post: Post }) => {
  const { thread, subject, file, fileWidth, fileHeight, posts, images } = post;
  let thumb_h;
  let thumb_w;
  let ratio;
  //let comment = formatComment(post.comment);

  if (Number(fileWidth) > 150 || Number(fileHeight) > 150) {
    ratio =
      fileWidth > fileHeight
        ? 150 / Number(fileWidth)
        : 150 / Number(fileHeight);
    thumb_w = Number(fileWidth) * ratio;
    thumb_h = Number(fileHeight) * ratio;
  } else {
    thumb_w = fileWidth;
    thumb_h = fileHeight;
  }

  return (
    <div className="catalog opPost">
      <a href={"./thread/" + thread}>
        <img
          src={"http://localhost:5001/img/" + getThumb(file)}
          style={{ width: thumb_w, height: thumb_h }}
          alt=""
        />
      </a>
      <span className="catalog threadInfo">
        P: {posts} / I: {images} / 0
      </span>
      <span className="catalog threadSubject">{subject}</span>
      <div className="postMessage">{formatComment(post.comment)}</div>
    </div>
  );
};

const Catalog = ({ uri }: { uri: string }) => {
  const [mappedThreads, setMappedThreads] = useState<any>([]);

  const getThreads = () => {
    const threadReq = `/?query=catalog&board=${uri}&thread=null&post=null`;
    fetch(api("getposts") + threadReq)
      .then((resp) => resp.json())
      .then((resp) => getThreadStats(resp));
  };

  const getThreadStats = (threads: any) => {
    const threadStatsReq = `/?board=${uri}`;
    fetch(api("getthreadstats") + threadStatsReq)
      .then((resp) => resp.json())
      .then((resp) => {
        const mappedThreads = mapStatsToThreads(threads, resp);
        setMappedThreads(mappedThreads as any);
      });
  };

  useEffect(() => {
    getThreads();
  }, []);

  return (
    <div>
      <ReplyArea index={true} uri={uri} id={null} />
      <hr />
      <div className="navLinks">
        [<a href="../../">Home</a>] [<a href={"/" + uri}>Index</a>] [
        <a href="#update" onClick={() => getThreads()}>
          Update
        </a>
        ]
      </div>
      <hr />
      <div className="catalog container">
        {mappedThreads
          ? mappedThreads.map((post: any) => <OpPost post={post} />)
          : null}
      </div>
    </div>
  );
};

export default Catalog;
