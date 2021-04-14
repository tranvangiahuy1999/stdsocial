import React from 'react'
import { FaHome } from "react-icons/fa";
import {
    BrowserRouter as Router,
    Link
} from 'react-router-dom'
import { AiFillNotification, AiOutlineNotification, AiOutlineUserAdd } from "react-icons/ai";

export default class SideBar extends React.Component {
    constructor(){
        super();
    }

    render(){
        return(
            <Router>
                <div className="sidebar">
                    <div style={{height:"3em", backgroundColor: "rgba(48,67,84,255)"}}>
                        <h5 className="text-white text-center align-self-center">Notification</h5>
                    </div>
                    <div className="usercard p-2">
                        <div>
                            <img className="ml-2 align-self-center" src={this.props.avatar} alt="avatar" height="32px" width="32px"></img>
                        </div>
                        <div>
                            <text className="text-white align-self-center ml-2 pr-3">{this.props.username}</text>
                        </div>
                    </div>
                    <div className="p-2">
                        <FaHome size="20px" color="white"/>
                        <Link className="link pl-2" to={this.props.homeLink}>Home Page</Link>
                    </div>
                    <div className="p-2">
                        <AiFillNotification size="20px" color="white"/>
                        <Link className="link pl-2" to={this.props.notiLink}>All Notification</Link>
                    </div>
                    <div className="p-2">
                        <AiOutlineUserAdd size="20px" color="white"/>
                        <Link className="link pl-2" to={this.props.createAccLink}>Create Account</Link>
                    </div>
                </div>
            </Router>
        )
    }
}