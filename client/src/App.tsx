import React, { useState, useEffect, useReducer, useCallback } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Post from "./components/Post";
import ReplyForm from "./components/ReplyForm";
import Thread from "./components/Thread";
import BoardIndex from "./components/BoardIndex";
import "./App.css";

const api = (option: string) => "http://localhost:5001/api/" + option;

function App() {
  const [boards, setBoards] = useState<any>([]);
  const [threads, setThreads] = useState(null);
  const [routes, setRoutes] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingString, setLoadingString] = useState("Loading.");
  const [ellipsis, setEllipsis] = useState(0);

  const NotFound = () => <div>404!</div>;
  const DefaultLoading = () => (
    <div className="PageStatus">{loadingString}</div>
  );
  const Spacer = () => <div className="Spacer"></div>;
  const BoardHeader = (props: { uri: string; title: string }) => (
    <div className="boardBanner">
      <div className="boardTitle">
        /{props.uri}/ - {props.title}
      </div>
    </div>
  );

  const getBoards = () =>
    fetch(api("getboards"))
      .then((resp) => resp.json())
      .then((resp) => setBoards(resp))
      .then(() => getRoutes());

  const getRoutes = () => {
    fetch(api("routes"))
      .then((resp) => resp.json())
      .then((resp) => setRoutes(resp));
  };

  const renderBoardRoutes = (routerProps: any) => {
    const boardUri = routerProps.match.params.uri;
    const foundBoard = boards.find(
      (boardObj: any) => boardObj.uri === boardUri
    );

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

  const renderThreadRoutes = (routerProps: any) => {
    const uri = routerProps.match.params.uri;
    const id = parseInt(routerProps.match.params.id);
    const foundUri = routes.find((route: any) => route.uri === uri);
    let foundId;
    const foundBoard = boards.find((board: any) => board.uri === uri);

    for (const route of routes) {
      const tempId = route.threads.find(
        (thread: any) => thread.thread === id && route.uri === uri
      );

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
      );
    } else {
      return <NotFound />;
    }
  };

  const animateEllipsis = (count: number) => {
    if (ellipsis === count) {
      setEllipsis(0);
      setLoadingString("Loading.");
    } else {
      setEllipsis(ellipsis + 1);
      setLoadingString(loadingString + ".");
    }
  };

  useEffect(() => {
    getBoards();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => animateEllipsis(3), 500);
    return () => clearInterval(interval);
  }, [loadingString]);

  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          {boards ? (
            <Route
              exact
              path="/:uri"
              render={(routerProps) => renderBoardRoutes(routerProps)}
            />
          ) : (
            <DefaultLoading />
          )}
          {routes ? (
            <Route
              exact
              path="/:uri/thread/:id"
              render={(routerProps) => renderThreadRoutes(routerProps)}
            />
          ) : (
            <DefaultLoading />
          )}
          {isLoading ? <DefaultLoading /> : <Route component={NotFound} />}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
