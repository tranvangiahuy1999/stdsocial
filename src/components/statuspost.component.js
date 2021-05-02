import React, {useState} from 'react'
import axios from 'axios'
import { AiFillYoutube } from "react-icons/ai";
import { MdInsertPhoto } from "react-icons/md";
import { ImBin } from "react-icons/im";
import {connect} from 'react-redux'
import { useAlert } from 'react-alert'
import { Avatar } from 'antd';

const StatusPost =(props) => {
    const [text, setText] = useState('')
    const [fileInput, setFileInput] = useState('')
    const [previewFile, setPreviewFile] = useState(null)
    const [postbtn, setPostbtn] = useState(false)

    var alert = useAlert()

    function _previewFile(file){
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setPreviewFile(reader.result)            
        }
    }

    function _handleChange(e){
        const file = e.target.files[0]
        setFileInput(file)        
        _previewFile(file)
    }

    async function uploadImage(){        
        var formData = new FormData();
        setPostbtn(true)

        let api = `http://${process.env.REACT_APP_IP}/newfeed/add`

        if(fileInput){
            api = `http://${process.env.REACT_APP_IP}/newfeed/add/image`
            await formData.append("image", fileInput);
            await formData.append("content", text);
            
            await axios.post(api, formData, {
                headers:{        
                    'Content-Type': 'multipart/form-data',
                    'Authorization' : 'Bearer ' + props.token
                }
            })
            .then(res => {                                
                if(res.data.code === 0){
                    setText('')
                    setFileInput('')
                    setPreviewFile(null)
                                    
                    alert.show('Posted!', {
                        type: 'success'
                    })
                } else {                                        
                    alert.show('Something wrong!', {
                        type: 'error'
                    })                    
                }
                setPostbtn(false)
            })
            .catch(e => {                             
                alert.show('Something wrong!', {
                    type: 'error'
                }) 
                setPostbtn(false)               
            })
        }
        else {
            await axios.post(api, {
                content: text
            }, {
                headers:{                            
                    'Authorization' : 'Bearer ' + props.token
                }
            })
            .then(res => {                              
                if(res.data.code === 0){
                    setText('')
                    setFileInput('')
                    setPreviewFile(null)                    
                    
                    alert.show('Posted', {
                        type: 'success'
                    })
                } else {                    
                    alert.show('Something wrong!', {
                        type: 'error'
                    })                      
                }

                setPostbtn(false)
            })
            .catch(e => {                
                alert.show('Something wrong!', {
                    type: 'error'
                })
                setPostbtn(false) 
            })
        }
        setPostbtn(false)
    }

    function _handleSubmit(e){
        e.preventDefault();
        if(previewFile || text.length > 0){            
            uploadImage()
        }
        return
    }

    function _inputImageBtn(){
        const input = document.getElementById('input-img')
        if(input){
            input.click()
        }
    }

    function _deleteImageBtn(){
        setFileInput('')
        setPreviewFile(null)
    }
    
        return(
            <form className='stp-container col-12 bg-white' onSubmit={_handleSubmit}>
                <div className='stp-contain row p-2'>
                    <div className={{}} style={{width:'10%'}}>
                        <Avatar src={props.avatar} alt='avatar'></Avatar> 
                        {/* <img className='avatar' src={props.avatar} style={{width: '30px' , height:'30px'}} alt='avatar'></img> */}
                    </div>
                    <div className='stp-post' style={{width:'90%'}}>
                        <textarea className='post-text p-2' rows='3' onChange={e => setText(e.target.value)} value={text} placeholder={`What's on your mind, ${props.username}?`}></textarea>
                        <div className='stp-preview row ml-2'>
                            {previewFile && (
                                <div>
                                    <img className='ml-3' src={previewFile} alt='chosen' style={{height:'180px', borderRadius:'4px'}}/> 
                                    <ImBin className='ml-2 clickable-icon' color='gray' size='22px' onClick={_deleteImageBtn}></ImBin>
                                </div>
                            )}
                        </div>
                        <div className='row stp-action'>
                            <div>
                                <MdInsertPhoto className='clickable-icon ml-3' color='rgba(79,78,75,255)' size='24px' onClick={_inputImageBtn}></MdInsertPhoto>
                                <input id='input-img' type='file' name='image' style={{display:'none'}} onChange={_handleChange} accept="image/png, image/jpeg"/>
                            </div>
                            <div>
                                <AiFillYoutube className='clickable-icon ml-3' color='rgba(79,78,75,255)' size='26px'></AiFillYoutube>
                            </div>
                            <div>
                                <button className='btn ml-3 mr-3' disabled={postbtn}>Post</button>
                            </div>
                        </div>
                        
                    </div>
                </div>                

            </form>
        )    
}

function mapStateToProps(state) {
    return {
        token: state.token
    };
}

export default connect(mapStateToProps)(StatusPost)