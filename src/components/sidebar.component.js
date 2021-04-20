import React, {useEffect, useState} from 'react'
import { FaHome } from "react-icons/fa";
import { RiNotificationBadgeFill, RiNotificationBadgeLine } from "react-icons/ri";
import { IoPersonAdd } from "react-icons/io5";
import useWindowDimensions from './useWindowDimensions'

const SideBar = (props) => {
    const {width, height} = useWindowDimensions()
    const [color, setColor] = useState({textcolor: '', bgcolor:''})

    useEffect(() => {
        if(width < 768){
            setColor({textcolor: 'white', bgcolor: 'orange'})
        } else {
            setColor({textcolor: 'black', bgcolor: 'lightgray'})
        }
    }, [])

        return(    
                <div className="sidebar" style={{position: 'sticky', top: '100px'}}>                           
                    <div style={{borderRight:'1px solid lightgray'}}>
                        <div className="usercard p-2">
                            <div className='row' style={{margin:'auto'}}>
                                <img className="ml-2 align-self-center" src={props.avatar} alt="avatar" height="30px" width="30px"></img>
                                <div className="align-self-center ml-2 pr-3" style={{color: color.textcolor}}>{props.username}</div>
                            </div>
                        </div>
                        <div className="p-2" style={{backgroundColor: props.choose===0?color.bgcolor: '', margin:'16px', borderRadius:'10px'}}>
                            <FaHome size="20px" color={color.textcolor}/>
                            {props.homeLink}
                        </div>
                        <div className="p-2" style={{backgroundColor: props.choose===1?color.bgcolor: '', margin:'16px', borderRadius:'10px'}}>
                            <RiNotificationBadgeFill size="20px" color={color.textcolor}/>
                            {props.notiLink}
                        </div>
                        <div className="p-2" style={{backgroundColor: props.choose===2?color.bgcolor: '', margin:'16px', borderRadius:'10px'}}>
                            <RiNotificationBadgeLine size="20px" color={color.textcolor}/>
                            {props.notiWrite}
                        </div>
                        <div className="p-2" style={{backgroundColor: props.choose===3?color.bgcolor: '', margin:'16px', borderRadius:'10px'}}>
                            <IoPersonAdd size="20px" color={color.textcolor}/>
                            {props.createAccLink}
                        </div>
                    </div>
                </div>
        )
}

export default SideBar