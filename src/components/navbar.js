import React from 'react'
import { FiMenu } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";

export default class NavBar extends React.Component {
    constructor(){
        super();
    }

    render(){
        return(
                <div className="navbar bg-primary">
                    <div>
                        <FiMenu className='clickable-icon' onClick={this.props.sideBarHandle} size="22px" color="white"></FiMenu>
                    </div>
                    <div>
                        <img className="align-self-center" src={this.props.avatar} alt="avatar" height="28px" width="28px"></img>
                        <text className="align-self-center pl-2 pr-3">{this.props.username}</text>
                        <BiLogOut className='clickable-icon' onClick={this.props.logOutHandle} size="22px" color="white"></BiLogOut>
                    </div>
                </div>
        )
    }
}