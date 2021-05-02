import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch
  } from "react-router-dom";
import LoginView from '../views/login'
import Homepage from '../views/homepage'
import NotFoundComponent from '../views/notfoundpage'
import PrivateRoute from './privateRoute'
import { connect } from 'react-redux'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const options = {    
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    offset: '30px',    
    transition: transitions.SCALE,    
}  

const MainRoute = (props) => {
    return(
        <AlertProvider template={AlertTemplate} {...options}>
            <Router>
                <Switch>
                    <Route path="/login" component={LoginView}/>            
                    {/* <PrivateRoute path="/home" component={Homepage} auth={props.token}/> */}
                    <Route path="/home" component={Homepage}/>   
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