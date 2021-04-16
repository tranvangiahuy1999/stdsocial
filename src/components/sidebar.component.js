import React from 'react'
import { FaHome } from "react-icons/fa";
import {
    BrowserRouter as Router,
    Link
} from 'react-router-dom'
import { AiFillNotification, AiOutlineUserAdd } from "react-icons/ai";

export default class SideBar extends React.Component {
    constructor(){
        super();
        this.chooseOption = this.chooseOption.bind(this)
    }

    chooseOption(){

    }

    render(){
        return(    
                <div className="sidebar">
                    <div style={{height:"42px", backgroundColor: "rgba(48,67,84,255)"}}></div>
                    <div>
                        <div className="usercard p-2">
                            <div>
                                <img className="ml-2 align-self-center" src={this.props.avatar} alt="avatar" height="32px" width="32px"></img>
                            </div>
                            <div>
                                <div className="text-white align-self-center ml-2 pr-3">{this.props.username}</div>
                            </div>
                        </div>
                        <div className="p-2" style={{backgroundColor: this.props.choose===0?'orange': ''}}>
                            <FaHome size="20px" color="white"/>
                            {this.props.homeLink}
                        </div>
                        <div className="p-2" style={{backgroundColor: this.props.choose===1?'orange': ''}}>
                            <AiFillNotification size="20px" color="white"/>
                            {this.props.notiLink}
                        </div>
                        <div className="p-2" style={{backgroundColor: this.props.choose===2?'orange': ''}}>
                            <AiOutlineUserAdd size="20px" color="white"/>
                            {this.props.createAccLink}
                        </div>
                    </div>
                </div>
        )
    }
}