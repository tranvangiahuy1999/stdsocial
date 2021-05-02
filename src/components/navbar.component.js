import React from 'react'
import { FiMenu } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import logo from '../resources/logo-tdtu.png'
import useWindowDimensions from './useWindowDimensions'
import { Avatar } from 'antd';

const NavBar = (props) =>  {
    const {width, height} = useWindowDimensions()

        return(
            <div className="navbar fixed-top">
                <div className='row ml-1'>
                    {
                        width < 768?(
                            <FiMenu className='clickable-icon' onClick={props.sideBarHandle} size="24px" color="gray"></FiMenu>
                        ):(
                            <div></div>
                        )
                    }
                    <div className='logo-title'>
                        <img className='align-self-center ml-3' src={logo} alt="tdtu-logo"/>                        
                    </div>
                </div>
                <div className='row mr-1'>
                    <div>
                        <Avatar src={props.avatar} alt="avatar" ></Avatar>
                    </div>
                    <div className="align-self-center pl-2 pr-3" style={{color: 'black', fontWeight:'bold'}}>{props.username}</div>
                    <BiLogOut className='clickable-icon' onClick={props.logOutHandle} size="26px" color="gray"></BiLogOut>
                </div>
            </div>
        )
}

export default NavBar