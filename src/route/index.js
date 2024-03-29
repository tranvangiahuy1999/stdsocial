import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import LoginView from '../views/login'
import Homepage from '../views/homepage'
import RegisterPage from '../views/register'
import NotFoundComponent from '../views/notfoundpage'
import PrivateRoute from './privateRoute'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import { AiOutlineInfoCircle } from "react-icons/ai";
import { CgDanger } from "react-icons/cg";

const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
  transition: transitions.SCALE,
}

const AlertTemplate = ({ style, options, message, close }) => (
  <div style={style}>
    {options.type === 'info' && (
      <div className='alert alert-info row'>
        <AiOutlineInfoCircle size='18px' className='text-info mr-1 mt-auto mb-auto'></AiOutlineInfoCircle>
        {message}
      </div>
    )}
    {options.type === 'success' && (
      <div className='alert alert-success row'>
        <AiOutlineInfoCircle size='18px' className='text-success mr-1 mt-auto mb-auto'></AiOutlineInfoCircle>
        {message}
      </div>)}
    {options.type === 'error' && (
      <div className='alert alert-danger row'>
        <CgDanger size='20px' className='text-danger mr-1 mt-auto mb-auto'></CgDanger>
        {message}
      </div>
    )}
  </div>
)

const MainRoute = (props) => {
  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <Router>
        <Switch>
          <Route path="/login" component={LoginView} />
          <PrivateRoute path="/register" component={RegisterPage} />
          <PrivateRoute path="/home" component={Homepage} />
          <Route exact component={NotFoundComponent} />
        </Switch>
      </Router>
    </AlertProvider>
  )
}

export default MainRoute