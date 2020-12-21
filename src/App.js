import React, { useState, useEffect, useReducer } from 'react';
import Post from './components/Post';
import ReplyForm from './components/ReplyForm'
import './App.css';

const api = option => "http://localhost:5001/api/" + option;

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

function Thread() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdownTime, setCountdown] = useState(5);

  const retrievePosts = () => (
    fetch('http://localhost:5001/api/getposts')
      .then(response => response.json())
      .then(response => {
          setPosts(response)
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
      <ReplyForm setNewPost={setNewPost} />
      <Thread newPost={newPost} />
    </div>
  )
}

export default App;