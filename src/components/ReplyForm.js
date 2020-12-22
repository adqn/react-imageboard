import React, {useEffect, useState} from 'react';

const api = option => "http://localhost:5001/api/" + option;

const ReplyForm = ({threadId}) => {
  const [name, setName] = useState("");
  const [options, setOptions] = useState("");
  const [comment, setComment] = useState("");
  const [newPost, setNewPost] = useState({});
  const [postStatus, setPostStatus] = useState("");

  const clearReplyForm = () => {
    setName("");
    setOptions("");
    setComment("");
  }

  const submitReply = (post) => {
    fetch(api("newpost"), postReq(post))
      .then(resp => { 
        if (resp.status === 200) {
          setPostStatus("Post successful!")
          clearReplyForm();
          // setNewPost(true);
        }
      })
      .catch(err => {
        console.log(err);
        setPostStatus("Error: Could not submit post")
      })
    
      setTimeout(() => setPostStatus(""), 3000);
  }

  const postReq = body => {
    return (
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    )
  }
  
  const handleSubmit = (e) => {
    let post;

    name === "" ? 
    post = { threadId: 1, name: 'Anonyomous', options: options, comment: comment } :
    post = { threadId: 1, name: name, options: options, comment: comment}

    setPostStatus("Submitting post...")
    submitReply(post);

    e.preventDefault();
  }

  return (
    <div id="replyField">
      <table>
        {/* <div style='position:relative'></div> */}
        <form name="post" action="" method="post" enctype="multipart/form-data" />
          <input type="hidden" name="MAX_FILE_SIZE" value="4194304" />
          <input type="hidden" name="mode" value="regist" />
          <input type="hidden" id="postPassword" name="pwd" />
          <input type="hidden" name="resto" value="23291294" />

          <table class="postForm" id="postForm">
            <tbody>
              <tr data-type="Name">
                <td>Name</td>
                <td>
                  <input 
                    name="name" type="text"
                    tabindex="1"
                    placeholder="Anonymous" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                </td>
              </tr>

              <tr data-type="Options">
                <td>Options</td>
                <td>
                  <input
                    name="email"
                    type="text"
                    tabindex="2" 
                    value={options}
                    onChange={(e) => setOptions(e.target.value)}
                    />

                  <input
                    type="submit"
                    value="Post"
                    tabindex="6"
                    onClick={(e) => handleSubmit(e)}
                    />
                </td>
              </tr>

              <tr data-type="Comment">
                <td>Comment</td>
                <td>
                  <textarea
                    name="com"
                    cols="48"
                    rows="4"
                    wrap="soft"
                    tabindex="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    />
                </td>
              </tr>

              <tr data-type="File">
                <td>File</td>
                <td><input id="postFile" name="upfile" type="file" tabindex="7" onChange={(e) => console.log(e.target.value)} /></td>
              </tr>
            </tbody>
          </table>
      </table>
      <div className="postStatus">
        {postStatus}
      </div>
    </div>
  )
}

export default ReplyForm;