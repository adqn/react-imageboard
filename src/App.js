import React, {useState, useEffect, useReducer} from 'react';
import logo from './logo.svg';
import './App.css';

const testPosts = [
  {
    id: 1,
    postNumber: 1,
    name: "Anonymous",
    content: "fpbp"
  }
]

const ReplySubmit = () => (null);

const ReplyForm = () => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [post, setPost] = useState({});

  const clearReplyForm = () => {
    setName('');
    setComment('');
  }

  const sendPostAndUpdate = post => {
    new Promise((resolve, reject) =>
      resolve("send post to API, wait for reponse")
    ).then(resolve => "get API confirmation, update posts")
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {name, comment};
    setPost(newPost);
    // console.log(post);
    clearReplyForm();
    // sendPostAndUpdate(post);
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
};

const Post = () => 
  <div className="Post">
    {testPosts.map(post => 
      <ul>
        <li>{post.postNumber}</li> 
        <li>{post.name}</li> 
        <li>{post.content}</li> 
      </ul>
    )}
  </div>

const Posts = () => 
  <div className="Posts">
    <Post />
  </div>

function App() {
  return (
    <div>
      <ReplyForm />
      <Posts />
    </div>
  );
}

export default App;
