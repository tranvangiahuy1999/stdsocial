import React, {useState, useEffect} from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useRouteMatch,
    useHistory,
    Link
} from 'react-router-dom'

import { Pagination } from 'antd';

import NotiReader from './notification-reader.child'
import DatePicker from "react-datepicker";
import NotiCard from '../notificatecard.component'
import "react-datepicker/dist/react-datepicker.css";
import { RiDeleteBin6Line, RiSendPlaneFill } from "react-icons/ri";
import axios from 'axios'
import Dropdown from 'react-dropdown';
import {connect} from 'react-redux'
import {useAlert} from 'react-alert'

const NotiPage = (props) => {
    const [searchNotiTitle, setSearchNotiTitle] = useState('')
    const [searchFalcuty, setSearchFalcuty] = useState('')
    const [startDate, setStartDate] = useState(new Date());
    const [notiData, setNotiData] = useState(null)
    const [findData, setFindData] = useState({title: '', faculty: '', date: ''})
    const [falcuty, setFalcuty] = useState([])    

    const [sendBtnState, setSendBtnState] = useState(false)

    const [currentSearchPage, setCurrentSearchPage] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)        
    
    const [selectedOption, setSelectedOption] = useState(null)

    let {path, url} = useRouteMatch()
    let history = useHistory()
    const alert = useAlert()

    useEffect(() => {        
        getRole()
        getPage(1)        
    },[])
    

    function dateConvert() {
        const output = ''

        if(startDate && startDate.length > 0){
            const month = String(startDate.getMonth()).padStart(2, '0');
            const day = String(startDate.getDate()).padStart(2, '0');
            const year = startDate.getFullYear();
            output = year + '-' + month  + '-' + day;
        }

        return output
    }   

    async function getPage(page){        
        setCurrentPage(page)

        await axios.get(`http://${process.env.REACT_APP_IP}/notification/page/${page}`,{
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(async res => {            
            await setNotiData(res.data.data)
            if(res.data.total) {    
                await setTotalPage(res.data.total)         
            }

            setSendBtnState(false)            
        })        
        .catch(e => {
            console.error(e)
            setSendBtnState(false)
        })
        setSendBtnState(false)
    }

    async function pagingHandle(page) {        
        if(page >= 1 && page <= totalPage){
            if(findData.title.length > 0 || findData.faculty.length > 0 || findData.date.length > 0){
                await submitFilter(page)
                return
            } else {
                await getPage(page)
                return
            }
        }
    }

    async function submitFilter(page){                    
        if(selectedOption && selectedOption.value !== 'All'){
            await setSearchFalcuty(selectedOption.value)
        }

        setSendBtnState(true)

        const date = dateConvert()        

        await setFindData({title: searchNotiTitle, faculty: searchFalcuty, date: date})
        await setCurrentSearchPage(page)
        
        let api = `http://${process.env.REACT_APP_IP}/notification/dateSort/${date}/${date}/${page}`

        if(searchNotiTitle.length > 0 || searchFalcuty.length > 0 || date.length > 0){
            if(searchNotiTitle.length > 0 && searchFalcuty.length > 0 && date.length > 0){
                api = `http://${process.env.REACT_APP_IP}/notification/search/${searchNotiTitle}/${searchFalcuty}/${date}/${date}/${page}`
            }
            else if(searchNotiTitle.length > 0) {
                if(searchFalcuty.length > 0 ){
                    api = `http://${process.env.REACT_APP_IP}/notification/search/${searchNotiTitle}/${searchFalcuty}/${page}`                    
                } else if(date.length > 0){
                    api = `http://${process.env.REACT_APP_IP}/notification/title-date/${searchNotiTitle}/${date}/${date}/${page}`                   
                } else {
                    api = `http://${process.env.REACT_APP_IP}/notification/search/${searchNotiTitle}/${page}`                                        }
                }
                else if(searchFalcuty.length > 0){
                    if(date.length > 0){
                        api = `http://${process.env.REACT_APP_IP}/notification/role-date/${searchFalcuty}/${date}/${date}/${page}`                    
                    } else {
                        api = `http://${process.env.REACT_APP_IP}/notification/faculty/${searchFalcuty}/${page}`                    
                    }
                }            
            } else {
                getPage(1)
                return
            }

            await axios.get(api , {
                headers:{
                    'Authorization' : 'Bearer ' + props.token
                }
            })
            .then(async res =>{
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
                setSendBtnState(false)
            })
            .catch(e => {
                console.error(e)
            })
        setSendBtnState(false)
    }

    function handleChange(selectedOption) {
        setSelectedOption(selectedOption)
    }

    function cleanAll() {
        setSearchNotiTitle('')
        setSearchFalcuty('')
        setStartDate('')
    }    

    async function getRole(){
        await axios.get(`http://${process.env.REACT_APP_IP}/role`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(async res => {
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
        .catch(e => {
            console.error(e)
        })
    }

    return(
        <Router>
            <div className='child-page'>
                <h5 className='child-header'>
                    NOTIFICATON
                </h5>

                <Switch>
                    <Route path={`${path}`} exact>
                        <div className='child-body'>
                            <div>
                                <form>
                                    <div className='row col-12 pl-2'>
                                        <div class="form-group col-7">                                
                                            <input className='form-control' style={{padding: '4px', width:'100%'}} placeholder='Search by tittle' value={searchNotiTitle} onChange={v => setSearchNotiTitle(v.target.value)} ></input>    
                                        </div>
                                        <div class="form-group col-5">                                
                                            <Dropdown options={falcuty} onChange={handleChange} value={selectedOption} placeholder="Search by falcuty" />  
                                        </div>
                                    </div>
                                    <div className=' row col-12 pl-2'>
                                        <div class="form-group col-5">                                
                                            <DatePicker className='form-control' selected={startDate} onChange={date => setStartDate(date)} />
                                        </div>
                                        <div class="form-check col-3">                        
                                            <div className='ml-2' style={{width:'50%'}}>
                                                <input className="form-check-input" type="checkbox" />
                                                <label className="form-check-label">
                                                    Unread
                                                </label>
                                            </div>
                                            <div className='ml-2' style={{width:'50%'}}>                        
                                                <input className="form-check-input" type="checkbox" />
                                                <label className="form-check-label">
                                                    Your post
                                                </label>
                                            </div>
                                        </div>                        
                                        <div class="col-2">
                                            <button type='button' className='btn btn-danger m-2' style={{fontSize: '14px', alignItems:'center'}} onClick={cleanAll}><RiDeleteBin6Line size='16px' color='white'></RiDeleteBin6Line> Clear</button>            
                                        </div> 
                                        <div class="col-2">
                                            <button disabled={sendBtnState} type='button' className='btn btn-primary m-2' style={{fontSize: '14px', justifyContent:'center'}} onClick={() => submitFilter(1)}><RiSendPlaneFill size='16px' color='white'></RiSendPlaneFill> Find</button>
                                        </div>
                                    </div>
                                </form>
                            <div className='noti-list mt-2'>
                                {
                                    (notiData && notiData.length > 0)?
                                        notiData.map((value, index) => (
                                            <NotiCard
                                                key={value._id}                             
                                                borderStyle={index%2===0?'3px solid rgba(69,190,235,255)':'3px solid gray'}
                                                backgroundStyle={index%2===0?'rgba(201,231,254,255)':'white'}
                                                notiLink={() => <Link className="link" to={`${url}/${value._id}`}>Click to see detail</Link>}
                                                falcutyname={value.role}
                                                date={value.date.split('T')[0]}
                                                title={value.title}
                                                subtitle={value.description}
                                                >
                                            </NotiCard>))
                                        : (
                                            <div className='empty-data'>
                                                <div className='empty-text'>No content to show</div>
                                            </div>
                                        )
                                }
                            </div>
                            <div>
                                <div className='paging mt-2' style={{width:'max-content'}}>
                                    {
                                        (findData.title.length > 0 || findData.faculty.length > 0 || findData.date.length > 0)?(
                                            <Pagination defaultCurrent={currentSearchPage} total={parseInt(totalPage*10)} onChange={(page, pageSize) => {pagingHandle(page)}}/>                                  
                                        ):(
                                            <Pagination defaultCurrent={currentPage} total={parseInt(totalPage*10)} onChange={(page, pageSize) => {pagingHandle(page)}}/>                                  
                                        )
                                    }
                                </div>                                
                            </div>
                        </div>
                        </div>
                    </Route>
                    <Route path={`${path}/:id`} component={NotiReader}/>
                </Switch>
            </div>
        </Router>
    )
}

function mapStateToProps(state) {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(NotiPage)