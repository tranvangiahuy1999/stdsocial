import React, {useState, useEffect} from 'react'
import {    
    useHistory,
    useParams,
    withRouter     
  } from "react-router-dom";
import axios from 'axios'
import {connect} from 'react-redux'
import {useAlert} from 'react-alert'
import {compose} from "redux"

const NotiReader = (props) => {
    let { id } = useParams()

    const [title, setTitle] = useState('')
    const [faculty, setFalcuty] = useState('')
    const [user, setUser] = useState('')
    const [date, setDate] = useState('')
    const [desc, setDesc] = useState('')
    const [content, setContent] = useState('')
    const history = useHistory()

    const alert = useAlert()

    useEffect(() => {
        window.scrollTo(0, 0)
        axios.get(`${process.env.REACT_APP_IP}/notification/${id}` ,{
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {            
            if(res.data.code === 0){
                setTitle(res.data.data.title)
                setFalcuty(res.data.data.role)
                setUser(res.data.data.user)
                setDate(res.data.data.date.split('T')[0])
                setDesc(res.data.data.description)
                setContent(res.data.data.content)
            } else {
                alert.show(`Notification doens't exist`)
            }
        })
        .catch( e => {
            console.error(e)           
        })

    }, [])

    return(   
        <div className='child-page'>
            <div className='child-body'>
                <h3 className='reading-title'>{title}</h3>
                <div className='reading-date'>{faculty}/<span>{date}</span></div>            
                <div className='reading-content' dangerouslySetInnerHTML={{ __html: content }}>                    
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

function mapDispatchToProps(dispatch) {
    return {        
        logOut: () => dispatch({type: 'LOGOUT'}),
    };
}

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
  )(NotiReader);