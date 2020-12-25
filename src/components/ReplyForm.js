import React, { useEffect, useState } from "react";

const api = (option) => "http://localhost:5001/api/" + option;

const ReplyForm = ({ index, uri, threadId, newThreadId }) => {
  const [subject, setSubject] = useState("")
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [newPost, setNewPost] = useState({});
  const [postStatus, setPostStatus] = useState("");

  const clearReplyForm = () => {
    setSubject("");
    setName("");
    setEmail("");
    setComment("");
  };

  const submitReply = (post) => {
    fetch(api("newpost"), postReq(post))
      .then((resp) => {
        if (resp.status === 200) {
          setPostStatus("Post successful!");
          clearReplyForm();
          // setNewPost(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setPostStatus("Error: Could not submit post");
      });

    setTimeout(() => setPostStatus(""), 3000);
  };

  const submitThread = post => {
    fetch(api("newthread"), postReq(post))
      .then(resp => {
        if (resp.status === 200) {
          setPostStatus("Post successful!");
          clearReplyForm();
        }
      })
      .catch(() => null)
  }

  const postReq = (body) => {
    return {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
  };

  const handleSubmit = (e) => {
    let post;
    let finalName;
    let finalSubject = "null";

    name === "" ? finalName = "Anonymous" : finalName = name;

    if (index) {
      finalSubject = subject;
    
      post = {
        board: uri,
        subject: finalSubject,
        newThreadId,
        email: email,
        name: finalName,
        comment: comment,
        file: "null"
      }

      setPostStatus("Submitting thread...")
      submitThread(post);
    } else {
      post = {
        board: uri,
        subject: finalSubject,
        thread: threadId,
        email: email,
        name: finalName,
        comment: comment,
        file: "null"
      }

      setPostStatus("Submitting post...");
      submitReply(post);
    }

    e.preventDefault();
  };

  return (
    <div id="replyField">
      <table>
        {/* <div style='position:relative'></div> */}
        <form
          name="post"
          action=""
          method="post"
          enctype="multipart/form-data"
        />
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
                  name="name"
                  type="text"
                  tabindex="1"
                  placeholder="Anonymous"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </td>
            </tr>

            {index ? 
              <tr data-type="Name">
                <td>Subject</td>
                <td>
                  <input
                    name="subject"
                    type="text"
                    tabindex="1"
                    placeholder=""
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </td>
              </tr>
              :
              null
            }

            <tr data-type="Email">
              <td>Email</td>
              <td>
                <input
                  name="email"
                  type="text"
                  tabindex="2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              <td>
                <input
                  id="postFile"
                  name="upfile"
                  type="file"
                  tabindex="7"
                  onChange={(e) => console.log(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </table>
      <div className="postStatus">{postStatus}</div>
    </div>
  );
};

export default ReplyForm;