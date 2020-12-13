import React, { useState, useEffect, useReducer } from 'react';
import './App.css';

const api = option => "http://localhost:5001/api/" + option;

const Posts = ({ posts }) =>
  <div className="Post">
    {posts.map(post =>
      <ul>
        <li>{post.globalId}</li>
        <li>{post.name}</li>
        <li>{post.comment}</li>
      </ul>
    )}
  </div>

function Thread() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const retrievePosts = () => (
    fetch('http://localhost:5001/api/testpost')
      .then(response => response.json())
      .then(response => {
          setPosts(response)
          setIsLoading(false)
      })
  )

  useEffect(
    () => {
      setIsLoading(true);
      retrievePosts();
  }, []);

  return (
    <div className="ThreadContainer">
      {isLoading ? 
      <p>Loading posts...</p>
      :
      <Posts posts={posts} />}
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
  return (
    <div>
      <ReplyForm />
      <Thread />
    </div>
  )
}

export default App;