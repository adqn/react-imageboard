import React from 'react';

const quote = id => 
    'javascript:quote(' + id + ');'

const Post = ({id, name, timestamp, comment}) =>
  <div class="postContainer replyContainer" id={id}>
      <div class="sideArrows" id={"sa" + id}>
         &gt;&gt; 
      </div>

      <div id={"p" + id} class="post reply">
          <div class="postInfoM mobile" id={"pim" + id}>
              <span class="nameBlock">
                  <span class="name">{" "}{name} </span>
              <br />
              </span>

              <span class="dateTime postNum" data-utc="">
                   {timestamp} <a href={"#p" + id} title="Link to this post">No.</a>
                  <a href={quote(id)} title="Reply to this post">{id}</a>
              </span>
          </div>

          <div class="postInfo desktop" id={"pi" + id}>
              <input type="checkbox" name={id} value="delete" />
                {" "}
              <span class="nameBlock">
                  <span class="name">{" "}{name} </span>
              </span>

              <span class="dateTime" data-utc=""> 
                {" "}{timestamp}
              </span>
              
              <span class="postNum desktop">
                  <a href={'#p' + id} title="Link to this post"> No. </a>
                  <a href={quote(id)} title="Reply to this post">{id}</a>
              </span>
          </div>

          <blockquote class="postMessage" id={id}>
            {comment}
          </blockquote>
      </div>
  </div>

  export default Post;