import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Avatar, Space, Spin, Result } from 'antd';
import {connect} from 'react-redux';
import StatusPost from '../statuspost.component'
import StatusCard from '../statuscard.component'
import useWindowDimensions from '../useWindowDimensions'
import { FaRegEdit, FaRegSave, FaBirthdayCake, FaUsers, FaTransgender } from "react-icons/fa";
import {getToken} from '../../actions/index'
import { AiFillCamera, AiOutlineCheck,  AiOutlineClose, AiFillPhone} from "react-icons/ai";
import { useAlert } from 'react-alert';
import { useParams } from 'react-router-dom';
import { io } from "socket.io-client";

const PersonalPage = (props) => {
    const [userData, setUserData] = useState()    
    const [newfeedData, setNewfeedData] = useState([])

    const [avatar, setAvatar] = useState('')
    const [username, setUsername] = useState('')

    const [fileInput, setFileInput] = useState('')
    const [previewFile, setPreviewFile] = useState(null)
    const [changeUsernameText, setChangeUsernameText] = useState('')
    const [changeUsernameState, setChangeUsernameState] = useState(false)
    const [personalInfo, setPersonalInfo] = useState()
    const [isYour, setIsYour] = useState(false)

    const [loading, setLoading] = useState(true)
    const [newcmt, setNewCmt] = useState()
    const [userPageExist, setUserPageExist] = useState(true)

    const [loadingNewfeed, setLoadingNewfeed] = useState(false)
    const [hasMore, setHasMore] = useState(true)    

    const alert = useAlert()

    var newfeeddata = [], count = 1

    let { id } = useParams()

    const {width, height} = useWindowDimensions()

    useEffect(() => {
        getCurrentUserData()                   
        window.addEventListener('scroll', debounce(handleInfiniteOnLoad, 1000))
        return () => window.removeEventListener('scroll', debounce(handleInfiniteOnLoad, 1000));      
    }, [])

    useEffect(()=> {        
        getUserInformation()
        getPersonalNewfeed(count)
    }, [props.token])

    useEffect(() => {        
        if(userData) {
            if(id === userData._id){
                setIsYour(true)
            }                    
        }
    }, [userData])

    useEffect(() => {
        const socket = io.connect(`${process.env.REACT_APP_IP}`, { transports: ["websocket"], withCredentials: true});            
        socket.on('new_comment', (data) => {
            newCommentHandler(data)
        })
        return () => {            
            socket.off("new_comment");
        }
    }, [])

    function newCommentHandler(data){
        setNewCmt(data.data)        
    }

    const debounce = (func, delay) => {
        let inDebounce;
        return function() {
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => {
        func.apply(this, arguments);
            }, delay);
        }
    }

    function handleInfiniteOnLoad(){
        if (document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 100){
            setLoadingNewfeed(true)
            count += 1
            getPersonalNewfeed(count)        
        }
    }

    function getUserInformation(){
        let userid = undefined

            if(isYour) {
                userid = userData._id
            } else {
                userid = id
            }

            axios.get(`${process.env.REACT_APP_IP}/account/user/${userid}`, {
                headers: {
                    'Authorization' : 'Bearer ' + props.token
                }
            })
            .then(res => {         
                console.log(res, userid)                       
                if(res.data.code===0){
                    setPersonalInfo(res.data.data)                    
                    setAvatar(res.data.data.avatar)
                    setUsername(res.data.data.user_name)
                } else {
                    setUserPageExist(false)
                }
            })
            .catch( e => {
                console.error(e)                
            })
    }

    function getCurrentUserData(){        
        axios.get(`${process.env.REACT_APP_IP}/account/current`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {                         
            if(res.data.code === 0){
                setUserData(res.data.data)
            }
        })
        .catch( e => {
            console.error(e)            
        })
    }

    async function getPersonalNewfeed(page){
        let userid = undefined            
            if(isYour) {
                userid = userData._id
            } else {
                userid = id
            }

            axios.get(`${process.env.REACT_APP_IP}/newfeed/yourfeed/${userid}/${page}`, {
                headers: {
                    'Authorization' : 'Bearer ' + props.token
                }
            })
            .then((res) => {                                    
                if(res.data.code===0){
                    newfeeddata = newfeeddata.concat(res.data.data)                
                    setNewfeedData(newfeeddata)
                }
                else {
                    setHasMore(false)
                }                
                setLoading(false)
                setLoadingNewfeed(false)
            })
            .catch( e => {
                console.error(e)                
            })        
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

    async function uploadAvatar(){
        var formData = new FormData();
        if(fileInput){
            await formData.append("image", fileInput);

            axios.put(`${process.env.REACT_APP_IP}/account/update/avatar`, formData, {
                headers:{        
                    'Content-Type': 'multipart/form-data',
                    'Authorization' : 'Bearer ' + props.token
                }
            })
            .then(res => {                
                if(res.data.code===0){                    
                    alert.show('Avatar changed',{
                        type:'success'
                    })
                    props.getToken(res.data.token)
                    setFileInput('')
                    setPreviewFile(null)
                } else {
                    alert.show(res.data.message,{
                        type:'error'
                    })
                }
            })
            .catch(e => {
                console.error(e)                
            })
        }
        else {
            alert.show(`Image hasn't uploaded`,{
                type:'error'
            })
        }
    }

    function newPostHandle(post) {
        setNewfeedData([post].concat(newfeedData))
    }

    function changeUsernameHandle(){
        setChangeUsernameText(personalInfo?personalInfo.user_name:'')
        setChangeUsernameState(true)
    }

    function renameAccount(){
        if(changeUsernameText.length < 1){
            alert.show('Empty input', {
                type: 'error'
            })
            return
        }

        axios.put(`${process.env.REACT_APP_IP}/account/rename`, {
            rename: changeUsernameText
        }, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {            
            if(res.data.code === 0){
                alert.show('Username changed', {
                    type: 'success'
                })
                props.getToken(res.data.token)                
                setChangeUsernameState(false)
            }
            else {
                alert.show(res.data.message, {
                    type: 'error'
                })
            }
        })
        .catch( e => {
            console.error(e)            
        })
    }

    return(     
        (userPageExist)?(
            <div className='personal-page'>
            <div className='mr-3 ml-3'>
                <div className='personal-head row'>
                    {
                        (previewFile)?
                        (
                            <Avatar className='ml-4' src={previewFile} size={100} style={{opacity:'0.6'}}></Avatar>
                        ):
                        (                            
                            <Avatar className='ml-4' src={avatar} size={100}></Avatar>
                        )
                    }
                    <div>
                        {
                            (changeUsernameState)?(
                                <div>
                                    <input type='text' value={changeUsernameText} onChange={e => setChangeUsernameText(e.target.value)} placeholder='Change username' style={{outline:'none', border:'none', backgroundColor:'transparent', fontWeight:'500px'}}></input>
                                    <FaRegSave onClick={renameAccount} className='clickable-icon-dark ml-2' size='22px' color='white'></FaRegSave>
                                    <AiOutlineClose onClick={() => setChangeUsernameState(false)} className='clickable-icon-dark ml-2' size='22px' color='white'></AiOutlineClose>
                                </div>
                            ):(
                                <div>
                                    {username}
                                    {
                                        (isYour)&&(
                                            <FaRegEdit onClick={changeUsernameHandle} className='clickable-icon-dark ml-2' size='22px' color='white'></FaRegEdit>
                                        )
                                    }                                    
                                </div>
                                )
                            }                        
                    </div>
                    {                        
                        (isYour)&&(
                            <div className='row'>
                                <AiFillCamera onClick={changeAvatarHandler} className='clickable-icon-dark mt-2' color='white' size='24px'></AiFillCamera>                               
                                <input id='change-avatar' type='file' name='image' accept="image/png, image/jpeg" onChange={_handleChange} style={{display:'none'}}></input>
                                {
                                    (previewFile) && (
                                        <div className='row' style={{padding:'2px'}}>
                                            <AiOutlineCheck className='text-primary clickable-icon-dark mt-2' onClick={uploadAvatar} color='white' size='20px'></AiOutlineCheck>
                                            <AiOutlineClose className='text-danger clickable-icon-dark ml-2 mt-2' onClick={cancelUploadAvatar} color='white' size='20px'></AiOutlineClose>                                
                                        </div> 
                                    )
                                }
                            </div>                      
                        )
                    }
                </div>                                
                <div className='row pt-4'>          
                    <div className={width < 768?'col-12':'col-4'}>
                        <div className='intro-zone'>
                            <div className='intro-header'>
                                Introduce
                            </div>                                                                   
                                <div>
                                    <div className='m-2' style={{fontSize:'16px'}}><FaUsers className='mr-1' color='gray' size='20px'/> Faculty: {(personalInfo)?personalInfo.faculty[0]:`Not set`}</div>
                                    <div className='m-2' style={{fontSize:'16px'}}><FaBirthdayCake className='mr-1' color='gray' size='20px'/> Birthday: {(personalInfo)?personalInfo.birth:`Not set`}</div>
                                    <div className='m-2' style={{fontSize:'16px'}}><FaTransgender className='mr-1' color='gray' size='20px'/> Gender: {(personalInfo)?personalInfo.gender:`Not set`}</div>
                                    <div className='m-2' style={{fontSize:'16px'}}><AiFillPhone className='mr-1' color='gray' size='20px'/> Phone: {(personalInfo)?personalInfo.phone:`Not set`}</div>
                                </div>                                                                                                   
                        </div>
                    </div>                                    
                    <div className={width < 768?'col-12':'col-8'}>
                        {
                            (isYour) && (
                                <StatusPost
                                    avatar={avatar}
                                    username={username}
                                    posted={newPostHandle}
                                    >
                                </StatusPost>
                            )
                        }
                        {
                            (loading)?(
                                <div style={{textAlign:'center'}}>
                                    <Space size="middle" style={{marginTop:'20px'}}>
                                        <Spin size="large" />
                                    </Space>
                                </div>
                            ):(
                            (newfeedData && newfeedData.length > 0)?(
                                newfeedData.map((value, index) => (                                       
                                    <StatusCard
                                        key={value._id}                                        
                                        avatar={value.user.avatar}
                                        current_avatar={userData?userData.avatar:''}
                                        username={value.user.user_name}
                                        date={value.date.split('T')[0]}
                                        textcontent={value.content}
                                        linkyoutube={value.linkyoutube}
                                        imgcontent= {value.image}                                                              
                                        likelist={value.likelist?value.likelist:[]} 
                                        commentlist={value.commentlist?value.commentlist:[]}                          
                                        user_id={userData?userData._id:''}
                                        user_post_id={value.user._id}
                                        post_id={value._id}    
                                        token={props.token}
                                        alertshow={()=> {
                                            alert.show('Deleted success!', {
                                                type:'success'
                                        })}}
                                        role={(userData.role) && userData.role}
                                        newcmt={(newcmt && newcmt.id_post === value._id)?newcmt:''}
                                    ></StatusCard>))
                            )
                        :(
                            <div className='empty-data'>
                                <div className='empty-text'>There are no data to show</div>
                            </div>
                        ))
                        }
                        {loadingNewfeed && hasMore && (
                            <div style={{textAlign:'center', margin:'30px'}} >
                            <Space size="middle">
                                <Spin />
                            </Space>
                        </div>
                        )}

                        {
                            !hasMore && (
                                <div className='empty-data'>
                                    <div className='empty-text'>There are no posts left</div>
                                </div>
                            )
                        }
                    </div>
                </div>                                                        
            </div>
        </div>
        ):(
            <Result
                className='mt-5'
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."                
            />
        )                       
        )            
}

function mapStateToProps(state) {
    return {
        token: state.token
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getToken: token => dispatch(getToken(token)),
        logOut: () => dispatch({type: 'LOGOUT'}),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalPage)