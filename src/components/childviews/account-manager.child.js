import React, {useState, useEffect} from 'react'
import AccRow from '../account-row.component'
import axios from 'axios'
import { useAlert } from 'react-alert'
import {Spin, Space} from 'antd'
import {connect} from 'react-redux'
import { useHistory } from 'react-router'


const AccManagerPage = (props) => {    
    const [accountList, setAccountList] = useState([])
    const [loading, setLoading] = useState(true)
    const history = useHistory()
    
    const alert = useAlert()

    useEffect(() => {
        getAccountList()
    }, [])

    function getAccountList(){
        axios.get(`${process.env.REACT_APP_IP}/admin/user`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {
            console.log(res)
            if(res.data.code===0){
                setAccountList(res.data.data)
            }
        })
        .catch(e => {
            console.error(e)            
        })
        setLoading(false)
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
                    <div className='col-12' >                                      
                        <div className='row acc-filter p-2'>
                            <label>Find by user:</label>
                            <input className='ml-2' style={{borderRadius:'4px', border:'1px solid gray', outline:'none'}} onChange={searchHandle}></input>                            
                        </div>
                        <div style={{paddingTop: '6px', paddingBottom:'6px'}} >Can't find one? <span className='reading-link' onClick={() => history.push(`/home/createaccount`)}>Create here</span>.</div>
                        <div className='row acc-manager-head'>
                            <div className='table-text col-3'>
                                User
                            </div> 
                            <div className='table-text col-3'>
                                Username
                            </div>
                            <div className='table-text col-3'>
                                Faculty count
                            </div>
                            <div className='table-text col-3'>
                                Actions
                            </div>
                        </div>
                        <div className='acc-manager-body'>
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
                                    <AccRow key={value._id} user_id={value._id} acc_id={value._id} user={value.user} user_name={value.user_name} faculty={value.faculty.length} deleted={value.deleted}></AccRow>
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