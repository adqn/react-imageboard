import React, { useState, useEffect } from "react";
import ReplyArea from "./ReplyArea";
import Post from "./Post";

const OpPost = ({ board, opPost }) => {
  let {
    post,
    thread,
    subject,
    created,
    email,
    name,
    comment,
    file,
    fileSize,
    fileWidth,
    fileHeight
  } = opPost;

  fileSize = Math.ceil(fileSize / 1024)
  let fileThumb = null;

  if (file) { fileThumb = file.match(/\d+/)[0] + "s" + file.match(/\..+/)[0] }

  const Op = () =>
    <div class="thread" id={"t" + opPost.post}>
      <div class="postContainer opContainer" id="">
        <div id="" class="post op">
          <div class="postInfoM mobile" id="">
            {" "}
            <span class="nameBlock">
              <span class="name">{name}</span>
              <br />
              <span class="subject"></span>{" "}
            </span>
            <span class="dateTime postNum" data-utc="">
              {created}
            </span>
          </div>
          {file ?
            <div class="file" id="">
              <div class="fileText" id="">
                File:{" "}
                <a href={"http://localhost:5001/img/" + file} target="_blank">
                  {file}
                </a>{" "}
          ({fileSize} KB, {fileWidth + "x" + fileHeight}) <a>google yandex iqdb wait</a>
              </div>
              <a
                class="fileThumb"
                href={"http://localhost:5001/img/" + fileThumb}
                target="_blank"
              >
                <a href={"http://localhost:5001/img/" + file}>
                  <img
                    src={"http://localhost:5001/img/" + fileThumb}
                    alt=""
                    data-md5=""
                  />
                </a>
              </a>
            </div>
            : null}
          <div class="postInfo desktop" id="">
            <input type="checkbox" name="" value="delete" />{" "}
            <span class="subject">{subject}</span>{" "}
            <span class="nameBlock">
              <span class="name">{name}</span>{" "}
            </span>{" "}
            <span class="dateTime" data-utc="">
              {created}
            </span>{" "}
            <span class="postNum desktop">
              <a href="" title="Link to this post">
                No. {post}
              </a>
              <a href="" title="Reply to this post">
                {/* {post} */}
              </a>{" "}
              &nbsp;
              <span>
                [
                <a
                  href={"/" + board + "/thread/" + post + "/"}
                  class="replylink"
                >
                  Reply
                </a>
                ]
              </span>
            </span>
          </div>
          <blockquote class="postMessage" id="">
            {comment}
          </blockquote>
        </div>
      </div>
    </div>

  return (
    <div>
      {post === thread ? <Op /> : <Post post={opPost} />}
    </div>
  );
};

const BoardIndex = ({ uri }) => {
  const [threads, setThreads] = useState(null);
  const api = (option) => "http://localhost:5001/api/" + option;

  const PostsOmitted = numPosts =>
    <div>
      <b>+</b> <i>Some posts omitted...</i>
    </div>

  const BumpSortedThreads = ({ uri, threads }) => {
    let bumpOrder = {};
    let tempThreads = {};
    let finalThreads = [];

    for (let thread in threads) {
      let threadId = thread;
      let bump = threads[thread][0].bump;
      bumpOrder[threadId] = bump;
    }

    let keys = Object.keys(bumpOrder)
    bumpOrder = keys.sort((a, b) => bumpOrder[a] - bumpOrder[b])

    for (let thread of bumpOrder) {
      tempThreads[' ' + thread] = threads[thread]
    }

    for (let thread in tempThreads) {
      for (let post of tempThreads[thread]) {
        let thePost;
        if (post.post === post.thread) {
          thePost =
              <OpPost board={uri} opPost={post} />
          if (tempThreads[thread].length > 5) {
            thePost = 
              <div>
              <OpPost board={uri} opPost={post} />
              <PostsOmitted />
              </div>
          }
        } else {
          thePost = <Post post={post} />
        }
        finalThreads.push(thePost)
      }
      finalThreads.push(<hr class="desktop" id="op" />)
    }

    return (
      <div>
        {finalThreads}
      </div>
    )
  }

  // Here 'post' is the number of posts per thread to get
  // Change this so I don't have to re-use &post for something different
  let post = 5;
  const reqString = `/?query=threads&board=${uri}&thread=null&post=${post}`;

  const getThreads = () =>
    fetch(api("getposts" + reqString))
      .then((resp) => resp.json())
      .then(resp => {
        setThreads(resp);
      })


  useEffect(() => {
    getThreads();
  }, []);

  return (
    <div>
      <ReplyArea index={true} uri={uri} id={null} />
      <hr class="desktop" id="op" />
      {threads ? <BumpSortedThreads uri={uri} threads={threads} /> : null}
    </div>
  );
};

export default BoardIndex;
