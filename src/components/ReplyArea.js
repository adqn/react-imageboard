import React, {useState} from 'react';
import ReplyForm from './ReplyForm';

const ReplyArea = ({index, uri, id}) => {
  const [postSuccess, setPostSuccess] = useState(null);

  return (
    <ReplyForm index={index} uri={uri} threadId={null}  />

  )
}

export default ReplyArea;