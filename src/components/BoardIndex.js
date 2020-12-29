import React, { useState, useEffect } from "react";
import ReplyArea from "./ReplyArea";
import Post from "./Post";

const BoardIndex = ({ uri }) => {
  const [threads, setThreads] = useState(null);
  const api = (option) => "http://localhost:5001/api/" + option;

  const BumpSortedThreads = ({ uri, threads }) => {
    let bumpOrder = {}

    for (let thread in threads) {
      let threadId = thread;
      let bump = threads[thread][0].bump;
      bumpOrder[threadId] = bump;
    }

    let keys = Object.keys(bumpOrder)
    keys.sort((a, b) => bumpOrder[a] - bumpOrder[b])
    // console.log(keys)



    return (
      <div>
        {/* {sortedThreads.map(thread => 
          <OpPost board={uri} postInfo={thread} />
          threadPosts.map(post => thread.thread === post.thread ? <Post post={post} /> : <div>what</div>)
        )} */}
        {/* {threadAndPosts.map(thread => thread)} */}
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
