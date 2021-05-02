import React from 'react'
import useWindowDimensions from './useWindowDimensions'

const SideBar = (props) => {
    const {width, height} = useWindowDimensions()        

        return(    
                <div className="sidebar bg-white">                        
                    <div>
                        <div className='component-title'>
                            SHORTCUTS
                        </div>
                        {props.sidebarchild}                        
                    </div>
                </div>
        )
}

export default SideBar