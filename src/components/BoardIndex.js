import React, { useState, useEffect } from "react";
import ReplyArea from "./ReplyArea";
import Post from "./Post";

const OpPost = ({ board, postInfo }) => {
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
  } = postInfo;

  fileSize = Math.ceil(fileSize/1024)
  let fileThumb = null;

  if (file) { fileThumb = file.match(/\d+/)[0] + "s" + file.match(/\..+/)[0] }

  return (
    <div class="thread" id={"t" + post}>
      <div class="postContainer opContainer" id="pc23305178">
        <div id="p23305178" class="post op">
          <div class="postInfoM mobile" id="pim23305178">
            {" "}
            <span class="nameBlock">
              <span class="name">{name}</span>
              <br />
              <span class="subject"></span>{" "}
            </span>
            <span class="dateTime postNum" data-utc="1608668294">
              {created}
            </span>
          </div>
          {file ?
            <div class="file" id="f23305178">
              <div class="fileText" id="fT23305178">
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
                  alt="99 KB"
                  data-md5="o8zbjchriU4F2ss1izSoDA=="
                />
                </a>
                <div data-tip data-tip-cb="mShowFull" class="mFileInfo mobile">
                  99 KB JPG
              </div>
              </a>
            </div>
            : null}
          <div class="postInfo desktop" id="pi23305178">
            <input type="checkbox" name="23305178" value="delete" />{" "}
            <span class="subject">{subject}</span>{" "}
            <span class="nameBlock">
              <span class="name">{name}</span>{" "}
            </span>{" "}
            <span class="dateTime" data-utc="1608668294">
              {created}
            </span>{" "}
            <span class="postNum desktop">
              <a href="thread/23305178#p23305178" title="Link to this post">
                No. {post}
              </a>
              <a href="thread/23305178#q23305178" title="Reply to this post">
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
          <blockquote class="postMessage" id="m23305178">
            {comment}
          </blockquote>
        </div>
      </div>
    </div>
  );
};

const BoardIndex = ({ uri }) => {
  const [threads, setThreads] = useState(null);
  const api = (option) => "http://localhost:5001/api/" + option;

  // const Posts = ({ posts }) => (
  //   <div className="Post">
  //     {posts.map(post => (
  //       post.thread === threadId ? <Post post={post} /> : null
  //     ))}
  //   </div>
  // );

  const BumpSortedThreads = ({ uri, threads }) => {
    const opPosts =  threads.filter(post => post.post == post.thread)
    const sortedThreads = opPosts.sort((a, b) => a.bump - b.bump);
    const threadPosts = threads.filter(post => post.post != post.thread)
    const threadAndPosts = [];

    let t = 1;
    for (let thread of sortedThreads) {
      let op = <OpPost board={uri} postInfo={thread} />;
      threadAndPosts.push(op)
      
      for (let post of threadPosts) {
        if (post.thread === thread.post) {
          threadAndPosts.push(<Post post={post} />)     
        }
      }

      threadAndPosts.push(<hr class="desktop" id="op" />)
    }

    return (
      <div>
        {/* {sortedThreads.map(thread => 
          <OpPost board={uri} postInfo={thread} />
          threadPosts.map(post => thread.thread === post.thread ? <Post post={post} /> : <div>what</div>)
        )} */}
        {threadAndPosts.map(thread => thread)}
      </div>
    )
  }

  // Here 'post' is the number of posts per thread to get
  // Change this so I don't have to re-use &post for something different
  let post = 6;
  const reqString = `/?query=threads&board=${uri}&thread=null&post=${post}`;

  const getThreads = () =>
    fetch(api("getposts" + reqString))
      .then((resp) => resp.json())
      .then(resp => {
        console.log(resp)
        setThreads(resp);
      })


  useEffect(() => {
    getThreads();
  }, []);

  return (
    <div>
      <ReplyArea index={true} uri={uri} id={null}  /> 
      <hr class="desktop" id="op" />
      {threads ? <BumpSortedThreads uri={uri} threads={threads} /> : null}
    </div>
  );
};

export default BoardIndex;
