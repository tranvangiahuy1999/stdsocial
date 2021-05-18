import React, {useEffect, useState} from 'react'
import { RiSendPlaneFill } from "react-icons/ri";
import axios from 'axios'
import Dropdown from 'react-dropdown';
import {connect} from 'react-redux'
import {useAlert} from 'react-alert'

import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const CreateNoti = (props) => {
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [content, setContent] = useState('')
    const [falcuty, setFalcuty] = useState([])   

    const [btnState, setBtnState] = useState(false)

    const alert = useAlert()

    const editorConfiguration = {
        toolbar: [ 'heading', '|',"undo", "redo", "bold", "italic", "blockQuote", "ckfinder", "imageStyle:full", "imageStyle:side", "link", "numberedList", "bulletedList", "mediaEmbed", "insertTable", "tableColumn", "tableRow", "mergeTableCells"],        
    };  

    const [selectedOption, setSelectedOption] = useState(null)

    useEffect(()=> {                 
        getCurrentUser()
    }, [])

    function getCurrentUser() {
        axios.get(`${process.env.REACT_APP_IP}/account/current`, {
            headers: {
                'Authorization' : 'Bearer ' + props.token
            }
        })
        .then(res => {            
            if(res.data.code === 0){
                if(Array.isArray(res.data.data.faculty)) {
                    setFalcuty(res.data.data.faculty)
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
    }

    function handleChange(selectedOption) {
        setSelectedOption(selectedOption)
    }

    async function onSubmit(e) {
        e.preventDefault()
        if(title || content || desc || selectedOption){
            setBtnState(true)
            axios.post(`${process.env.REACT_APP_IP}/notification/add`,
            {
                'title': title,
                'content': content,
                'description': desc,
                'role': selectedOption.value
            },{
                headers: {
                    'Authorization' : 'Bearer ' + props.token
                }
            })
            .then(res => {                
                if(res.data.code === 0){
                    setTitle('')
                    setDesc('')
                    setContent('')
                    
                    alert.show(res.data.message, {
                        type:'success'
                    })                    

                } else {                
                    alert.show(res.data.message, {
                        type: 'error'
                    })            
                }      
                setBtnState(false)          
            })
            .catch( e => {
                console.error(e)
                setBtnState(false)     
            })
        }   
        else {
            alert.show(`Please fill the form above`, {
                type: 'error'
            })        
        }        
    }

    return(
        <div className='child-page'>
            <h5 className='child-header'>
                POST NOTICE
            </h5>
            <div className='child-body'>
                <form onSubmit={onSubmit}>
                    <div className='form-group'>
                        <input className='form-control' value={title} style={{fontWeight:'bold'}} onChange={e => setTitle(e.target.value)} placeholder='Title'></input>
                    </div>
                    <div className='form-group'>
                        <input className='form-control' value={desc} onChange={e => setDesc(e.target.value)} placeholder='Description'></input>
                    </div>
                    <div className='form-group'>
                        <Dropdown options={falcuty} onChange={handleChange} value={selectedOption} placeholder="Search by falcuty" /> 
                    </div>
                    <div className='form-group'>
                        <CKEditor
                            editor={ ClassicEditor }
                            data={content}
                            config={editorConfiguration}                                                                               
                            onReady={ editor => {
                                // You can store the "editor" and use when it is needed.
                                editor.editing.view.change(writer => {
                                    writer.setStyle(
                                      "height",
                                      "200px",
                                      editor.editing.view.document.getRoot()
                                    );
                                  });
                            } }
                            onChange={ ( event, editor ) => {
                                const data = editor.getData();
                                setContent(data)
                            } }                            
                        />
                        {/* <textarea className='form-control' rows='6' value={content} onChange={e => setContent(e.target.value)} placeholder='Write something here'></textarea> */}
                    </div>
                    <button disabled={btnState} className="btn btn-primary"><RiSendPlaneFill size='16px' color='white'></RiSendPlaneFill> Post</button>                    
                                            
                </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateNoti)