import React, { useState } from 'react'
import axiosInstance from '../api/service';
import { AiFillYoutube, AiOutlineLink } from "react-icons/ai";
import { MdInsertPhoto } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import { useAlert } from 'react-alert'
import { Avatar } from 'antd';

const StatusPost = (props) => {
    const [text, setText] = useState('')

    const [youtubeLink, setYouTubeLink] = useState('')
    const [inputYTState, setInputYTState] = useState(false)

    const [fileInput, setFileInput] = useState(null)
    const [previewFile, setPreviewFile] = useState(null)
    const [postbtn, setPostbtn] = useState(false)

    var alert = useAlert()

    function _previewFile(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setPreviewFile(reader.result)
        }
    }

    function _handleChange(e) {
        const file = e.target.files[0]
        setFileInput(file)
        _previewFile(file)
    }

    function youtubeUpload() {
        setFileInput(null)
        setPreviewFile(null)

        if (inputYTState) {
            setYouTubeLink('')
            setInputYTState(false)
            return
        }
        setInputYTState(true)
    }

    function uploadHandle() {
        var formData = new FormData();
        setPostbtn(true)

        let api = `/newfeed/add`

        if (fileInput) {
            api = `/newfeed/add/image`
            formData.append("image", fileInput);
            formData.append("content", text);

            axiosInstance.post(api, formData)
                .then(res => {
                    if (res.data.code === 0) {
                        setText('')
                        setFileInput(null)
                        setPreviewFile(null)

                        alert.show('Posted!', {
                            type: 'success'
                        })

                        props.posted(res.data.data)
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
            axiosInstance.post(api, {
                content: text,
                linkyoutube: youtubeLink,
            })
                .then(res => {
                    if (res.data.code === 0) {
                        setText('')
                        setFileInput(null)
                        setPreviewFile(null)
                        setInputYTState(false)
                        setYouTubeLink('')

                        props.posted(res.data.data)

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
    }

    function _handleSubmit(e) {
        e.preventDefault();
        if (fileInput || text.length > 0 || youtubeLink.length > 0) {
            uploadHandle()
        } else {
            alert.show('There is no data to post!', {
                type: 'error'
            })
        }
    }

    function _inputImageBtn() {
        setYouTubeLink('')
        setInputYTState(false)

        const input = document.getElementById('input-img')
        if (input) {
            input.click()
        }
    }

    function _deleteImageBtn() {
        setFileInput(null)
        setPreviewFile(null)
    }

    return (
        <form className='stp-container col-12 bg-white' onSubmit={_handleSubmit}>
            <div className='stp-contain row p-2'>
                <div style={{ width: '10%', textAlign: 'center' }}>
                    <Avatar src={props.avatar} alt='avatar'></Avatar>
                </div>
                <div className='stp-post' style={{ width: '85%' }}>
                    <textarea className='post-text p-2' rows='3' onChange={e => setText(e.target.value)} value={text} placeholder={`What's on your mind, ${props.username}?`}></textarea>
                    <div className='stp-preview row ml-2'>
                        {
                            inputYTState && (
                                <div style={{ width: '100%' }}>
                                    <div className='m-1'>
                                        <AiOutlineLink className='mr-1' size='20px' color=''></AiOutlineLink>Share a video with your friends
                                    </div>
                                    <input type='text' value={youtubeLink} onChange={e => setYouTubeLink(e.target.value)} placeholder='Paste youtube video url here' style={{ outline: 'none', border: '1px solid lightgray', width: '96%', color: 'rgb(2, 117, 216)', padding: '6px' }}></input>
                                </div>)
                        }
                        {previewFile && (
                            <div>
                                <img className='ml-3' src={previewFile} alt='chosen' style={{ height: '180px', borderRadius: '4px' }} />
                                <ImCancelCircle className='ml-2 clickable-icon' color='gray' size='22px' onClick={_deleteImageBtn}></ImCancelCircle>
                            </div>
                        )}
                    </div>
                    <div className='row stp-action p-2'>
                        <div>
                            <MdInsertPhoto className='clickable-icon ml-3' color='rgb(2, 136, 209)' size='24px' onClick={_inputImageBtn}></MdInsertPhoto>
                            <input id='input-img' type='file' name='image' style={{ display: 'none' }} onChange={_handleChange} accept="image/png, image/jpeg" />
                        </div>
                        <div>
                            <AiFillYoutube onClick={youtubeUpload} className='clickable-icon ml-3' color='rgb(255,0,0)' size='30px'></AiFillYoutube>
                        </div>
                        <div>
                            <button className='btn ml-3 mr-4' disabled={postbtn}>Post</button>
                        </div>
                    </div>

                </div>
            </div>

        </form>
    )
}

export default StatusPost