import { text } from 'body-parser';
import React from 'react';

const quote = id =>
  'javascript:quote(' + id + ');'

const linkEmail = (email, name) => 
  <a href={"mailto: " + email}>{name}</a>

const regs = {
  quote: /^>[^>].+/,
  quoteLink: />>\d+/
}

const PostInfo = ({ post }) =>
  <div class="postInfo desktop" id={post.post}>
    <input type="checkbox" name={post.post} value="delete" />
    {" "}
    <span class="subject">{post.subject}</span>{" "}
    <span class="nameBlock">
      <span class="name">
        {" "}{post.email === "" ? post.name : linkEmail(post.email, post.name)}</span>
    </span>

    <span class="dateTime" data-utc="">
      {" "}{post.created}
    </span>

    <span class="postNum desktop">
      <a href={'#p' + post.post} title="Link to this post"> No. {post.post + " "}</a>
      <a href={quote(post.post)} title="Reply to this post"></a>
    </span>
  </div>

const formatComment = ( threadId, comment ) => {
  let lines = comment.split("\n");
  
  for (let i in lines) {
    if (lines[i].match(regs.quote)) {
      let newLine = lines => <span class="quote">{lines}</span>
      i == 0 ? lines[i] = newLine(lines[i] + "\n") : lines[i] = newLine("\n" + lines[i] + "\n")
    }

    else if (lines[i].match(regs.quoteLink)) {
      let replyQuote = lines[i].match(regs.quoteLink)[0];
      let postLinked = replyQuote.slice(2);
      let surrounding = lines[i].split(regs.quoteLink);
      let newLine =
        <div>
          {surrounding[0]}
          <a href={"#p" + postLinked} class="quotelink">{replyQuote}</a>
          {surrounding[1]}
        </div>

      lines[i] = newLine;
    }
  }

  return lines;
}

const Post = ({ post }) => {
  let {
    thread,
    subject,
    name,
    created,
    comment,
    file,
    fileSize,
    fileWidth,
    fileHeight
  } = post;
  let commentFormatted = formatComment(thread, comment);
  let id = post.post;
  let fileThumb = null;
  fileSize = Math.ceil(fileSize/1024)

  if (file != null && file != "null") { fileThumb = file.match(/\d+/)[0] + "s" + file.match(/\..+/)[0] }

  return (
    <div class={"postContainer" + (id === thread ? "opContainer" : "replyContainer")} id={id}>
      <div class="sideArrows" id={"sa" + id}>
        {id != thread ? ">>" : null}
      </div>
      <div id={"p" + id} class={id == thread ? "post op" : "post reply"}>
        {id != thread ? <PostInfo post={post} /> : null}
        {file != "null" && file != null ?
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
              href={"http://localhost:5001/img/" + file}
              target="_blank"
            >
              <img
                src={"http://localhost:5001/img/" + fileThumb}
                alt={fileSize}
                data-md5=""
                style={id === thread ? null : { height: "148px", width: "150px" }}
              />
            </a>
          </div>
          : null}

        {id === thread ? <PostInfo post={post} /> : null}

        <blockquote class="postMessage" id={id}>
          {commentFormatted}
        </blockquote>
      </div>
    </div>
  )
}

export default Post;