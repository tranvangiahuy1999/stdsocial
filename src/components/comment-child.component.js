import React from 'react'
import { Comment, Tooltip, Avatar } from 'antd';
import moment from 'moment';

const CommentChild = (props) => {
    return(
        <Comment            
            author={<a>{props.user_name}</a>}
            avatar={
                <Avatar
                src={props.avatar}
                alt="avatar"
                />
            }
            content={
                <p>
                    {props.content}
                </p>
            }
            datetime={
                <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                <span>{props.datetime}</span>
                </Tooltip>
            }
            />
    )
}

export default CommentChild