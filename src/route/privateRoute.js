import React from 'react'
import {Redirect, Route} from 'react-router-dom'

const PrivateRoute = ({ component: Component, auth,...rest }, props) => (
    <Route {...rest} render={(props) => (
      (auth.length > 0)
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
)

export default PrivateRoute
