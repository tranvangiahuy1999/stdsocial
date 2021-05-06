import React, {useState, useEffect} from 'react'
import { FaRegEdit } from "react-icons/fa";
import { ImBin } from "react-icons/im";

const AccRow = (props) => {
    
    return(
        <div className='row acc-row col-14'>
            <div className='col-3'>Tran Van Gia Huy</div>
            <div className='col-3'>
                <div className='ml-1'>
                    GHUY
                </div>
            </div>
            <div className='col-3'>
                <div className='ml-2'>
                    3
                </div>
            </div>
            <div className='col-3'>
                <div className='ml-2'>
                    <FaRegEdit className='clickable-icon' size='20px' color='gray' onClick={props.editHandle}></FaRegEdit>
                    <span>
                        <ImBin className='ml-3 clickable-icon' size='20px' color='gray' onClick={props.deleteHandle}></ImBin>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default AccRow