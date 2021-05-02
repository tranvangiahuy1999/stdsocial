import React, {useState, useEffect} from 'react'
import { FaRegEdit } from "react-icons/fa";
import { ImBin } from "react-icons/im";

const AccRow = (props) => {
    
    return(
        <div className='row acc-row'>
            <div className='col-3'>Tran Van Gia Huy</div>
            <div className='col-3'>
                3
            </div>
            <div className='col-3'>
                4/30/2021
            </div>
            <div className='col-3'>
                <div className='row ml-3'>
                    <FaRegEdit className='clickable-icon' size='20px' color='gray' onClick={props.editHandle}></FaRegEdit>
                    <ImBin className='ml-3 clickable-icon' size='20px' color='gray' onClick={props.deleteHandle}></ImBin>
                </div>
            </div>
        </div>
    )
}

export default AccRow