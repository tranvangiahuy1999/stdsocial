import React, {useState, useEffect} from 'react'
import {
    BrowserRouter as Router,    
    useHistory,
} from 'react-router-dom'

import { Pagination, Spin, Space, DatePicker, Select } from 'antd';
import NotiCard from '../notificatecard.component'
import "react-datepicker/dist/react-datepicker.css";
import { RiDeleteBin6Line, RiSendPlaneFill } from "react-icons/ri";
import axios from 'axios'
import {connect} from 'react-redux'
import {useAlert} from 'react-alert'

const { Option } = Select;
const { RangePicker } = DatePicker;

const NotiPage = (props) => {
    const [notiData, setNotiData] = useState()
    const [searchNotiTitle, setSearchNotiTitle] = useState('')

    const [searchFalcuty, setSearchFalcuty] = useState('All')
    const [falcuty, setFalcuty] = useState()

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('')
    const [findData, setFindData] = useState({title: '', faculty: '', date: ''})    

    const [sendBtnState, setSendBtnState] = useState(false)

    const [currentSearchPage, setCurrentSearchPage] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)        
        
    const [loading, setLoading] = useState(true)    
    
    let history = useHistory()
    const alert = useAlert()

    useEffect(() => {        
        getRole()        
        getPage(currentPage)
    },[])

    function onDateChange(value, dateString) {        
        setStartDate(dateString[0])
        setEndDate(dateString[1])
    }

    function onSelectChange(value) {
        setSearchFalcuty(value)        
    }

    async function getPage(page){        
        setCurrentPage(page)

        setLoading(true)
        await axios.get(`${process.env.REACT_APP_IP}/notification/page/${page}`,{
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {               
            setLoading(false)       
            setNotiData(res.data.data)
            setSendBtnState(false)                            
            setTotalPage(res.data.total)                                 
        })        
        .catch( e => {
            console.error(e)
            setLoading(false)
            setSendBtnState(false)
        })        
    }

    async function pagingHandle(page) {        
        if(page >= 1 && page <= totalPage){
            if(findData.title.length > 0 || findData.faculty.length > 0 || findData.date.length > 0){
                await submitFilter(page)
                return
            }
            await getPage(page)
            return
        }
    }

    async function submitFilter(page){
        let faculty = ''     
        if(searchFalcuty === 'All'){
            faculty = ''
        } else {
            faculty = searchFalcuty
        }
        setSendBtnState(true)

        setFindData({title: searchNotiTitle, faculty: faculty, date: startDate})
        setCurrentSearchPage(page)        
        
        let api = `${process.env.REACT_APP_IP}/notification/dateSort/${startDate}/${endDate}/${page}`

        if(searchNotiTitle.length > 0 || faculty.length > 0 || startDate.length > 0){
            if(searchNotiTitle.length > 0 && faculty.length > 0 && startDate.length > 0){
                api = `${process.env.REACT_APP_IP}/notification/search/${searchNotiTitle}/${faculty}/${startDate}/${endDate}/${page}`
            }
            else if(searchNotiTitle.length > 0) {
                if(faculty.length > 0 ){
                    api = `${process.env.REACT_APP_IP}/notification/search/${searchNotiTitle}/${faculty}/${page}`                    
                } else if(startDate.length > 0){
                    api = `${process.env.REACT_APP_IP}/notification/title-date/${searchNotiTitle}/${startDate}/${endDate}/${page}`                   
                } else {
                    api = `${process.env.REACT_APP_IP}/notification/search/${searchNotiTitle}/${page}`                                        }
                }
                else if(faculty.length > 0){
                    if(startDate.length > 0){
                        api = `${process.env.REACT_APP_IP}/notification/role-date/${faculty}/${startDate}/${endDate}/${page}`                    
                    } else {
                        api = `${process.env.REACT_APP_IP}/notification/faculty/${faculty}/${page}`                    
                    }
                }            
            } else {
                getPage(1)
                return
            }

            setLoading(true)

            axios.get(api ,{
                headers:{
                    'Authorization' : 'Bearer ' + props.token
                }
            })
            .then(res =>{                
                if(res.data.code === 0){
                    setNotiData(res.data.data)
                    if(res.data.total) {    
                        setTotalPage(res.data.total)         
                    }                   

                } else {           
                    alert.show(res.data.message, {
                        type: 'error'
                    })                                   
                }
                setLoading(false)
                setSendBtnState(false)               
            })
            .catch( e => {
                console.error(e)
                setLoading(false)
                setSendBtnState(false)              
            })        
    }    

    function cleanAll() {        
        setSearchNotiTitle('')
        setSearchFalcuty('All')
        setStartDate('')        
    }    

    async function getRole(){
        await axios.get(`${process.env.REACT_APP_IP}/role`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {            
            if(res.data.code === 0){
                let array = ['All']
                res.data.data.map((value) => {array.push(value.nameRole)})                
                setFalcuty(array)
            } else {
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
        <Router>
            <div className='child-page'>
                <h5 className='child-header'>
                    NOTIFICATIONS
                </h5>               
                        <div className='child-body'>
                            <div>
                                <form>
                                    <div>
                                        <div className="form-group col-12">                                
                                            <input className='form-control' style={{padding: '4px', width:'100%'}} placeholder='Search by title' value={searchNotiTitle} onChange={v => setSearchNotiTitle(v.target.value)} ></input>    
                                        </div>                                     
                                    </div>
                                    <div className='row col-12'>
                                        <div className="form-group col-4">
                                            <RangePicker                                                                                         
                                                format="YYYY-MM-DD"
                                                onChange={onDateChange}                                            
                                                />                                            
                                        </div>
                                        <div className="form-check col-4"> 
                                            <Select
                                                    showSearch                                                
                                                    style={{ width: '100%' }}
                                                    defaultValue="All"
                                                    placeholder="Select a faculty"
                                                    optionFilterProp="children"
                                                    onChange={onSelectChange}
                                                    value={searchFalcuty}                                              
                                                    filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    {
                                                        (falcuty && falcuty.length > 0) && (
                                                            falcuty.map((value, index) => (
                                                                <Option key={index} value={value}>{value}</Option>
                                                            ))
                                                        )
                                                    }                                             
                                            </Select>                                                                 
                                        </div>                        
                                        <div className="col-4 p-0">
                                            <div style={{textAlign:'right'}}>
                                                <button type='button' className='btn btn-danger' onClick={cleanAll}><RiDeleteBin6Line size='16px' color='white'></RiDeleteBin6Line></button>
                                                <button disabled={sendBtnState} type='button' className='btn btn-primary ml-2' onClick={() => submitFilter(1)}><RiSendPlaneFill size='16px' color='white'></RiSendPlaneFill></button>
                                            </div>
                                        </div>                                         
                                    </div>
                                </form>
                            <div className='noti-list mt-2'>
                                {   (loading)?(
                                    <div style={{textAlign:'center', margin:'30px'}}>
                                        <Space size="middle">
                                            <Spin size="large" />
                                        </Space>
                                    </div>
                                ):(
                                    (notiData && notiData.length > 0)?
                                        notiData.map((value, index) => (
                                            <NotiCard
                                                key={value._id}                             
                                                borderStyle={index%2===0?'5px solid rgba(150,204,108,255)':'5px solid rgba(118,201,190,255)'}
                                                textStyle={index%2===0?'rgba(150,204,108,255)':'rgba(118,201,190,255)'}                                                
                                                falcutyname={value.role}
                                                date={value.date.split('T')[0]}
                                                title={value.title}
                                                subtitle={value.description}
                                                content = {value.content}
                                                noti_id= {value._id}
                                                seedetail = {() => history.push(`/home/notification/${value._id}`)}
                                                >
                                            </NotiCard>))
                                        : (
                                            <div className='empty-data'>
                                                <div className='empty-text'>No content to show</div>
                                            </div>
                                        )                            
                                    )
                                }                                    
                            </div>
                            <div>
                                <div className='paging mt-4' style={{width:'max-content'}}>
                                    {
                                        (findData.title.length > 0 || findData.faculty.length > 0 || findData.date.length > 0)?(
                                            <Pagination defaultCurrent={1} current={currentSearchPage} total={parseInt(totalPage*10)} onChange={(page, pageSize) => {pagingHandle(page)}}/>                                  
                                        ):(
                                            <Pagination defaultCurrent={1} current={currentPage} total={parseInt(totalPage*10)} onChange={(page, pageSize) => {pagingHandle(page)}}/>                                  
                                        )
                                    }
                                </div>                                
                            </div>
                        </div>
                        </div>                             
            </div>
        </Router>
    )
}

function mapStateToProps(state) {
    return {
        token: state.token
    }
}

function mapDispatchToProps(dispatch) {
    return {        
        logOut: () => dispatch({type: 'LOGOUT'}),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotiPage)