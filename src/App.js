import React, { useState, useEffect, useReducer, useCallback } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Post from "./components/Post";
import ReplyForm from "./components/ReplyForm";
import Thread from "./components/Thread";
import Catalog from "./components/Catalog";
import "./App.css";
import yukkuri from "./static/yukkuri.png";

const api = (option) => "http://localhost:5001/api/" + option;

function App() {
  const [boards, setBoards] = useState(null);
  const [threads, setThreads] = useState(null);
  const [routes, setRoutes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingString, setLoadingString] = useState("Loading.");
  const [ellipsis, setEllipsis] = useState(0);

  const NotFound = () => <div>404!</div>
  const DefaultLoading = () => <div className="PageStatus">{loadingString}</div>
  const BoardHeader = ({ uri, title }) =>
    <div class="boardBanner">
      {/* <div id="bannerCnt" class="title desktop" data-src="30.gif"></div> */}
      <div class="boardTitle">
        /{uri}/ - {title}
      </div>
    </div>

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
      {/* {boards.map(board => {
        <a href={`/${board.uri}`}>{` /${board.uri} `}</a> 
      })} */}
    </div>
    
  const getBoards = () =>
    fetch(api("getboards"))
      .then(resp => resp.json())
      .then(resp => setBoards(resp))
      .then(() => getRoutes())

  const getRoutes = () => {
    fetch(api("routes"))
      .then(resp => resp.json())
      .then(resp => setRoutes(resp))
  }

  const renderBoardRoutes = (routerProps) => {
    let boardUri = routerProps.match.params.uri;
    let foundBoard = boards.find((boardObj) => boardObj.uri === boardUri);

    if (foundBoard) {
      return (
        <div>
          <BoardHeader uri={boardUri} title={foundBoard.title} />
          <Catalog uri={boardUri} />
        </div>
      );
    } else {
      return <NotFound />;
    }
  };

  const renderThreadRoutes = (routerProps) => {
    let uri = routerProps.match.params.uri;
    let id = parseInt(routerProps.match.params.id);
    let foundUri = routes.find(route => route.uri === uri);
    let foundId = null;
    let foundBoard = boards.find(board => board.uri === uri)
    
    for (let route of routes) {
      let tempId = route.threads.find(thread => thread.thread === id && route.uri === uri)

      if (tempId) {
        foundId = tempId.thread;
      }
    }

    if (foundId) {
      return (
        <div>
          <BoardHeader uri={uri} title={foundBoard.title} />
          <ReplyForm index={false} uri={uri} threadId={id} />
          <Thread uri={uri} id={id} />
        </div>
      )
    } else {
      return <NotFound />;
    }
  }

  const animateEllipsis = (count) => {
    if (ellipsis === count) {
      setEllipsis(0);
      setLoadingString("Loading.");
    } else {
      setEllipsis(ellipsis + 1);
      setLoadingString(loadingString + ".");
    }
  }

  useEffect(() => {
    getBoards();
  }, []);

  useEffect(() => {
    let interval = setInterval(() => animateEllipsis(3), 500)
    return () => clearInterval(interval);
  }, [loadingString])

  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          {boards ?
            <Route exact path="/:uri" render={(routerProps) => renderBoardRoutes(routerProps)} /> : <DefaultLoading />}
          {routes ?
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