import React, {useState} from 'react';

const api = option => "http://localhost:5001/api/" + option;

const ReplyForm = () => {
  const [name, setName] = useState("");
  const [options, setOptions] = useState("");
  const [comment, setComment] = useState("");

  const clearReplyForm = () => {
    setName("");
    setOptions("");
    setComment("");
  }

  const submitReply = post => {
    fetch(api("newpost"), postReq(post))
      .then(resp => console.log(resp))
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
    e.preventDefault();
    const newPost = { name, options, comment };
    // setPost(newPost);
    // console.log(post);
    // submitReply(newPost);
    // if successful -> clearReplyForm(); navigate to #bottom
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
                    onChange={(e) => setOptions(e.target.value)}
                    />

                  <input
                    type="submit"
                    value="Post"
                    tabindex="6"
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
                    onChange={(e) => setComment(e.target.value)}
                    />
                </td>
              </tr>

              <tr data-type="File">
                <td>File</td>
                <td><input id="postFile" name="upfile" type="file" tabindex="7" /></td>
              </tr>
            </tbody>
          </table>
      </table>
    </div>
  )
}

export default ReplyForm;