import React,{useEffect} from 'react'
import { Result, Button } from 'antd';
import {useHistory} from 'react-router-dom'
import { useAlert } from 'react-alert';

const NotFoundComponent = props => {
    const history = useHistory()
    const alert = useAlert()
    useEffect(() => {
        alert.show('Redirect to login page...', {
            type: 'success'
        })
        setTimeout(()=> {
            history.push('/login')
        }, 3000)
    } , [])
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary" onClick={() => history.push('/login')}>Back Home</Button>}
        />
    )
};

export default NotFoundComponent