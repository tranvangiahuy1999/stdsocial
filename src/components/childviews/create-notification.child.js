import React, { useEffect, useState } from 'react'
import { RiSendPlaneFill } from "react-icons/ri";
import axiosInstance from '../../api/service';
import { useAlert } from 'react-alert'
import { Select } from 'antd';

import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const { Option } = Select;

const CreateNoti = (props) => {
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [content, setContent] = useState('')
    const [searchFalcuty, setSearchFalcuty] = useState('All')
    const [falcuty, setFalcuty] = useState()
    const [btnState, setBtnState] = useState(false)
    const alert = useAlert()

    const token = sessionStorage.getItem("token");

    const editorConfiguration = {
        toolbar: ['heading', '|', "undo", "redo", "bold", "italic", "blockQuote", "uploadImage", "imageStyle:full", "imageStyle:side", "link", "numberedList", "bulletedList", "mediaEmbed", "insertTable", "tableColumn", "tableRow", "mergeTableCells"],
        ckfinder: {
            uploadUrl: 'https://stdsocial.onrender.com/newfeed/add/image',
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    };

    useEffect(() => {
        getCurrentUser()
        window.scrollTo(0, 0)
    }, [])

    function onSelectChange(value) {
        setSearchFalcuty(value)
    }

    function getCurrentUser() {
        axiosInstance.get(`account/current`)
            .then(res => {
                if (res.data.code === 0) {
                    let array = ['All']
                    res.data.data.faculty.map((value) => { array.push(value) })
                    setFalcuty(array)
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

    async function onSubmit(e) {
        e.preventDefault()
        if (title && content && desc && searchFalcuty !== 'All') {
            setBtnState(true)
            let body = {
                'title': title,
                'content': content,
                'description': desc,
                'role': searchFalcuty
            };
            axiosInstance.post(`/notification/add`, body)
                .then(res => {
                    if (res.data.code === 0) {
                        setTitle('')
                        setDesc('')
                        setContent('')
                        setSearchFalcuty('All')
                        alert.show(res.data.message, {
                            type: 'success'
                        })

                    } else {
                        alert.show(res.data.message, {
                            type: 'error'
                        })
                    }
                    setBtnState(false)
                })
                .catch(e => {
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

    return (
        <div className='child-page'>
            <h5 className='child-header'>
                POST NOTICE
            </h5>
            <div className='child-body'>
                <form onSubmit={onSubmit}>
                    <div className='form-group'>
                        <input className='form-control' value={title} style={{ fontWeight: 'bold' }} onChange={e => setTitle(e.target.value)} placeholder='Title'></input>
                    </div>
                    <div className='form-group'>
                        <input className='form-control' value={desc} onChange={e => setDesc(e.target.value)} placeholder='Description'></input>
                    </div>
                    <div className='form-group'>
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
                    <div className='form-group'>
                        <CKEditor
                            editor={ClassicEditor}
                            data={content}
                            config={editorConfiguration}
                            onReady={editor => {
                                editor.editing.view.change(writer => {
                                    writer.setStyle(
                                        "height",
                                        "200px",
                                        editor.editing.view.document.getRoot()
                                    );
                                });
                            }}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setContent(data)
                            }}
                        />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <button disabled={btnState} className="btn btn-primary" style={{ width: '50%' }}><RiSendPlaneFill size='18px' color='white'></RiSendPlaneFill> Post notice</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateNoti