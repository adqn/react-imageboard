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

  const getBoards = () =>
    fetch(api("getboards"))
      .then(resp => resp.json())
      .then(resp => setBoards(resp))
      .then(() => getRoutes())

  // const getThreads = async (callback) => {
  //   let threadsRetrieved = [3];
  //   let promises = [];

  //   if (boards) {
  //     for (let board of boards) {
  //       const reqString = `/?query=threads&board=${board.uri}&thread=null&post=null`;

  //       promises.push(
  //         fetch(api("getposts" + reqString), { cache: "reload" })
  //           .then(resp => resp.json())
  //           .then(resp => {
  //             threadsRetrieved.push({ uri: board.uri, threads: resp })
  //           })
  //       )
  //     }

  //     await Promise.all(promises).then(() => {
  //       setThreads(threadsRetrieved);
  //       setIsLoading(false);
  //     })
  //   }
  // };

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
    let id = routerProps.match.params.id;
    let foundUri = routes.find(route => route.uri === uri);
    let foundId = routes.forEach(route => {
      route.threads.find(thread => thread.thread === id)
    })
    let foundBoard = boards.find(board => board.uri === uri)

    if ((foundUri)) {
      return (
        <div>
          <BoardHeader uri={uri} title={foundBoard.title} />
          <ReplyForm board={uri} threadId={id} />
          <Thread uri={uri} id={id} />
        </div>
      )
    } else {
      return <NotFound />;
    }
  }

  // const renderThreadRoutes = (routerProps) => {
  //   let threadId = parseInt(routerProps.match.params.id);
  //   let uri = routerProps.match.params.uri;
  //   let foundThread = null;
  //   let foundBoard = null;
  //   let validBoard = false;
  //   // console.log(threads);

  //   for (let board of boards) {
  //     if (board.uri === uri) {
  //       validBoard = true;
  //     }
  //   }

  //   if (validBoard) {
  //     foundBoard = threads.find(threadObj => threadObj.uri === uri);
  //     console.log("aaa");

  //     if (foundBoard) {
  //       console.log("WHAT")
  //       foundThread = foundBoard.threads.find(threadsObj => threadsObj.thread === threadId)

  //       if (foundThread) {
  //         console.log(foundThread);
  //         return (
  //           <div>
  //             <ReplyForm board={uri} threadId={threadId} />
  //             <Thread uri={uri} id={threadId} />
  //           </div>
  //         )
  //       } else {
  //         return <NotFound />;
  //       }
  //     } else {console.log("failed")}
  //   } else {return <NotFound />}
  // };

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