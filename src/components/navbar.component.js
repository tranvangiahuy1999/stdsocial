import React from 'react'
import { FiMenu } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { BsCaretDownFill } from "react-icons/bs";
import { Menu, Dropdown, Button } from 'antd';
import logo from '../resources/logo-tdtu.png'
import useWindowDimensions from './useWindowDimensions'

const NavBar = (props) =>  {
    const {width, height} = useWindowDimensions()

    const menu = (
        <Menu>
          <Menu.Item>
            <div onClick={props.logOutHandle} style={{color:'gray', textAlign:'center'}}><BiLogOut className='clickable-icon mr-1' size="20px" color="gray"></BiLogOut> Log out</div>
          </Menu.Item>          
        </Menu>
      );

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
                    {props.usersession}                                    
                    <Dropdown overlay={menu} placement="bottomRight" arrow>
                        <Button shape='circle'><BsCaretDownFill color='gray' size="16px"></BsCaretDownFill></Button>
                    </Dropdown>
                </div>
            </div>
        )
}

export default NavBar