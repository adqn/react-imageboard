import React, {useState, useEffect} from 'react';
import ReplyArea from './ReplyArea';

const api = option => "http://localhost:5001/api/" + option

const getThumb = fileName => {
  let name = fileName.match(/\d+/)[0]
  let ext = fileName.match(/\..+/)[0]

  return name + "s" + ext
}

const OpPost = ({ post }) => {
  let {
    subject,
    file,
    fileWidth,
    fileHeight,
    comment
  } = post;
  let thumb_h;
  let thumb_w;
  let ratio;

  ratio = (fileWidth > fileHeight ? 150 / fileWidth : 150 / fileHeight);
  thumb_w = fileWidth * ratio;
  thumb_h = fileHeight * ratio;

  return (
      <div class="catalog opPost">
      <a href={"./thread/" + post.thread}>
        <img src={"http://localhost:5001/img/" + getThumb(post.file)}
          style={{width: thumb_w, height: thumb_h}}/>
      </a>
        <span class="catalog threadInfo">471 / 3 / 6</span>
      <span class="catalog threadSubject">{post.subject}</span>
      {post.comment}
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
      {threads ? threads.map(post => <OpPost post={post} />) : null}
    </div>
  )
}

export default Catalog;