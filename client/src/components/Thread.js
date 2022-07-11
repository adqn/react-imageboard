import { React, useEffect, useState } from "react";
import Post from "./Post";
import ReplyForm from "./ReplyForm";

const Posts = ({ posts }) => (
  <div className="Post">
    {posts.map((post) => (
      <Post post={post} />
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
      setCountdown(timeFrom);
      callback();
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
    <div>
      <div className="ThreadContainer">
        <hr class="desktop" id="op" />
        <div class="navLinks desktop">
          [
          <a href="../../" accessKey="a">
            Return
          </a>
          ] [<a href="../../catalog">Catalog</a>] [<a href="#bottom">Bottom</a>]
        </div>
        <hr class="desktop" id="op" />
        <Posts posts={posts} />
        <hr class="desktop" id="op" />
        <div className="statusBar">
          <div className="refreshTimer">{isLoading ? null : countdownTime}</div>
        </div>
      </div>
    </div>
  );
}

export default Thread;
