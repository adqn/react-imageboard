import React, { useEffect, useState } from "react";
import Post from "./Post";
import NavLinks, { NavFrom } from "./NavLinks";
import ReplyForm from "./ReplyForm";

const Posts = ({ posts }: { posts: Post[] }) => (
  <div className="Post">
    {posts.map((post) => (
      <Post post={post} />
    ))}
  </div>
);

function Thread({ uri, id }: { uri: string; id: number }) {
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

  const countdown = (timeFrom: number, callback: () => void) => {
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
        <hr className="desktop" id="op" />
        <NavLinks uri={uri} from={NavFrom.thread} />
        <hr className="desktop" id="op" />
        <Posts posts={posts} />
        <hr className="desktop" id="op" />
        <div className="statusBar">
          <div className="refreshTimer">{isLoading ? null : countdownTime}</div>
        </div>
      </div>
    </div>
  );
}

export default Thread;
