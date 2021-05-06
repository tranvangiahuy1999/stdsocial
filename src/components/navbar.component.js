import React, {useState} from 'react'
import { FiMenu } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { BsCaretDownFill } from "react-icons/bs";
import { AiOutlineSetting } from "react-icons/ai";
import { Menu, Dropdown, Button } from 'antd';
import logo from '../resources/logo-tdtu.png'
import useWindowDimensions from './useWindowDimensions'
import { Modal } from 'antd';
import axios from 'axios'
import {connect} from 'react-redux'
import {useAlert} from 'react-alert'

const NavBar = (props) =>  {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pwd, setpwd] = useState('');
    const [repwd, setRepwd] = useState('');
    const {width, height} = useWindowDimensions()

    const showModal = () => {
        setIsModalVisible(true);
      };
    
    const handleOk = () => {
        setIsModalVisible(false);
        onSubmitPwd()
    };
    
    const handleCancel = () => {
        setIsModalVisible(false);
        setpwd('')
        setRepwd('')
    };

    function onSubmitPwd(){
        if(pwd !== repwd){
            return
        }

    }

    const menu = (
        <Menu>
        {
            (props.user_role && (props.user_role === 'admin' || props.user_role === 'user')) && (
                <Menu.Item>
                    <div onClick={showModal} style={{color:'gray'}}><AiOutlineSetting className='clickable-icon mr-1' size="20px" color="gray"></AiOutlineSetting> Password</div>
                </Menu.Item> 
            )
        }            
            <Menu.Item>
                <div onClick={props.logOutHandle} style={{color:'gray'}}><BiLogOut className='clickable-icon mr-1' size="20px" color="gray"></BiLogOut> Log out</div>
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
                <Modal title="Change your password" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <form>
                        <div className='form-group'>
                            <input className='form-control' type='password' value={pwd} onChange={e => setpwd(e.target.value)} placeholder='Enter new password'></input>
                        </div>
                        <div className='form-group'>
                            <input className='form-control' type='password' value={repwd} onChange={e => setRepwd(e.target.value)} placeholder='Re-enter new password'></input>
                        </div>
                    </form>
                </Modal>
            </div>
        )
}

function mapStateToProps(state) {
    return {
        token: state.token
    };
}

export default connect(mapStateToProps)(NavBar)