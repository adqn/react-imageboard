import React, { useState, useEffect, useReducer } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Post from "./components/Post";
import ReplyArea from "./components/ReplyArea";
import Thread from "./components/Thread";
import Catalog from "./components/Catalog";
import "./App.css";
import yukkuri from "./static/yukkuri.png";

const api = (option) => "http://localhost:5001/api/" + option;

function App() {
  const [boards, setBoards] = useState(null);
  const [threads, setThreads] = useState(null);

  const NotFound = () => <div>404!</div>;

  const getBoards = () =>
    fetch(api("getboards"))
      .then((resp) => resp.json())
      .then((resp) => setBoards(resp))
      // .then((resp) => callback(resp))

  const getThreads = () => {
    // return new Promise((resolve, reject) => {

    // })
    let updatedThreads = new Array;
    let fetches = [];

    if (boards != null) {
      console.log(boards);
      for (let board of boards) {
        console.log(board.uri);
        const reqString = `/?query=threads&board=${board.uri}&thread=null&post=null`;

        fetches.push(
          fetch(api("getposts" + reqString))
            // .then((resp) => resp.json())
            .then((resp) => {
              updatedThreads.push({ uri: board.uri, threads: resp.json() });
            })
        );
      }
    }

    Promise.all(fetches).then(() => {
      setThreads(updatedThreads);
      console.log(updatedThreads);
      // if (threads != null) {
      //   setThreads([...threads, { board: board.uri, threads: resp }]);
      // } else { setThreads([{ board: board.uri, threads: resp }])}
    })
  };

  const renderBoardRoutes = (routerProps) => {
    let boardUri = routerProps.match.params.uri;
    let foundBoard = boards.find((boardObj) => boardObj.uri === boardUri);

    if (foundBoard) {
      return (
        <div>
          <div class="boardBanner">
            {/* <div id="bannerCnt" class="title desktop" data-src="30.gif"></div> */}
            <div class="boardTitle">
              {foundBoard.uri} - {foundBoard.title}
            </div>
          </div>
          <Catalog board={foundBoard.uri} />
        </div>
      );
    } else {
      return <NotFound />;
    }
  };

  const renderThreadRoutes = (routerProps) => {
    let boardUri = routerProps.match.params.uri;
    let threadId = parseInt(routerProps.match.params.threadId);
    let thread = null;

    console.log("what");
    thread = threads.find(threadObj => threadObj.threads.thread === threadId && threadObj.board === boardUri);

    if (thread != undefined) {
      console.log(thread);
      return <Thread uri={boardUri} id={threadId} />;
    } else {
      return <NotFound />;
    }
  };
  

  useEffect(() => {
    getBoards();
    getThreads();
  }, []);

  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/">
            <div className="header">
              <span id="homename">soupchan</span>
              <br />
              <img src={yukkuri} />
              <br />
              <span id="imgtxt">
                <i>"Take it easy!"</i>
              </span>
            </div>
            <div className="Home"></div>
            <div className="News"></div>
          </Route>
          {boards ? (
            <Route
              exact path="/:uri"
              render={(routerProps) => renderBoardRoutes(routerProps)}
            />
          ) : null}
          {threads ? (
            <Route
              exact path="/:uri/thread/:threadId"
              render={(routerProps) => renderThreadRoutes(routerProps)}
            />
          ) : null}
          {/* <Route component = {NotFound} /> */}
        </Switch>
      </Router>
      {/* <hr class="desktop" id="op" />
      <div class="navLinks desktop">[<a href="//" accesskey="a">Return</a>] [<a href="//catalog">Catalog</a>] [<a
              href="#bottom">Bottom</a>]</div> */}
    </div>
  );
}

export default App;