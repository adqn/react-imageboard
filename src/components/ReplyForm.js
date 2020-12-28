import React, { useCallback, useEffect, useState } from "react";
import axios from 'axios';

const api = (option) => "http://localhost:5001/api/" + option;

const ReplyForm = ({ index, uri, threadId }) => {
  const [subject, setSubject] = useState("")
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [newPost, setNewPost] = useState({});
  const [postStatus, setPostStatus] = useState("");

  const clearReplyForm = () => {
    setSubject("");
    setName("");
    setEmail("");
    setComment("");
    setFile(null);
  };

  const getDimensions = (image, callback) => {
    window.URL = window.URL || window.webkitURL;
    let img = new Image();
    img.src = window.URL.createObjectURL(image);

    img.onload = () => callback(img.naturalWidth, img.naturalHeight);

    // img.remove();
  }

  const uploadFile = (filename) => 
    new Promise((resolve, reject) => {

      const formData = new FormData();
      formData.append(
        "img",
        file,
        filename
      );

      axios.post(api("uploadfile"), formData)
        .then(resp => resolve(resp))
    })

  const submitReply = (post) => {
    fetch(api("newpost"), postReq(post))
      .then((resp) => {
        if (resp.status === 200) {
          setPostStatus("Post successful!");
          clearReplyForm();
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
      .catch((err) => console.log(err))
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
    let finalFileName = null;

    name === "" ? finalName = "Anonymous" : finalName = name;

    if (file) {
      let epoch = new Date().getTime();
      let ext = file.name.match(/\..+/)[0];

      finalFileName = epoch + ext;
    }

    post = {
      board: uri,
      thread: threadId,
      subject,
      email: email,
      name: finalName,
      comment: comment,
      file: finalFileName
    }

    if (index) {
      post.thread = "newthread";
      post.bump = 1;
      setPostStatus("Submitting thread...");

      if (file) {
        let fileSize = file.size;

        getDimensions(file, (fileWidth, fileHeight) => {
          if (fileWidth < 10000 || fileHeight < 10000) {
            let fileInfo = { fileSize, fileWidth, fileHeight };
            uploadFile(finalFileName)
              .then(res => {
                if (res.status === 200) {
                  submitThread({ ...post, ...fileInfo });
                  setPostStatus("Post successful!")
                } else {
                  setPostStatus("Error: upload failed.")
                }
              });
          }
        });
      } else {
        setPostStatus("Error: you must select an image when making a new thread!");
        return;
      }
    } else {
      email === "sage" ? post.sage = 1 : post.sage = null;
      setPostStatus("Submitting post...");

      if (file) {
        let fileSize = file.size;

        getDimensions(file, (fileWidth, fileHeight) => {
          if (fileWidth < 10000 || fileWidth < 10000) {
            let fileInfo = {fileSize, fileWidth, fileHeight }
            uploadFile(finalFileName)
              .then(res => {
                if (res.status === 200) {
                  submitReply({ ...post, ...fileInfo });
                  setPostStatus("Post successful!")
                } else {
                  setPostStatus("Error: upload failed.")
                }
              });
          } else {
              setPostStatus("Error: image dimensions must be less than 10000x10000.")
          }
        });

      } else {
        let f = {fileSize: null, fileWidth: null, fileHeight: null}
        submitReply({ ...post, ...f });
      }
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
                  onChange={(e) => setFile(e.target.files[0])}
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