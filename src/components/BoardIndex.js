import React, { useState, useEffect } from "react";
import ReplyArea from "./ReplyArea";

const OpPost = ({ board, postInfo }) => {
  const {
    post,
    thread,
    subject,
    created,
    email,
    name,
    comment,
    file,
  } = postInfo;

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
              (99 KB, 1400x830)
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
      <hr class="desktop" id="op" />
    </div>
  );
};

const Catalog = ({ uri }) => {
  const [threads, setThreads] = useState(null);
  const api = (option) => "http://localhost:5001/api/" + option;

  const reqString = `/?query=threads&board=${uri}&thread=null&post=null`;

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
      <ReplyArea index={true} uri={uri} id={null}  /> 
      <hr class="desktop" id="op" />
      {threads ? threads.map((thread) => <OpPost board={uri} postInfo={thread} />) : null}
    </div>
  );
};

export default Catalog;
