import React, { useState, useEffect, useReducer } from 'react';
import Post from './components/Post';
import ReplyArea from './components/ReplyArea';
import './App.css';

const api = option => "http://localhost:5001/api/" + option;

// const [threadId, setThreadId] = useState(0);

const Posts = ({ posts }) =>
  <div className="Post">
    {posts.map(post =>
      <Post 
        id={post.postId}  
        timestamp={post.created}
        name={post.postName}
        comment={post.comment}
      />
    )}
  </div>

function Thread({newPost}) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdownTime, setCountdown] = useState(5);

  const retrievePosts = () => (
    fetch('http://localhost:5001/api/getposts')
      .then(response => response.json())
      .then(response => {
          setPosts(response)
          // setThreadId(response.threadId)
          setIsLoading(false)
      })
  )

  const countdown = (timeFrom, callback) => {
    if (countdownTime === 1) {
      callback();
      setCountdown(timeFrom);
    } else (
      setCountdown(countdownTime - 1)
    )
  }

  useEffect(
    () => {
      setIsLoading(true);
      retrievePosts();
  }, []);

  useEffect(
    () => {
      setTimeout(() => countdown(5, () => retrievePosts()), 1000);
  }, [countdownTime]);

  return (
    <div className="ThreadContainer">
      {isLoading ? 
      <p>Loading posts...</p>
      :
      <Posts posts={posts} />}
      {countdownTime}
    </div>
  )
}

function App() {
  const [newPost, setNewPost] = useState(false);

  function postsReducer (state, action) {
    switch(action.type) {
      case 'DELETE_POST':
        return action.payload;
      case 'UPDATE_POST':
        //
    }
  }

  return (
    <div>
      <div class="boardBanner">
          {/* <div id="bannerCnt" class="title desktop" data-src="30.gif"></div> */}
          <div class="boardTitle">/soup/ - soupchan</div>
      </div>
      
      <ReplyArea 
        // setNewPost={setNewPost} 
        // threadId={threadId} 
        />

      <hr class="desktop" id="op" />
      <div class="navLinks desktop">[<a href="//" accesskey="a">Return</a>] [<a href="//catalog">Catalog</a>] [<a
              href="#bottom">Bottom</a>]</div>

      <Thread newPost={newPost} />
    </div>
  )
}

export default App;