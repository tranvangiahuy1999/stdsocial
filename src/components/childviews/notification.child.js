import React, {useState, useEffect} from 'react'
import {
    BrowserRouter as Router,
    useRouteMatch,
    useHistory,
} from 'react-router-dom'

import { Pagination, Spin, Space } from 'antd';
// import NotiReader from './notification-reader.child'
import DatePicker from "react-datepicker";
import NotiCard from '../notificatecard.component'
import "react-datepicker/dist/react-datepicker.css";
import { RiDeleteBin6Line, RiSendPlaneFill } from "react-icons/ri";
import axios from 'axios'
import Dropdown from 'react-dropdown';
import {connect} from 'react-redux'
import {useAlert} from 'react-alert'

const NotiPage = (props) => {
    const [notiData, setNotiData] = useState()
    const [searchNotiTitle, setSearchNotiTitle] = useState('')
    const [searchFalcuty, setSearchFalcuty] = useState('')
    const [startDate, setStartDate] = useState('');
    const [findData, setFindData] = useState({title: '', faculty: '', date: ''})
    const [falcuty, setFalcuty] = useState([])

    const [sendBtnState, setSendBtnState] = useState(false)

    const [currentSearchPage, setCurrentSearchPage] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)        
    
    const [selectedOption, setSelectedOption] = useState({value: "All", label: "All"})
    const [loading, setLoading] = useState(true)    

    let {path, url} = useRouteMatch()
    let history = useHistory()
    const alert = useAlert()

    useEffect(() => {        
        getRole()        
        getPage(1)
    },[])

    function dateConvert() {
        let output = ''

        if(startDate){          
            const month = String(startDate.getMonth() + 1).padStart(2, '0');
            const day = String(startDate.getDate()).padStart(2, '0');
            const year = startDate.getFullYear();
            output = year + '-' + month  + '-' + day;
        }        

        return output
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
            console.log(res)
            setLoading(false)       
            setNotiData(res.data.data)
            if(res.data.total) {    
                setTotalPage(res.data.total)         
            }                     
        })        
        .catch( e => {
            console.error(e)            
        })
        setLoading(false)
        setSendBtnState(false)
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
        let option = selectedOption.value;
        if(selectedOption && selectedOption.value !== 'All'){
            await setSearchFalcuty(selectedOption.value)
        } else {
            await setSearchFalcuty('')
            option = ''
        }

        setSendBtnState(true)

        const date = await dateConvert()        

        await setFindData({title: searchNotiTitle, faculty: option, date: date})
        await setCurrentSearchPage(page)        
        
        let api = `${process.env.REACT_APP_IP}/notification/dateSort/${date}/${date}/${page}`

        if(searchNotiTitle.length > 0 || option.length > 0 || date.length > 0){
            if(searchNotiTitle.length > 0 && option.length > 0 && date.length > 0){
                api = `${process.env.REACT_APP_IP}/notification/search/${searchNotiTitle}/${option}/${date}/${date}/${page}`
            }
            else if(searchNotiTitle.length > 0) {
                if(option.length > 0 ){
                    api = `${process.env.REACT_APP_IP}/notification/search/${searchNotiTitle}/${option}/${page}`                    
                } else if(date.length > 0){
                    api = `${process.env.REACT_APP_IP}/notification/title-date/${searchNotiTitle}/${date}/${date}/${page}`                   
                } else {
                    api = `${process.env.REACT_APP_IP}/notification/search/${searchNotiTitle}/${page}`                                        }
                }
                else if(option.length > 0){
                    if(date.length > 0){
                        api = `${process.env.REACT_APP_IP}/notification/role-date/${option}/${date}/${date}/${page}`                    
                    } else {
                        api = `${process.env.REACT_APP_IP}/notification/faculty/${option}/${page}`                    
                    }
                }            
            } else {
                getPage(1)
                return
            }

            setLoading(true)

            await axios.get(api ,{
                headers:{
                    'Authorization' : 'Bearer ' + props.token
                }
            })
            .then(async res =>{
                console.log(res)
                if(res.data.code === 0){
                    await setNotiData(res.data.data)
                    if(res.data.total) {    
                        await setTotalPage(res.data.total)         
                    }                   

                } else {           
                    alert.show(res.data.message, {
                        type: 'error'
                    })                                   
                }                
            })
            .catch( e => {
                console.error(e)                
            })
        setLoading(false)
        setSendBtnState(false)
    }

    function handleChange(selectedOption) {        
        setSelectedOption(selectedOption)
    }

    function cleanAll() {
        setSearchNotiTitle('')
        setSearchFalcuty('')
        setStartDate('')
        setSelectedOption({value: "All", label: "All"})
    }    

    async function getRole(){
        await axios.get(`${process.env.REACT_APP_IP}/role`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(async res => {
            console.log(res)
            if(res.data.code === 0){
                let array = ['All']
                await res.data.data.map((value) => {array.push(value.nameRole)})
                await setFalcuty(array)
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
                    NOTIFICATONS
                </h5>
                {/* <Switch>
                    <Route path={`${path}`} exact> */}
                        <div className='child-body'>
                            <div>
                                <form>
                                    <div className='row col-12 pl-2'>
                                        <div className="form-group col-7">                                
                                            <input className='form-control' style={{padding: '4px', width:'100%'}} placeholder='Search by tittle' value={searchNotiTitle} onChange={v => setSearchNotiTitle(v.target.value)} ></input>    
                                        </div>
                                        <div className="form-group col-5">                                
                                            <Dropdown options={falcuty} onChange={handleChange} value={selectedOption} placeholder="Search by falcuty" />  
                                        </div>
                                    </div>
                                    <div className=' row col-12 pl-2'>
                                        <div className="form-group col-5">                                
                                            <DatePicker className='form-control' selected={startDate} onChange={date => setStartDate(date)} />
                                        </div>
                                        <div className="form-check col-3">                                                                  
                                        </div>                        
                                        <div className="col-2">
                                            <button type='button' className='btn btn-danger m-2' style={{fontSize: '14px', alignItems:'center'}} onClick={cleanAll}><RiDeleteBin6Line size='16px' color='white'></RiDeleteBin6Line> Clear</button>            
                                        </div> 
                                        <div className="col-2">
                                            <button disabled={sendBtnState} type='button' className='btn btn-primary m-2' style={{fontSize: '14px', justifyContent:'center'}} onClick={() => submitFilter(1)}><RiSendPlaneFill size='16px' color='white'></RiSendPlaneFill> Find</button>
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
                                                borderStyle={index%2===0?'3px solid rgba(69,190,235,255)':'3px solid gray'}
                                                backgroundStyle={index%2===0?'rgba(201,231,254,255)':'white'}                                                
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
                                <div className='paging mt-2' style={{width:'max-content'}}>
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
                    {/* </Route>                    
                </Switch> */}                
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