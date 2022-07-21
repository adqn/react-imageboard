import React, { useState } from "react";
import axios from "axios";
import { predictImage } from "../helpers/imageHelpers";
import * as config from "../config";

const api = (option: string) => "http://localhost:5001/api/" + option;

const getImageObject = (file: File) => {
  const img = new Image();
  window.URL = window.URL || window.webkitURL;
  img.src = window.URL.createObjectURL(file);
  return img;
};

const getDimensions = (file: File, callback: any) => {
  const img = getImageObject(file);

  img.onload = () => {
    callback(img.naturalWidth, img.naturalHeight);
    img.remove();
  };
};

const uploadFile = (file: Blob, filename: string) =>
  new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("img", file as Blob, filename);

    axios.post(api("uploadfile"), formData).then((resp) => resolve(resp));
  });

const postReq = (body: any) => {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
};

const ReplyForm = ({
  index,
  uri,
  threadId,
}: {
  index: boolean;
  uri: string;
  threadId?: number;
}) => {
  const [subject, setSubject] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [file, setFile] = useState<File | Blob | undefined>(undefined);
  const [postStatus, setPostStatus] = useState<string>("");

  const clearReplyForm = () => {
    setSubject("");
    setName("");
    setEmail("");
    setComment("");
    setFile(undefined);
  };

  const submitReply = (post: Post) => {
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

  const submitThread = (post: Post) => {
    fetch(api("newthread"), postReq(post))
      .then((resp) => {
        if (resp.status === 200) {
          setPostStatus("Post successful!");
          clearReplyForm();
        }
      })
      .catch((err) => console.log(err));
  };

  const handlePreSubmit = (ev: any) => {
    ev.preventDefault();

    if (file) {
      if (config.nsfw_mode) {
        predictImage(getImageObject(file as File)).then((predictions: any) => {
          console.log(predictions);

          if (
            predictions[0].className === "Neutral" ||
            predictions[0].className === "Drawing"
          ) {
            handleSubmit(file as File);
          } else {
            handleSubmit();
          }
        });
      } else {
        handleSubmit(file as File);
      }
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = (file?: File) => {
    const post: Post = {
      board: uri,
      thread: threadId,
      subject,
      email,
      name,
      comment,
      file: null,
    };

    if (file) {
      const epoch = new Date().getTime();
      const ext = file.name.match(/\..+/)![0];

      post.file = epoch + ext;
    }

    if (name === "") {
      post.name = "Anonymous";
    }

    if (index) {
      post.thread = "newthread";
      post.bump = 1;
      setPostStatus("Submitting thread...");

      if (file) {
        let fileSize = file.size;

        getDimensions(file, (fileWidth: string, fileHeight: string) => {
          if (Number(fileWidth) < 10000 || Number(fileHeight) < 10000) {
            const fileInfo = { fileSize, fileWidth, fileHeight };

            uploadFile(file, post.file as string).then((res: any) => {
              if (res.status === 200) {
                submitThread({ ...post, ...fileInfo });
                setPostStatus("Post successful!");
              } else {
                setPostStatus("Error: upload failed.");
              }
            });
          }
        });
      } else {
        setPostStatus(
          "Error: you must select an image when making a new thread!"
        );
        return;
      }
    } else {
      email === "sage" ? (post.sage = true) : (post.sage = false);
      setPostStatus("Submitting post...");

      if (file) {
        let fileSize = file.size;

        getDimensions(file, (fileWidth: string, fileHeight: string) => {
          if (Number(fileWidth) < 10000 || Number(fileWidth) < 10000) {
            const fileInfo = { fileSize, fileWidth, fileHeight };

            uploadFile(file, post.file as string).then((res: any) => {
              if (res.status === 200) {
                submitReply({ ...post, ...fileInfo });
                setPostStatus("Post successful!");
              } else {
                setPostStatus("Error: upload failed.");
              }
            });
          } else {
            setPostStatus(
              "Error: image dimensions must be less than 10000x10000."
            );
          }
        });
      } else {
        submitReply(post);
      }
    }
  };

  return (
    <div id="replyField">
      <div>
        <form
          name="post"
          action=""
          method="post"
          encType="multipart/form-data"
        />
        <input type="hidden" name="MAX_FILE_SIZE" value="4194304" />
        <input type="hidden" name="mode" value="regist" />
        <input type="hidden" id="postPassword" name="pwd" />
        <input type="hidden" name="resto" value="23291294" />
      </div>
      <table className="postForm" id="postForm">
        <tbody>
          <tr data-type="Name">
            <td>Name</td>
            <td>
              <input
                name="name"
                type="text"
                tabIndex={1}
                placeholder="Anonymous"
                value={name}
                onChange={(ev: any) => setName(ev.target.value)}
              />
            </td>
          </tr>

          {index ? (
            <tr data-type="Name">
              <td>Subject</td>
              <td>
                <input
                  name="subject"
                  type="text"
                  tabIndex={1}
                  placeholder=""
                  value={subject}
                  onChange={(ev: any) => setSubject(ev.target.value)}
                />
              </td>
            </tr>
          ) : null}

          <tr data-type="Email">
            <td>Email</td>
            <td>
              <input
                name="email"
                type="text"
                tabIndex={2}
                value={email}
                onChange={(ev: any) => setEmail(ev.target.value)}
              />

              <input
                type="submit"
                value="Post"
                tabIndex={6}
                onClick={(ev: any) => handlePreSubmit(ev)}
              />
            </td>
          </tr>

          <tr data-type="Comment">
            <td>Comment</td>
            <td>
              <textarea
                name="com"
                cols={48}
                rows={4}
                wrap="soft"
                tabIndex={4}
                value={comment}
                onChange={(ev: any) => setComment(ev.target.value)}
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
                tabIndex={7}
                onChange={(ev: any) => setFile(ev.target.files[0])}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="postStatus">{postStatus}</div>
    </div>
  );
};

export default ReplyForm;
