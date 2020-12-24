import React, { useState, useEffect, useReducer, useCallback } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from 'axios';
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
  const [isLoading, setIsLoading] = useState(true);

  const NotFound = () => <div>404!</div>
  const DefaultLoading = () => <div>Loading...</div>

  const getBoards = () =>
    fetch(api("getboards"), { cache: "reload" })
      .then((resp) => resp.json())
      .then((resp) => {
        setBoards(resp);
        getThreads();
      })

  const getThreads = async (callback) => {
    let threadsRetrieved = [3];
    let promises = [];

    if (boards) {
      for (let board of boards) {
        const reqString = `/?query=threads&board=${board.uri}&thread=null&post=null`;

        promises.push(
          fetch(api("getposts" + reqString), { cache: "reload" })
            .then(resp => resp.json())
            .then(resp => {
              threadsRetrieved.push({ uri: board.uri, threads: resp })
            })
        )
      }

      await Promise.all(promises).then(() => {
        setThreads(threadsRetrieved);
        setIsLoading(false);
        // console.log(threadsRetrieved);
        // callback();
      })
    }
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
              /{boardUri}/ - {foundBoard.title}
            </div>
          </div>
          <Catalog board={boardUri} />
        </div>
      );
    } else {
      return <NotFound />;
    }
  };

  const renderThreadRoutes = (routerProps) => {
    let threadId = parseInt(routerProps.match.params.id);
    let uri = routerProps.match.params.uri;
    let foundThread = null;
    let foundBoard = null;
    let validBoard = false;
    // console.log(threads);

    for (let board of boards) {
      if (board.uri === uri) {
        validBoard = true;
      }
    }

    if (validBoard) {
      foundBoard = threads.find(threadObj => threadObj.uri === uri);
      console.log("aaa");

      if (foundBoard) {
        console.log("WHAT")
        foundThread = foundBoard.threads.find(threadsObj => threadsObj.thread === threadId)

        if (foundThread) {
          console.log(foundThread);
          return <Thread uri={uri} id={threadId} />;
        } else {
          return <NotFound />;
        }
      } else {console.log("failed")}
    }
  };

  const Home = () =>
    <div>
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
    </div>

  const testProps = props => console.log(props.match.params.uri, props.match.params.id)

  useEffect(() => {
    getBoards();
    // getThreads(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          {boards ?
            <Route exact path="/:uri" render={(routerProps) => renderBoardRoutes(routerProps)} /> : <DefaultLoading />}
          {threads ?
            <Route exact path="/:uri/thread/:id" render={(routerProps) => renderThreadRoutes(routerProps)} /> : <DefaultLoading />}
          {isLoading ?
            <DefaultLoading /> : <Route component={NotFound} />}
        </Switch>
      </Router>
      {/* <hr class="desktop" id="op" />
      <div class="navLinks desktop">[<a href="//" accesskey="a">Return</a>] [<a href="//catalog">Catalog</a>] [<a
              href="#bottom">Bottom</a>]</div> */}
    </div>
  );
}

export default App;