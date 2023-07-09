import React, { useState } from 'react'
import { Comment, Avatar, Form, Button, Input } from 'antd';
import axiosInstance from '../api/service';
import { useAlert } from 'react-alert'

const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button style={{ color: 'white', background: 'rgb(2, 117, 216)' }} htmlType="submit" loading={submitting} onClick={onSubmit}>
        Add Comment
      </Button>
    </Form.Item>
  </>
);


const CommentPost = (props) => {
  const [submitting, setSubmitting] = useState(false)
  const [cmttext, setCmtText] = useState('')

  const alert = useAlert()

  function handleSubmit() {
    if (cmttext.length < 1) {
      return;
    }

    setSubmitting(true)
    if (props.postid) {
      const body = {
        comment: cmttext
      }
      axiosInstance.put(`/newfeed/comment/${props.postid}`, body)
        .then(res => {
          if (res.data.code === 0) {
            alert.show('Comment posted', {
              type: 'success'
            })

            setCmtText('')
          } else {
            alert.show('Fail to post comment', {
              type: 'error'
            })
          }
        })
        .catch(e => {
          console.error(e)
        })
    }
    setSubmitting(false)
  }

  return (
    <>
      <Comment
        avatar={
          <Avatar
            src={props.avatar}
            alt="avatar"
          />
        }
        content={
          <Editor
            onChange={e => setCmtText(e.target.value)}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={cmttext}
          />
        }
      />
    </>
  )
}

export default CommentPost