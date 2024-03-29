import React, { useState, useEffect } from 'react'
import axiosInstance from '../../api/service';
import { Avatar, Result, Skeleton } from 'antd';
import StatusPost from '../statuspost.component'
import StatusCard from '../statuscard.component'
import useWindowDimensions from '../useWindowDimensions'
import { useAlert } from 'react-alert';
import { useParams } from 'react-router-dom';
import { io } from "socket.io-client";

import { FaRegEdit, FaRegSave } from "react-icons/fa";
import { AiFillCamera, AiOutlineCheck, AiOutlineClose, AiOutlineUser } from "react-icons/ai";
import { BiCake, BiPhone } from "react-icons/bi";
import { IoTransgenderSharp } from "react-icons/io5";
import { BASE_URL } from '../../constants';

const PersonalPage = () => {
    const [newfeedData, setNewfeedData] = useState([])
    const [avatar, setAvatar] = useState('')
    const [username, setUsername] = useState('')
    const [fileInput, setFileInput] = useState(null)
    const [previewFile, setPreviewFile] = useState(null)
    const [changeUsernameText, setChangeUsernameText] = useState('')
    const [changeUsernameState, setChangeUsernameState] = useState(false)
    const [personalInfo, setPersonalInfo] = useState()
    const [isYour, setIsYour] = useState(false)
    const [loading, setLoading] = useState(true)
    const [newcmt, setNewCmt] = useState()
    const [newlike, setNewLike] = useState()
    const [userPageExist, setUserPageExist] = useState(true)
    const [loadingNewfeed, setLoadingNewfeed] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const alert = useAlert()
    let count = 1, previousCount = 0;
    let { id } = useParams()
    const { width } = useWindowDimensions();
    const [falcutyData, setFalcutyData] = useState(null)
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        window.scrollTo(0, 0);
        previousCount = 0;
        count = 1;
        getUserInformation();
        getPersonalNewfeed(count);
        getRole()
        window.addEventListener('scroll', debounce(handleInfiniteOnLoad, 2000));
        return () => window.removeEventListener('scroll', debounce(handleInfiniteOnLoad, 2000));
    }, [id])

    useEffect(() => {
        if (personalInfo) {
            getCurrentUserData();
        }
    }, [personalInfo])

    useEffect(() => {
        const socket = io.connect(`${BASE_URL}`, { transports: ["websocket"], withCredentials: true });
        socket.on('new_comment', (data) => {
            newCommentHandler(data)
        })
        socket.on('new_likelist', (data) => {
            newLikeHandler(data)
        })
        return () => {
            socket.off("new_comment");
            socket.off('new_likelist');
        }
    }, []);

    function getCurrentUserData() {
        axiosInstance.get(`/account/current`)
            .then(res => {
                if (res.data.code === 0) {
                    setIsYour(res.data.data._id === personalInfo._id);
                }
            })
            .catch(e => {
                console.error(e)
            })
    }

    const debounce = (func, delay) => {
        let inDebounce;
        return function () {
            clearTimeout(inDebounce);
            inDebounce = setTimeout(() => {
                func.apply(this, arguments);
            }, delay);
        }
    }

    function handleInfiniteOnLoad() {
        if (document.documentElement.scrollTop + window.innerHeight + 1 >= document.documentElement.scrollHeight) {
            setLoadingNewfeed(true)
            getPersonalNewfeed(count)
        }
    }

    function newCommentHandler(data) {
        setNewCmt(data.data)
    }

    function newLikeHandler(data) {
        setNewLike(data.data)
    }

    function getUserInformation() {
        axiosInstance.get(`/account/user/${id}`)
            .then(res => {
                if (res.data.code === 0) {
                    setPersonalInfo(res.data.data)
                    setAvatar(res.data.data.avatar)
                    setUsername(res.data.data.user_name)
                } else {
                    setUserPageExist(false)
                }

            })
            .catch(e => {
                console.error(e)
            })
    }

    function getRole() {
        axiosInstance.get(`/role`)
            .then(res => {
                if (res.data.code === 0) {
                    setFalcutyData(res.data.data)
                }
            })
    }

    async function getPersonalNewfeed(page) {
        if (previousCount !== count) {
            axiosInstance.get(`/newfeed/yourfeed/${id}/${page}`)
                .then((res) => {
                    let fetchNewfeedData = [];
                    if (count > 1) {
                        fetchNewfeedData = newfeedData;
                    }
                    if (res.data.code === 0) {
                        fetchNewfeedData = fetchNewfeedData.concat(res.data.data);
                    }
                    else {
                        setHasMore(false);
                    }
                    setNewfeedData(fetchNewfeedData);
                    setLoading(false);
                    setLoadingNewfeed(false)
                    previousCount = count;
                    count += 1
                })
                .catch(e => {
                    console.error(e)
                })
        }
    }

    function changeAvatarHandler() {
        setChangeUsernameState(false)
        const input = document.getElementById('change-avatar')
        if (input) {
            input.click()
        }
    }

    function _handleChange(e) {
        const file = e.target.files[0]
        setFileInput(file)
        _previewFile(file)
    }

    function _previewFile(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setPreviewFile(reader.result)
        }
    }

    function cancelUploadAvatar() {
        setFileInput('')
        setPreviewFile(null)
    }

    async function uploadAvatar() {
        var formData = new FormData();
        if (fileInput) {
            await formData.append("image", fileInput);

            axiosInstance.put(`/account/update/avatar`, formData)
                .then(res => {
                    if (res.data.code === 0) {
                        alert.show('Avatar changed', {
                            type: 'success'
                        })
                        sessionStorage.setItem("token", res.data.token)
                        getUserInformation()
                        getPersonalNewfeed(count)
                        setFileInput('')
                        setPreviewFile(null)
                    } else {
                        alert.show(res.data.message, {
                            type: 'error'
                        })
                    }
                })
                .catch(e => {
                    console.error(e)
                })
        }
        else {
            alert.show(`Image hasn't uploaded`, {
                type: 'error'
            })
        }
    }

    function newPostHandle(post) {
        setNewfeedData([post].concat(newfeedData))
    }

    function changeUsernameHandle() {
        setChangeUsernameText(personalInfo ? personalInfo.user_name : '')
        setPreviewFile(null)
        setFileInput(null)
        setChangeUsernameState(true)
    }

    function renameAccount() {
        if (changeUsernameText.length < 1) {
            alert.show('Empty input', {
                type: 'error'
            })
            return
        }

        const body = {
            rename: changeUsernameText
        }

        axiosInstance.put(`/account/rename`, body)
            .then(res => {
                if (res.data.code === 0) {
                    alert.show('Username changed', {
                        type: 'success'
                    })
                    sessionStorage.setItem("token", res.data.token);
                    getUserInformation()
                    getPersonalNewfeed(count)
                    setChangeUsernameState(false)
                }
                else {
                    alert.show(res.data.message, {
                        type: 'error'
                    })
                }
            })
            .catch(e => {
                console.error(e)
            })
    }

    return (
        (userPageExist) ? (
            <div className='personal-page'>
                <div className='mr-3 ml-3'>
                    <div className='personal-head row'>
                        {
                            (previewFile) ?
                                (
                                    <Avatar className='ml-4' src={previewFile} size={100} style={{ opacity: '0.6' }}></Avatar>
                                ) :
                                (
                                    <Avatar className='ml-4' src={avatar} size={100}></Avatar>
                                )
                        }
                        <div>
                            {
                                (changeUsernameState) ? (
                                    <div>
                                        <input type='text' value={changeUsernameText} onChange={e => setChangeUsernameText(e.target.value)} placeholder='Change username' style={{ outline: 'none', border: 'none', backgroundColor: 'transparent', fontWeight: '500px' }}></input>
                                        <FaRegSave onClick={renameAccount} className='clickable-icon-dark ml-2 text-primary' size='22px'></FaRegSave>
                                        <AiOutlineClose onClick={() => setChangeUsernameState(false)} className='clickable-icon-dark ml-2 text-danger' size='22px'></AiOutlineClose>
                                    </div>
                                ) : (
                                    <div>
                                        {username}
                                        {
                                            (isYour) && (
                                                <FaRegEdit onClick={changeUsernameHandle} className='clickable-icon-dark ml-2' size='22px' color='white'></FaRegEdit>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>
                        {
                            (isYour) && (
                                <div className='row'>
                                    <AiFillCamera onClick={changeAvatarHandler} className='clickable-icon-dark mt-2' color='white' size='24px'></AiFillCamera>
                                    <input id='change-avatar' type='file' name='image' accept="image/png, image/jpeg" onChange={_handleChange} style={{ display: 'none' }}></input>
                                    {
                                        (previewFile) && (
                                            <div className='row' style={{ padding: '2px' }}>
                                                <AiOutlineCheck className='clickable-icon-dark mt-2 text-primary' onClick={uploadAvatar} size='20px'></AiOutlineCheck>
                                                <AiOutlineClose className='clickable-icon-dark ml-2 mt-2 text-danger' onClick={cancelUploadAvatar} size='20px'></AiOutlineClose>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                    <div className='row pt-4'>
                        <div className={width < 768 ? 'col-12' : 'col-4'}>
                            <div className='intro-zone'>
                                <div className='component-title'>
                                    Introduce
                                </div>
                                <div>
                                    <div className='m-2 row' style={{ fontSize: '16px' }}>
                                        <AiOutlineUser className='mr-2' color='orange' size='34px' style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                                        <div>
                                            <div>Faculty</div>
                                            <div>
                                                <div style={{ color: 'gray', fontWeight: '500' }}>{!!personalInfo?.faculty.length ? falcutyData?.find(falcuty => falcuty?._id === personalInfo.faculty[0])?.nameRole : "Note set"}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='m-2 row' style={{ fontSize: '16px' }}>
                                        <BiCake className='mr-2' color='orange' size='34px' style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                                        <div>
                                            <div>Birthday</div>
                                            <div>
                                                <div style={{ color: 'gray', fontWeight: '500' }}>{personalInfo?.birth || `Not set`}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='m-2 row' style={{ fontSize: '16px' }}>
                                        <IoTransgenderSharp className='mr-2' color='orange' size='34px' style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                                        <div>
                                            <div>Gender</div>
                                            <div>
                                                <div style={{ color: 'gray', fontWeight: '500' }}>{personalInfo?.gender || `Not set`}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='m-2 row' style={{ fontSize: '16px' }}>
                                        <BiPhone className='mr-2' color='orange' size='34px' style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                                        <div>
                                            <div>Phone</div>
                                            <div>
                                                <div style={{ color: 'gray', fontWeight: '500' }}>{personalInfo?.phone || `Not set`}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={width < 768 ? 'col-12 p-0' : 'col-8 p-0'}>
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
                                (loading) ? (
                                    <div >
                                        <Skeleton avatar active paragraph={4}></Skeleton>
                                        <Skeleton avatar active paragraph={4}></Skeleton>
                                        <Skeleton avatar active paragraph={4}></Skeleton>
                                        <Skeleton avatar active paragraph={4}></Skeleton>
                                    </div>
                                ) : (
                                    (newfeedData && newfeedData.length > 0) ? (
                                        newfeedData.map((value, index) => (
                                            <StatusCard
                                                key={value?._id}
                                                // current_avatar={userData?.avatar || ''}
                                                // user_id={userData?._id || ''}
                                                // role={userData?.role || ""}
                                                avatar={value?.user.avatar}
                                                username={value?.user.user_name}
                                                date={value?.date.split('T')[0]}
                                                textcontent={value?.content}
                                                linkyoutube={value?.linkyoutube}
                                                imgcontent={value?.image}
                                                likelist={value?.likelist || []}
                                                commentlist={value?.commentlist || []}
                                                
                                                user_post_id={value?.user._id}
                                                post_id={value?._id}
                                                token={token}
                                                alertshow={() => {
                                                    alert.show('Deleted success!', {
                                                        type: 'success'
                                                    })
                                                }}
                                                newcmt={newcmt?.id_post === value?._id ? newcmt : ''}
                                                newlike={newlike?.like_post === value?._id ? newlike : ''}
                                            ></StatusCard>))
                                    )
                                        : (
                                            <div className='empty-data'>
                                                <div className='empty-text'>There are no data to show</div>
                                            </div>
                                        ))
                            }
                            {(loadingNewfeed && hasMore) ? (
                                <div className='mt-4'>
                                    <Skeleton avatar paragraph={{ rows: 3 }} active />
                                </div>
                            ) : (
                                <div style={{ height: '100px' }}>
                                    {
                                        (!hasMore) && (
                                            <div className='empty-data'>
                                                <div className='empty-text'>There are no posts left</div>
                                            </div>
                                        )
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <Result
                className='mt-5'
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
            />
        )
    )
}

export default PersonalPage