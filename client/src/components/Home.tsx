import React from "react";
import yukkuri from "../static/yukkuri.png";

const Home = () => (
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
);

export default Home;
