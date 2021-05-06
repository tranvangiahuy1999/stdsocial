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
import { connect } from 'react-redux'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import { AiOutlineInfoCircle } from "react-icons/ai";
import { CgDanger } from "react-icons/cg";
// import AlertTemplate from 'react-alert-template-basic'

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
    return(
        <AlertProvider template={AlertTemplate} {...options}>
            <Router>
                <Switch>
                    <Route path="/login" component={LoginView}/>      
                    <PrivateRoute path="/register" component={RegisterPage} auth={props.token}/>
                    <PrivateRoute path="/home" component={Homepage} auth={props.token}/>                    
                    <Route exact component={NotFoundComponent}/>
                </Switch>
            </Router>
        </AlertProvider>
    )
}

function mapStateToProps(state) {
    return {
        token: state.token
    };
}

export default connect(mapStateToProps)(MainRoute)