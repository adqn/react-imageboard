import React, { useState, useEffect, useReducer } from 'react';
import Post from './components/Post.js';
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

function ReplyForm() {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [post, setPost] = useState({});

  const clearReplyForm = () => {
    setName('');
    setComment('');
  }

  const postReq = body => {
    return (
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    )
  }

  const submitReply = post => {
    fetch(api("newpost"), postReq(post))
      .then(resp => console.log(resp))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = { name, comment };
    // setPost(newPost);
    // console.log(post);
    submitReply(newPost);
    // if successful -> clearReplyForm(); navigate to #bottom
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Name: </label><br />
      <input
        type="text"
        name="name_id"
        value={name}
        onChange={(e) => setName(e.target.value)} /><br />

      <label>Comment: </label><br />
      <input
        type="text"
        name="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)} /><br />
      <input type="submit" value="Reply" />
    </form>
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
      {/* <ReplyForm setNewPost={setNewPost} /> */}
      <Thread newPost={newPost} />
    </div>
  )
}

export default App;