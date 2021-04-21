import React from 'react'

import {Redirect, Route} from 'react-router-dom'

const token = localStorage.getItem('token')

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      (token.length > 0)
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
)

export default PrivateRoute