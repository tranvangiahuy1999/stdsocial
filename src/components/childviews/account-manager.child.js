import React, {useState, useEffect} from 'react'
import AccRow from '../account-row.component'
import axios from 'axios'
import { useAlert } from 'react-alert'
import {Spin, Space} from 'antd'
import {connect} from 'react-redux'


const AccManagerPage = (props) => {
    const [searchInput, setSearchInput] = useState('')
    const [accountList, setAccountList] = useState()
    const [loading, setLoading] = useState(true)
    
    const alert = useAlert()

    useEffect(() => {
        getAccountList()
    }, [])

    function getAccountList(){
        axios.get(`https://${process.env.REACT_APP_IP}/admin/user`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {
            if(res.data.code===0){
                setAccountList(res.data.data)
            }                
        })
        .catch(e => console.error(e))
        setLoading(false)
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
                            <input className='ml-2' style={{borderRadius:'4px', border:'1px solid gray', outline:'none'}} value={searchInput} onChange={e => setSearchInput(e.target.value)}></input>                            
                        </div>
                        {props.link}
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
                                <Space size="middle" style={{marginTop:'100px'}}>
                                    <Spin size="large" />
                                </Space>
                            </div>
                        ):(
                            (accountList && accountList.length > 0)?(
                                accountList.map((value, index) => (
                                    <AccRow key={value._id} acc_id={value._id} user={value.user} user_name={value.user_name} faculty={value.faculty.length}></AccRow>
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

export default connect(mapStateToProps)(AccManagerPage)