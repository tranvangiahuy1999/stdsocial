import React from 'react'
import { FiMenu } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import useWindowDimensions from './useWindowDimensions'

const NavBar = (props) =>  {
    const {width, height} = useWindowDimensions()

        return(
                <div className="navbar fixed-top">
                    <div>
                        {
                            width < 768?(
                                <FiMenu className='clickable-icon' onClick={props.sideBarHandle} size="22px" color="white"></FiMenu>
                            ):(
                                <div></div>
                            )
                        }                        
                    </div>
                    <div>
                        <img className="align-self-center" src={props.avatar} alt="avatar" height="28px" width="28px"></img>
                        <text className="align-self-center pl-2 pr-3">{props.username}</text>
                        <BiLogOut className='clickable-icon' onClick={props.logOutHandle} size="22px" color="white"></BiLogOut>
                    </div>
                </div>
        )
}

export default NavBar