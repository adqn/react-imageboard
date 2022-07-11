import { text } from "body-parser";
import React, { useState } from "react";
import { formatComment } from "../helpers/postHelpers.js";

const quote = (id) => "javascript:quote(" + id + ");";

const linkEmail = (email, name) => <a href={"mailto: " + email}>{name}</a>;

const PostInfo = ({ uri = null, post }) => (
  <div class="postInfo" id={post.post}>
    <input type="checkbox" name={post.post} value="delete" />
    <span class="subject">{post.subject ? " " + post.subject : null}</span>{" "}
    <span class="nameBlock">
      <span class="name">
        {post.email === "" ? post.name : linkEmail(post.email, post.name)}
      </span>
    </span>
    <span class="dateTime" data-utc="">
      {" "}
      {post.created}
    </span>
    <span class="postNum">
      <a href={"#p" + post.post} title="Link to this post">
        {" "}
        No. {post.post + " "}
      </a>
      <a href={quote(post.post)} title="Reply to this post"></a>
    </span>
    {uri && post.post === post.thread ? (
      <span>
        &nbsp; [
        <a href={"/" + uri + "/thread/" + post.thread + "/"} class="replylink">
          Reply
        </a>
        ]
      </span>
    ) : null}
  </div>
);

const Post = ({ uri = null, post }) => {
  const [imageExpanded, setImageExpanded] = useState(false);

  const handleImageClick = (e) => {
    setImageExpanded(!imageExpanded);
    e.preventDefault();
  };

  let { thread, comment, file, fileOrig, fileSize, fileWidth, fileHeight } =
    post;
  const id = post.post;
  let fileThumb = null;
  let thumb_w;
  let thumb_h;
  let ratio;
  let commentFormatted = formatComment(comment);

  fileSize = Math.ceil(fileSize / 1024);

  if (file != null && file !== "null" && file !== "undefined") {
    fileThumb = file.match(/\d+/)[0] + "s" + file.match(/\..+/)[0];

    if (id !== thread) {
      ratio = fileWidth > fileHeight ? 125 / fileWidth : 125 / fileHeight;
      thumb_w = fileWidth * ratio;
      thumb_h = fileHeight * ratio;
    }
  }

  return (
    <div
      class={
        "postContainer" + (id === thread ? "opContainer" : "replyContainer")
      }
      id={id}
    >
      <div class="sideArrows" id={"sa" + id}>
        {id !== thread ? ">>" : null}
      </div>
      <div id={"p" + id} class={id === thread ? "post op" : "post reply"}>
        {id !== thread ? <PostInfo post={post} /> : null}
        {file !== "null" && file != null ? (
          <div class="file" id="">
            <div class="fileText" id="">
              File:{" "}
              <a href={"http://localhost:5001/img/" + file} target="_blank">
                {fileOrig}
              </a>{" "}
              ({fileSize} KB, {fileWidth + "x" + fileHeight})
              <div class="post spacer"></div>
            </div>
            <a
              class="fileThumb"
              href={"http://localhost:5001/img/" + file}
              target="_blank"
            >
              <img
                src={
                  imageExpanded
                    ? "http://localhost:5001/img/" + file
                    : "http://localhost:5001/img/" + fileThumb
                }
                alt={fileSize}
                data-md5=""
                style={
                  id === thread ? null : { height: thumb_h, width: thumb_w }
                }
                onClick={(e) => handleImageClick(e)}
              />
            </a>
          </div>
        ) : null}

        {id === thread ? <PostInfo uri={uri} post={post} /> : null}

        <blockquote class="postMessage" id={id}>
          {comment}
          {/* {commentFormatted} */}
        </blockquote>
      </div>
    </div>
  );
};

export default Post;
