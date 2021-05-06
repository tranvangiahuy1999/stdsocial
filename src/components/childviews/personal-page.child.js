import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Avatar } from 'antd';
import {connect} from 'react-redux';
import StatusPost from '../statuspost.component'
import StatusCard from '../statuscard.component'
import useWindowDimensions from '../useWindowDimensions'
import { AiFillCamera, AiOutlineCheck,  AiOutlineClose} from "react-icons/ai";

const PersonalPage = (props) => {
    const [userData, setUserData] = useState()    
    const [newfeedData, setNewfeedData] = useState()
    const [fileInput, setFileInput] = useState('')
    const [previewFile, setPreviewFile] = useState(null)
    const [page, setPage] = useState(1)

    const {width, height} = useWindowDimensions()

    useEffect(() => {
        getCurrentUserData()
        getPersonalNewfeed(1)
    }, [])

    async function getPersonalNewfeed(page){
        if(userData){
            await axios.get(`http://${process.env.REACT_APP_IP}/newfeed/yourfeed/${userData.id}/${page}`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
            })
            .then((res) => {
                console.log('newfeed',res)
                if(res.data.code===1){
                    setNewfeedData(res.data.data)
                }
            })
            .catch(e => console.error(e))
        }
    }

    async function getCurrentUserData(){
        await axios.get(`http://${process.env.REACT_APP_IP}/account/current`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {            
            if(res.data.code === 0){
                setUserData(res.data.data)
            }
        })
        .catch(e => {
            console.error(e)
        })
    }

    function likeHandle(id) {

    }

    function cmtHandle(id){
        
    }

    function changeAvatarHandler(){
        const input = document.getElementById('change-avatar')
        if(input){
            input.click()
        }
    }

    function _handleChange(e){
        const file = e.target.files[0]
        setFileInput(file)        
        _previewFile(file)
    }

    function _previewFile(file){
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setPreviewFile(reader.result)            
        }
    }

    function cancelUploadAvatar(){
        setFileInput('')
        setPreviewFile(null)
    }

    function uploadAvatar(){

    }

    return(
        <div className='personal-page'>
            <div className='mr-3 ml-3'>
                <div className='personal-head row'>
                    {
                        (previewFile)?
                        (
                            <Avatar className='ml-4' src={previewFile} size={80} style={{opacity:'0.6'}}></Avatar>
                        ):
                        (
                            <Avatar className='ml-4' src={userData?userData.avatar:''} size={80}></Avatar>
                        )
                    }                    
                    <AiFillCamera onClick={changeAvatarHandler} className='bg-dark' color='white' size='22px' style={{borderRadius:'50%', marginLeft:'-10px', zIndex:'10'}}></AiFillCamera>
                    <div>{userData?userData.user_name:''}</div>
                    <input id='change-avatar' type='file' name='image' accept="image/png, image/jpeg" onChange={_handleChange} style={{display:'none'}}></input>
                    {
                        (previewFile) && (
                            <div className='row' style={{backgroundColor:'lightgray', borderRadius:'10px', padding:'2px'}}>
                                <AiOutlineCheck className='text-primary clickable-icon' onClick={uploadAvatar} color='white' size='20px'></AiOutlineCheck>
                                <AiOutlineClose className='text-danger clickable-icon ml-2' onClick={cancelUploadAvatar} color='white' size='20px'></AiOutlineClose>                                
                            </div> 
                        )
                    }
                </div>
                <div className='row pt-4'>
                    <div className={width < 768?'col-12':'col-5'}>
                        <div className='intro-zone'>
                            <div className='intro-header'>Introduce</div>
                            <div>
                                
                            </div>
                        </div>
                    </div>
                    <div className={width < 768?'col-12':'col-7'}>
                        <StatusPost
                            avatar={userData?userData.avatar:''}
                            username={userData?userData.user_name:''}
                            posted={() => getPersonalNewfeed(1)}
                            >
                        </StatusPost>
                        {
                            (newfeedData && newfeedData.length > 0)?(
                                newfeedData.map((value, index) => (                                       
                                    <StatusCard
                                        key={value._id}
                                        avatar={value.user.avatar}
                                        username={value.user.user_name}
                                        date={value.date.split('T')[0]}
                                        textcontent={value.content}
                                        linkyoutube={value.linkyoutube}
                                        imgcontent= {value.image}
                                        like={value.likecount}
                                        cmt={value.commentcount}                            
                                        likeHandle={() => likeHandle(value._id)}
                                        cmtHandle={() => cmtHandle(value._id)}
                                    ></StatusCard>))
                            )
                        :(
                            <div className='empty-data'>
                                <div className='empty-text'>There are no data to show</div>
                            </div>
                        )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        token: state.token
    };
}

export default connect(mapStateToProps)(PersonalPage)