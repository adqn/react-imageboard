import {React, useState, useEffect } from 'react';

const News = () => {
  const [posts, setPosts] = useState(null);
  const api = option => "http://localhost:5001/api/news/" + option

  const Posts = () => 
    <div>
    {
      posts.map(post => {
        <div>
          WHAT
        {/* <span class="newsPost created">{post.created}</span>
          <span class="newsPost subject">{post.subject}</span>
          <span class="newsPost author">{post.author}</span>
          <span class="newsPost post">{post.post}</span> */}
        </div>
      })
    }
    </div>

  const getPosts = () => 
    fetch(api("getposts"))
      .then(resp => resp.json())
      .then(resp => setPosts(resp))

  useEffect(() => getPosts(), [])

  return (
    <div className="News">
      <div class="news postContainer">
        {posts ? <Posts /> : null}
      </div>
    </div>
  )

}

export default News;