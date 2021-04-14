import React from 'react'
import { AiFillYoutube } from "react-icons/ai";
import { MdInsertPhoto } from "react-icons/md";
import { FaLaughSquint } from "react-icons/fa";

export default class StatusPost extends React.Component{
    render(){
        return(
            <div className='stp-container col-sm-9 col-md-9 bg-white'>
                <div className='stp-contain row p-1 m-1 pt-2 pb-2'>
                    <div className='col-md-1 col-sm-1'>
                        <img src={this.props.avatar} width='30px' height='30px' alt='avatar'></img>
                    </div>
                    <div className='col-md-11 col-sm-11'>
                        <input placeholder={`What's on your mind, ${this.props.username}?`}></input>
                    </div>
                </div>
                <div className='stp-option row'>
                    <div className='col-md-4 col-sm-4 p-0'>
                        <button onClick={this.props.videopost}><AiFillYoutube size='18px' color='red' style={{marginRight:'10px'}}></AiFillYoutube>YouTube</button>
                    </div>
                    <div className='col-md-4 col-sm-4 p-0'>
                        <button onClick={this.props.imgpost}><MdInsertPhoto size='18px' color='rgb(0,138,216)' style={{marginRight:'10px'}}></MdInsertPhoto>Photo</button>
                    </div>
                    <div className='col-md-4 col-sm-4 p-0'>
                        <button onClick={this.props.emojipost}><FaLaughSquint size='18px' color='rgb(246,190,0)' style={{marginRight:'10px'}}></FaLaughSquint>Feeling</button>
                    </div>
                </div>
            </div>
        )
    }
}