import React, {useState} from 'react'
import { Comment, Avatar, Form, Button, Input } from 'antd';
import {connect} from 'react-redux';
import axios from 'axios'
import {useAlert} from 'react-alert'

const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <>
      <Form.Item>
        <TextArea rows={4} onChange={onChange} value={value} rows='3'/>
      </Form.Item>
      <Form.Item>
        <Button style={{color:'white', background:'rgb(2, 117, 216)'}} htmlType="submit" loading={submitting} onClick={onSubmit}>
          Add Comment
        </Button>
      </Form.Item>
    </>
  );
  

const CommentPost = (props) => {
  const [submitting, setSubmitting] = useState(false)
  const [cmttext, setCmtText] = useState('')

  const alert = useAlert()

  function handleSubmit(){
    
    if(cmttext.length < 1){
      return;
    }
    
    console.log(props.postid)

    setSubmitting(true)
    if(props.postid){
      axios.put(`http://${process.env.REACT_APP_IP}/newfeed/comment/${props.postid}`, {
        comment: cmttext
      }, {
        headers: {
          'Authorization' : 'Bearer ' + props.token
      }
      })
      .then(res => {
        console.log(res)
        if(res.data.code === 0){
          alert.show('Comment posted', {
            type:'success'
          })
        } else {
          alert.show('Fail to post comment', {
            type:'error'
          })
        }
        setSubmitting(false)
      })
      .catch(e => {
        console.error(e)
        setSubmitting(false)
      })
    }
    setSubmitting(false)
  }
  
  return(
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

function mapStateToProps(state) {
  return {
      token: state.token
  };
}

export default connect(mapStateToProps)(CommentPost)