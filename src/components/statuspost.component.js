import React from 'react'
import axios from 'axios'
const token = localStorage.getItem('token')

// import { AiFillYoutube } from "react-icons/ai";
// import { MdInsertPhoto } from "react-icons/md";
// import { FaLaughSquint } from "react-icons/fa";

export default class StatusPost extends React.Component{
    constructor(){
        super()
        this.state = ({
            text: '',
            fileInput: '',
            selectFile: '',
            previewFile: null,
            succAlert: false,
            succ: null,
            errAlert: false,
            err: null
        })
        this._handleChange = this._handleChange.bind(this)
        this._previewFile = this._previewFile.bind(this)   
        this._handleSubmit = this._handleSubmit.bind(this)   
        this.uploadText = this.uploadText.bind(this)     
    }

    _previewFile(file){
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            this.setState({previewFile:reader.result})
        }
    }

    _handleChange(e){
        const file = e.target.files[0]
        this._previewFile(file)
    }

    async uploadText(){
        if(this.state.text.length === 0) return;
        const res = await axios.post(`http://${process.env.REACT_APP_IP}:3000/newfeed/add`, {
            content: this.state.text
        }, {
            headers: {
                'Authorization' : 'Bearer ' + token
            }
        })
        .catch()

        console.log(res)

        if(res){
            if(res.data.code === 0){
                this.setState({
                    succ: res.data.message,
                    succAlert: true
                })                
                setTimeout(() => {this.setState({succAlert: false})}, 3000)  
            } else {
                this.setState({
                    err: res.data.message,
                    errAlert: true
                })                
                setTimeout(() => {this.setState({errAlert: false})}, 3000)  
            }
        }
    }

    async uploadImage(base64EncodedImage){
        try{
            await axios.post(`http://${process.env.REACT_APP_IP}:3000/newfeed/api/upload`,{
                data: JSON.stringify(base64EncodedImage)
            }, {
                headers:{
                    'Content-type':'application/json',
                    'Authorization' : 'Bearer ' + token
                }
            })
        }
        catch(e){
            console.log('upload failed!')
        }
    }

    _handleSubmit(e){
        console.log('sbmit')
        e.preventDefault();
        if(!this.state.previewFile) return;
        this.uploadImage(this.state.previewFile)
    }

    render(){
        return(
            <form className='stp-container col-12 bg-white' onSubmit={this.uploadText}>
                <div className='stp-contain row p-1 m-1 pt-2 pb-2'>
                    <div className='col-1 col-1'>
                        <img src={this.props.avatar} width='30px' height='30px' alt='avatar'></img>
                    </div>
                    <div className='col-md-11 col-sm-11'>
                        <input className='post-text' onChange={e => this.setState({text: e.target.value})} value={this.state.text} placeholder={`What's on your mind, ${this.props.username}?`}></input>
                    </div>
                </div>
                <div className='stp-preview'>
                    {this.state.previewFile && (
                        <img src={this.state.previewFile} alt='chosen' style={{height:'100px'}}></img>
                    )}
                </div>
                <div className='stp-option row'>                    
                    <div className='p-0 col-6'>
                        <input type='file' name='image' onChange={this._handleChange} accept="image/png, image/jpeg" value={this.state.fileInput}/>
                    </div>               
                    <div className='col-6'>
                        <button type='submit' className='btn' style={{fontWeight:'500'}}>Post</button>
                    </div>     
                </div>
                <div className={(this.state.succAlert)?'alert alert-success fadeIn':'alert alert-success fadeOut'} style={{textAlign:'center', position: 'fixed', top: '60px'}}>{this.state.succ}</div>
                <div className={(this.state.errAlert)?'alert alert-danger fadeIn':'alert alert-danger fadeOut'} style={{textAlign:'center', position: 'fixed', top: '60px'}}>{this.state.err}</div>
            </form>
        )
    }
}