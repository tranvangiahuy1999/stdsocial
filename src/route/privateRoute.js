import React from 'react'
import { Redirect, Route } from 'react-router-dom'

const token = sessionStorage.getItem("token");
const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route {...rest} render={(props) => (
    (token)
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
)

export default PrivateRoute
