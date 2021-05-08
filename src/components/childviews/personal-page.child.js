import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Avatar, Space, Spin } from 'antd';
import {connect} from 'react-redux';
import StatusPost from '../statuspost.component'
import StatusCard from '../statuscard.component'
import useWindowDimensions from '../useWindowDimensions'
import { FaRegEdit, FaRegSave, FaBirthdayCake, FaUsers, FaTransgender } from "react-icons/fa";
import {getToken} from '../../actions/index'
import { AiFillCamera, AiOutlineCheck,  AiOutlineClose, AiFillPhone} from "react-icons/ai";
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router';

const PersonalPage = (props) => {
    const [userData, setUserData] = useState()    
    const [newfeedData, setNewfeedData] = useState([])
    const [fileInput, setFileInput] = useState('')
    const [previewFile, setPreviewFile] = useState(null)
    const [changeUsernameText, setChangeUsernameText] = useState('')
    const [changeUsernameState, setChangeUsernameState] = useState(false)
    const [personalInfo, setPersonalInfo] = useState() 

    const [loading, setLoading] = useState(true)
    const history = useHistory()
    const alert = useAlert()
    const [page, setPage] = useState(1)

    const {width, height} = useWindowDimensions()

    useEffect(() => {
        getCurrentUserData()        
    }, [])

    useEffect(() => {
        getPersonalNewfeed(1)
        if(userData && userData.role === 'student' ){
            getUserInformation()
        }
    }, [userData])

    function getUserInformation(){        
            axios.get(`https://${process.env.REACT_APP_IP}/account/user/${userData.id}`, {
                headers: {
                    'Authorization' : 'Bearer ' + props.token
                }
            })
            .then(res => {   
                console.log(res)             
                if(res.data.code===0){
                    setPersonalInfo(res.data.data)
                }
            })
            .catch(async e => {
                console.error(e)
                if(e.response.status===401){
                    await props.logOut()
                    history.push('/login')
                }
            })
    }

    function getCurrentUserData(){
        axios.get(`https://${process.env.REACT_APP_IP}/account/current`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {                         
            if(res.data.code === 0){
                setUserData(res.data.data)
            }
        })
        .catch(async e => {
            console.error(e)
            if(e.response.status===401){
                await props.logOut()
                history.push('/login')
            }
        })
    }

    async function getPersonalNewfeed(page){
        if(await userData){
            axios.get(`https://${process.env.REACT_APP_IP}/newfeed/yourfeed/${userData.id}/${page}`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
            })
            .then((res) => {                            
                if(res.data.code===0){                    
                    setNewfeedData(res.data.data)
                }
            })
            .catch(async e => {
                console.error(e)
                if(e.response.status===401){
                    await props.logOut()
                    history.push('/login')
                }
            })
            setLoading(false)
        }
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

            axios.put(`https://${process.env.REACT_APP_IP}/account/update/avatar`, formData, {
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
            .catch(async e => {
                console.error(e)
                if(e.response.status===401){
                    await props.logOut()
                    history.push('/login')
                }
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
        setChangeUsernameText(userData?userData.user_name:'')
        setChangeUsernameState(true)
    }

    function renameAccount(){
        if(changeUsernameText.length < 1){
            alert.show('Empty input', {
                type: 'error'
            })
            return
        }

        axios.put(`https://${process.env.REACT_APP_IP}/account/rename`, {
            rename: changeUsernameText
        }, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {
            console.log(res)
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
        .catch(async e => {
            console.error(e)
            if(e.response.status===401){
                await props.logOut()
                history.push('/login')
            }
        })
    }

    return(
        (loading)?(
            <div style={{textAlign:'center'}}>
                <Space size="middle" style={{marginTop:'100px'}}>
                    <Spin size="large" />
                </Space>
            </div>
        ):(
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
                    <AiFillCamera onClick={changeAvatarHandler} className='bg-dark' color='white' size='22px' style={{borderRadius:'50%', marginLeft:'-10px', zIndex:'1'}}></AiFillCamera>
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
                                    {userData?userData.user_name:''}
                                    <FaRegEdit onClick={changeUsernameHandle} className='clickable-icon-dark ml-2' size='22px' color='white'></FaRegEdit>                                    
                                </div>
                            )
                        }                        
                    </div>
                    <input id='change-avatar' type='file' name='image' accept="image/png, image/jpeg" onChange={_handleChange} style={{display:'none'}}></input>
                    {
                        (previewFile) && (
                            <div className='row' style={{padding:'2px'}}>
                                <AiOutlineCheck className='text-primary clickable-icon-dark' onClick={uploadAvatar} color='white' size='20px'></AiOutlineCheck>
                                <AiOutlineClose className='text-danger clickable-icon-dark ml-2' onClick={cancelUploadAvatar} color='white' size='20px'></AiOutlineClose>                                
                            </div> 
                        )
                    }
                </div>
                <div className='row pt-4'>
                {
                        (userData && userData.role !== 'student')?(
                            <></>
                        ):(
                            <div className={width < 768?'col-12':'col-4'}>
                                <div className='intro-zone'>
                                    <div className='intro-header'>Introduce</div>
                                    {
                                        (personalInfo)?(
                                            <div>
                                                <div className='m-2' style={{fontSize:'16px'}}><FaUsers className='mr-1' color='gray' size='20px'/> Faculty: {(personalInfo.faculty[0].length>0)?personalInfo.faculty[0]:`Not set`}</div>
                                                <div className='m-2' style={{fontSize:'16px'}}><FaBirthdayCake className='mr-1' color='gray' size='20px'/> Birthday: {(personalInfo.birth.length>0)?personalInfo.birth:`Not set`}</div>
                                                <div className='m-2' style={{fontSize:'16px'}}><FaTransgender className='mr-1' color='gray' size='20px'/> Gender: {(personalInfo.gender.length>0)?personalInfo.gender:`Not set`}</div>
                                                <div className='m-2' style={{fontSize:'16px'}}><AiFillPhone className='mr-1' color='gray' size='20px'/> Phone: {(personalInfo.phone.length>0)?personalInfo.phone:`Not set`}</div>
                                            </div>
                                        ):(
                                            <div className='empty-data'>
                                                <div className='empty-text'>Don't have any data</div>
                                            </div>
                                        )
                                    }                                    
                                </div>
                            </div>
                        )
                    }                  
                    <div className={(width < 768 || (userData && userData.role !== 'student'))?'col-12':'col-8'}>
                        <StatusPost
                            avatar={userData?userData.avatar:''}
                            username={userData?userData.user_name:''}
                            posted={newPostHandle}
                            >
                        </StatusPost>
                        {
                            (newfeedData && newfeedData.length > 0)?(
                                newfeedData.map((value, index) => (                                       
                                    <StatusCard
                                        key={value._id}
                                        avatar={value.user.avatar?value.user.avatar:''}
                                        current_avatar={userData?userData.avatar:''}
                                        username={value.user.user_name}
                                        date={value.date.split('T')[0]}
                                        textcontent={value.content}
                                        linkyoutube={value.linkyoutube}
                                        imgcontent= {value.image}
                                        likecount={value.likecount}
                                        commentcount={value.commentcount}                            
                                        likelist={value.likelist?value.likelist:[]} 
                                        commentlist={value.commentlist?value.commentlist:[]}                          
                                        user_id={userData?userData.id:''}
                                        user_post_id={value.user._id}
                                        post_id={value._id}             
                                        token={props.token}
                                        alertshow={()=> {
                                            alert.show('Deleted success!', {
                                                type:'success'
                                        })}}
                                        role={(userData) && userData.role}
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