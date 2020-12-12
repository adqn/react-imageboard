import React, { useState, useEffect, useReducer } from 'react';
import './App.css';

const Thread = ({ posts }) =>
  <div className="Thread">
    {posts.map(post =>
      <ul>
        <li>{post.globalId}</li>
        <li>{post.name}</li>
        <li>{post.comment}</li>
      </ul>
    )}
  </div>

function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const retrievePosts = () => (
    fetch('http://localhost:5001/api/testpost')
      .then(response => response.json())
      .then(response => setPosts(response))
      .then(setIsLoading(false))
  )

  useEffect(() => {
    setIsLoading(true);
    retrievePosts();
  })

  return (
    <div className="Posts">
      {isLoading ? <p>Loading posts...</p>
      :
      <Thread posts={posts} />}
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

  const submitReply = post => {
    new Promise((resolve, reject) =>
      resolve("send post to API, wait for reponse")
    ).then(resolve => "get API confirmation, update posts")
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = { name, comment };
    setPost(newPost);
    // console.log(post);
    // submitReply(post);
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
      <Posts />
    </div>
  )
}

export default App;
