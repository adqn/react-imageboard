import React, { useState, useEffect, useReducer, useCallback } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from './components/Home';
import Post from "./components/Post";
import ReplyForm from "./components/ReplyForm";
import Thread from "./components/Thread";
import BoardIndex from "./components/BoardIndex";
import "./App.css";

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
  const Spacer =  () => <div className="Spacer"></div>
  const BoardHeader = ({ uri, title }) =>
    <div class="boardBanner">
      <div class="boardTitle">
        /{uri}/ - {title}
      </div>
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
          <BoardIndex uri={boardUri} />
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
          <Spacer />
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
    </div>
  );
}

export default App;