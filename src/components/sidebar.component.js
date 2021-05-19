import React from 'react'
import useWindowDimensions from './useWindowDimensions'

const SideBar = (props) => {
    const {width, height} = useWindowDimensions()        

        return(    
                <div className={width > 768 ?"sidebar bg-white":"sidebar-lib bg-white"}>                        
                    <div>
                        <div className='component-title'>
                            DASHBOARD
                        </div>
                        {props.sidebarchild}                        
                    </div>
                </div>
        )
}

export default SideBar