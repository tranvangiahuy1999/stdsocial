import React, {useState, useEffect} from 'react'
import UserCard from '../account-item.component'
import axios from 'axios'
import { useAlert } from 'react-alert'
import {Spin, Space} from 'antd'
import {connect} from 'react-redux'
import { useHistory } from 'react-router'
import { RiUserAddLine } from "react-icons/ri";

const AccManagerPage = (props) => {    
    const [accountList, setAccountList] = useState([])
    const [loading, setLoading] = useState(true)
    const history = useHistory()
    
    const alert = useAlert()

    useEffect(() => {
        getAccountList()
        window.scrollTo(0, 0)
    }, [])

    function getAccountList(){
        axios.get(`${process.env.REACT_APP_IP}/admin/user`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {            
            if(res.data.code===0){
                setAccountList(res.data.data)
            }
            setLoading(false)
        })
        .catch(e => {
            console.error(e)
            setLoading(false)        
        })        
    }  

    function searchHandle(e){
        const username = e.target.value
        
        if(username === ''){
            getAccountList()
            return
        }

        axios.get(`${process.env.REACT_APP_IP}/admin/search_user/${username}`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then( res => {            
            if(res.data.code === 0){
                setAccountList(res.data.data)
            }             
        })
        .catch(e => {
            console.error(e)            
        })
    }

    return(
        <div className='child-page'>
                <h5 className='child-header'>
                    ACCOUNT LIST
                </h5>
                <div className='child-body'>
                    <div>
                        <div className='row m-2'>
                            <div className='col-6 mt-auto mb-auto' style={{fontSize: '18px', color:'rgba(62,101,233,255)', fontWeight:'500'}}>
                                User Management
                            </div>
                            <div className='col-6' style={{textAlign:'right'}}>
                                <button className='m-1 p-1 direct-btn' onClick={() => history.push(`/home/createaccount`)} style={{ borderRadius:'25px', fontSize: '16px', position:'relative'}}><RiUserAddLine size='18px'></RiUserAddLine> Add user</button>
                            </div>
                        </div>                                                                                      
                        <input className='ml-2 form-control' style={{borderRadius:'4px', border:'1px solid gray', outline:'none', padding: '16px'}} placeholder="Find by username" onChange={searchHandle}></input>                                                                            
                        <div className='acc-manager-body mt-3'>
                            {
                            (loading)?(
                                <div style={{textAlign:'center'}}>
                                    <Space size="middle">
                                        <Spin size="large" />
                                    </Space>
                                </div>
                            ):(
                                (accountList && accountList.length > 0)?(
                                    accountList.map((value, index) => (
                                        <div>
                                            <UserCard
                                                key={value._id}
                                                avatar={value.avatar}
                                                user_id={value._id}
                                                user={value.user}
                                                user_name={value.user_name}
                                                deleted={value.deleted}
                                                backgroundColor={index%2===0?'rgba(173,192,234,255)':'rgba(163,208,231,255)'}
                                                color={index%2===0?'rgba(173,192,234,255)':'rgba(163,208,231,255)'} >                                                
                                            </UserCard>
                                        </div>                                        
                                    ))
                                ):(
                                    <div className='empty-data'>
                                        <div className='empty-text'>
                                            There is no user
                                        </div>
                                    </div>
                                    )
                                )
                            } 
                        </div>
                    </div>
                </div>
            </div>
    )
}

function mapStateToProps(state){
    return{
        token: state.token
    }
}

function mapDispatchToProps(dispatch) {
    return {        
        logOut: () => dispatch({type: 'LOGOUT'}),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccManagerPage)