import {React, useEffect, useState} from 'react';
import Post from './Post';

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

export default Thread;