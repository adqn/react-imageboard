import React, {useState, useEffect} from 'react';
import ReplyArea from './ReplyArea';
import { formatComment } from '../helpers/postHelpers.js';

const api = option => "http://localhost:5001/api/" + option

const getThumb = fileName => {
  let name = fileName.match(/\d+/)[0]
  let ext = fileName.match(/\..+/)[0]

  return name + "s" + ext
}

const OpPost = ({ post }) => {
  let {
    thread,
    subject,
    file,
    fileWidth,
    fileHeight,
  } = post;
  let thumb_h;
  let thumb_w;
  let ratio;
  // let comment = formatComment(post.comment);

  if (fileWidth > 150 || fileHeight > 150) {
    ratio = (fileWidth > fileHeight ? 150 / fileWidth : 150 / fileHeight);
    thumb_w = fileWidth * ratio;
    thumb_h = fileHeight * ratio;
  } else {
    thumb_w = fileWidth;
    thumb_h = fileHeight;
  }

  return (
      <div class="catalog opPost">
      <a href={"./thread/" + thread}>
        <img src={"http://localhost:5001/img/" + getThumb(file)}
          style={{width: thumb_w, height: thumb_h}}/>
      </a>
        <span class="catalog threadInfo">471 / 3 / 6</span>
      <span class="catalog threadSubject">{subject}</span>
      <div class="postMessage">
      {formatComment(post.comment)}
      </div>
      </div>
  )
}

const Catalog = ({uri}) => {
  const [threads, setThreads] = useState(null);

  const getThreads = () => {
    let threadReq = `/?query=catalog&board=${uri}&thread=null&post=null`
    fetch(api("getposts") + threadReq)
      .then(resp => resp.json())
      .then(resp => setThreads(resp))
  }

  useEffect(() => getThreads(), [])

  return (
    <div>
      <ReplyArea index={true} uri={uri} id={null} />
      <hr />
      <div class="navLinks">[<a href="../../">Home</a>] [<a href={"/" + uri}>Index</a>] [<a href="#update"
        onClick={() => getThreads()}>Update</a>]</div>
      <hr />
      <div class="catalog container">
        {threads ? threads.map(post => <OpPost post={post} />) : null}
      </div>
    </div>
  )
}

export default Catalog;