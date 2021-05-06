import React from 'react'
import { Result, Button } from 'antd';
import {Link, useHistory} from 'react-router-dom'

const NotFoundComponent = props => {
    const history = useHistory()
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