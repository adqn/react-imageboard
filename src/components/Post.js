import { text } from 'body-parser';
import React from 'react';

const quote = id =>
  'javascript:quote(' + id + ');'

const PostInfo = ({ post }) =>
  <div class="postInfo desktop" id={"pi" + post.post}>
    <input type="checkbox" name={post.post} value="delete" />
    {" "}
    <span class="subject">{post.subject}</span>{" "}
    <span class="nameBlock">
      <span class="name">{" "}{post.name} </span>
    </span>

    <span class="dateTime" data-utc="">
      {" "}{post.created}
    </span>

    <span class="postNum desktop">
      <a href={'#p' + post.post} title="Link to this post"> No. {post.post + " "}</a>
      <a href={quote(post.post)} title="Reply to this post"></a>
    </span>
  </div>

const Post = ({ post }) => {
  let { thread, subject, name, created, comment, file } = post;
  let id = post.post;
  let fileThumb = null;

  if (file != null && file != "null") { fileThumb = file.match(/\d+/)[0] + "s" + file.match(/\..+/)[0] }

  return (
    <div class={"postContainer" + (id === thread ? "opContainer" : "replyContainer")} id={id}>
      <div class="sideArrows" id={"sa" + id}>
        {id != thread ? ">>" : null}
      </div>
      <div id={"p" + id} class={id == thread ? "post op" : "post reply"}>

        {id != thread ? <PostInfo post={post} /> : null}

        {file != "null" && file != null ?
          <div class="file" id="f23305178">
            <div class="fileText" id="fT23305178">
              File:{" "}
              <a href={"http://localhost:5001/img/" + file} target="_blank">
                {file}
              </a>{" "}
          (99 KB, 1400x830) <a>google yandex iqdb wait</a>
            </div>
            <a
              class="fileThumb"
              href={"http://localhost:5001/img/" + file}
              target="_blank"
            >
              <img
                src={"http://localhost:5001/img/" + fileThumb}
                alt="99 KB"
                data-md5="o8zbjchriU4F2ss1izSoDA=="
                style={id === thread ? null : { height: "148px", width: "150px" }}
              />
              <div data-tip data-tip-cb="mShowFull" class="mFileInfo mobile">
                99 KB JPG
          </div>
            </a>
          </div>
          : null}

        {id === thread ? <PostInfo post={post} /> : null}

        <blockquote class="postMessage" id={id}>
          {comment}
        </blockquote>
      </div>
    </div>
  )
}

export default Post;