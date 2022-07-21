import React, { useState, useEffect } from "react";
import ReplyForm from "./ReplyForm";
import Post from "./Post";
import NavLinks, { NavFrom } from "./NavLinks";
import { formatComment } from "../helpers/postHelpers.js";

const PostsOmitted = ({ uri, threadId }: { uri: string; threadId: number }) => {
  const [omitted, setOmitted] = useState<number | undefined>();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [expandedPosts, setExpandedPosts] = useState<any | undefined>();
  const [assetsLoaded, setAssetsLoaded] = useState<boolean>(false);

  const api = (option: string) => "http://localhost:5001/api/" + option;

  const OmittedText = () => (
    <div className="textOmitted">
      {" "}
      <i>
        {omitted && omitted > 1
          ? expanded
            ? omitted + " replies shown"
            : omitted + " replies omitted..."
          : expanded
          ? omitted + " reply shown"
          : omitted + " reply omitted..."}
      </i>
    </div>
  );

  const ExpandedPosts = () => (
    <div>
      {expandedPosts && expandedPosts
        ? expandedPosts.map((post: Post) => <Post post={post} />)
        : null}
    </div>
  );

  const getReplyCount = () =>
    fetch(api("getposts" + reqString))
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res > 6) {
          let numOmitted = res - 6;
          setOmitted(numOmitted);
        }
      });

  const expandHandler = (e: any) => {
    if (!expanded) {
      if (!assetsLoaded) {
        const reqString = `/?query=thread&board=${uri}&thread=${threadId}&post=${
          omitted && omitted + 1
        }`;

        fetch(api("getposts" + reqString))
          .then((resp) => resp.json())
          .then((resp) => setExpandedPosts(resp.slice(1)))
          .then((resp) => setExpanded(true))
          .then((resp) => setAssetsLoaded(true));
      } else {
        setExpanded(true);
      }
    } else {
      setExpanded(false);
    }

    e.preventDefault();
  };

  const Omitted = () => (
    <div id={`${threadId}`}>
      <a href="" onClick={(e) => expandHandler(e)}>
        <b className="button replyExpand">{expanded ? "-" : "+"}</b>
        <OmittedText />
      </a>
      {expanded ? <ExpandedPosts /> : null}
    </div>
  );

  const reqString = `/?query=omitted&board=${uri}&thread=${threadId}&post=null`;

  useEffect(() => {
    getReplyCount();
  }, []);

  return <div>{omitted ? <Omitted /> : null}</div>;
};

const BumpSortedThreads = ({ uri, threads }: { uri: string; threads: any }) => {
  const [finalThreads, setFinalThreads] = useState(null);
  const bumpOrder: any = {};
  const tempThreads: any = {};
  const threadArray: any = [];

  // lazy.....
  const orderAndFormatThreads = () => {
    for (let thread in threads) {
      let threadId = thread;
      let bump = threads[thread][0].bump;
      bumpOrder[threadId] = bump;
    }

    let keys = Object.keys(bumpOrder);
    const bumpOrderSorted = keys.sort((a, b) => bumpOrder[a] - bumpOrder[b]);

    for (let thread of bumpOrderSorted) {
      tempThreads[" " + thread] = threads[thread];
    }

    for (let thread in tempThreads) {
      for (let post of tempThreads[thread]) {
        let thePost;
        if (post.post === post.thread) {
          thePost = <Post uri={uri} post={post} />;
          if (tempThreads[thread].length > 5) {
            thePost = (
              <div>
                <Post post={post} uri={uri} />
                <PostsOmitted uri={uri} threadId={post.thread} />
              </div>
            );
          }
        } else {
          thePost = <Post post={post} />;
        }
        threadArray.push(thePost);
      }
      threadArray.push(<hr className="desktop" id="op" />);
    }

    setFinalThreads(threadArray);
  };

  useEffect(() => orderAndFormatThreads(), []);

  return <div>{finalThreads}</div>;
};

const BoardIndex = ({ uri }: { uri: string }) => {
  const [threads, setThreads] = useState(null);
  const [repliesOmitted, setRepliesOmitted] = useState([]);
  const api = (option: string) => "http://localhost:5001/api/" + option;

  // Here 'post' is the number of posts per thread to get
  // Change this so I don't have to re-use &post for something different
  let post = 5;
  const reqString = `/?query=threads&board=${uri}&thread=null&post=${post}`;

  const getThreads = () =>
    fetch(api("getposts" + reqString))
      .then((resp) => resp.json())
      .then((resp) => {
        setThreads(resp);
      });

  useEffect(() => {
    getThreads();
  }, []);

  return (
    <div>
      <ReplyForm index={true} uri={uri} />
      <hr />
      <NavLinks uri={uri} from={NavFrom.index} />
      <hr />
      {threads ? <BumpSortedThreads uri={uri} threads={threads} /> : null}
    </div>
  );
};

export default BoardIndex;
