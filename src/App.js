import React, { useState, useEffect, useReducer } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Post from './components/Post';
import ReplyArea from './components/ReplyArea';
import Catalog from './components/Catalog';
import './App.css';
import yukkuri from './static/yukkuri.png';


const api = option => "http://localhost:5001/api/" + option;

// const [threadId, setThreadId] = useState(0);

function App() {
  const [newPost, setNewPost] = useState(false);
  const [boards, setBoards] = useState(null);
  const [threads, setThreads] = useState(null);

  const NotFound = () =>
    <div>404!</div>

  const getBoards = () => (
    fetch(api("getboards"))
    .then(resp => resp.json())
    .then(resp => setBoards(resp))
  ) 
  
  const renderBoardRoutes = routerProps => {
    let boardUri = routerProps.match.params.uri
    while (true) {
      if (boards) {
        let foundBoard = boards.find(boardObj => boardObj.uri === boardUri)

        if (foundBoard) {
          return (
            <div>
            <div class="boardBanner">
                {/* <div id="bannerCnt" class="title desktop" data-src="30.gif"></div> */}
                <div class="boardTitle">{foundBoard.uri} - {foundBoard.title}</div>
            </div>
            <Catalog board={foundBoard.uri} />
            </div>
          )
        } else {
          return <NotFound />
        }
          }
    }
  }

  const renderThreadRoutes = routerProps => {

  }

  useEffect(() => {
    getBoards();
  }, [])
  
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/">
            <div className="header">
              <span id="homename">soupchan</span><br />
              <img src={yukkuri} /><br />
              <span id="imgtxt"><i>"Take it easy!"</i></span>
            </div>
            <div className="Home">
            </div>
            <div className="News">
            </div>
          </Route>
          {
            boards ? 
            <Route path = '/:uri' render={routerProps => renderBoardRoutes(routerProps)} /> :
            null
          }
          {
            threads ?
            <Route path = '/:uri/:thread' render={routerProps => renderBoardRoutes(routerProps)} /> :
            null
          }
          {/* <Route component = {NotFound} /> */}
        </Switch>
      </Router>
      {/* <ReplyArea 
        // setNewPost={setNewPost} 
        // threadId={threadId} 
        />

      <hr class="desktop" id="op" />
      <div class="navLinks desktop">[<a href="//" accesskey="a">Return</a>] [<a href="//catalog">Catalog</a>] [<a
              href="#bottom">Bottom</a>]</div>

      <Thread newPost={newPost} /> */}
    </div>
  )
}

export default App;