import { React, useEffect, useState } from "react";
import Post from "./Post";
import ReplyForm from './ReplyForm';

const Posts = ({ posts }) => (
  <div className="Post">
    {posts.map((post) => (
      <Post
        subject={post.subject}
        id={post.post}
        timestamp={post.created}
        name={post.name}
        comment={post.comment}
      />
    ))}
  </div>
);

function Thread({ uri, id }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdownTime, setCountdown] = useState(5);

  const reqString = `/?query=thread&board=${uri}&thread=${id}&post=null`;

  const retrievePosts = () =>
    fetch("http://localhost:5001/api/getposts" + reqString)
      .then((response) => response.json())
      .then((response) => {
        setPosts(response);
        setIsLoading(false);
      });

  const countdown = (timeFrom, callback) => {
    if (countdownTime === 1) {
      callback();
      setCountdown(timeFrom);
    } else setCountdown(countdownTime - 1);
  };

  useEffect(() => {
    setIsLoading(true);
    retrievePosts();
  }, []);

  useEffect(() => {
    setTimeout(() => countdown(5, () => retrievePosts()), 1000);
  }, [countdownTime]);

  return (
    <div className="ThreadContainer">
      <Posts posts={posts} />
      {isLoading ? null : countdownTime}
    </div>
  );
}

export default Thread;
