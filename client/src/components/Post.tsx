import { text } from "body-parser";
import React, { useState } from "react";
import { formatComment } from "../helpers/postHelpers.js";

const quote = (id: string) => "javascript:quote(" + id + ");";

const linkEmail = (email: string, name: string) => (
  <a href={"mailto: " + email}>{name}</a>
);

const PostInfo = ({ uri = null, post }: { uri?: string | null; post: any }) => (
  <div className="postInfo" id={post.post}>
    <input type="checkbox" name={post.post} value="delete" />
    <span className="subject">
      {post.subject ? " " + post.subject : null}
    </span>{" "}
    <span className="nameBlock">
      <span className="name">
        {post.email === "" ? post.name : linkEmail(post.email, post.name)}
      </span>
    </span>
    <span className="dateTime" data-utc="">
      {" "}
      {post.created}
    </span>
    <span className="postNum">
      <a href={"#p" + post.post} title="Link to this post">
        {" "}
        No. {post.post + " "}
      </a>
      <a href={quote(post.post)} title="Reply to this post"></a>
    </span>
    {uri && post.post === post.thread ? (
      <span>
        &nbsp; [
        <a
          href={"/" + uri + "/thread/" + post.thread + "/"}
          className="replylink"
        >
          Reply
        </a>
        ]
      </span>
    ) : null}
  </div>
);

const Post = ({ uri = null, post }: { uri?: string | null; post: any }) => {
  const [imageExpanded, setImageExpanded] = useState(false);

  const handleImageClick = (e: any) => {
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
      className={
        "postContainer" + (id === thread ? "opContainer" : "replyContainer")
      }
      id={id}
    >
      <div className="sideArrows" id={"sa" + id}>
        {id !== thread ? ">>" : null}
      </div>
      <div id={"p" + id} className={id === thread ? "post op" : "post reply"}>
        {id !== thread ? <PostInfo post={post} /> : null}
        {file !== "null" && file != null ? (
          <div className="file" id="">
            <div className="fileText" id="">
              File:{" "}
              <a href={"http://localhost:5001/img/" + file} target="_blank">
                {fileOrig}
              </a>{" "}
              ({fileSize} KB, {fileWidth + "x" + fileHeight})
              <div className="post spacer"></div>
            </div>
            <a
              className="fileThumb"
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
                  id === thread
                    ? undefined
                    : { height: thumb_h, width: thumb_w }
                }
                onClick={(e) => handleImageClick(e)}
              />
            </a>
          </div>
        ) : null}

        {id === thread ? <PostInfo uri={uri} post={post} /> : null}

        <blockquote className="postMessage" id={id}>
          {comment}
          {/* {commentFormatted} */}
        </blockquote>
      </div>
    </div>
  );
};

export default Post;
