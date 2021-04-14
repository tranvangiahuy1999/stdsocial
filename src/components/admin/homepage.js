import React from 'react'
import StatusPost from '../statuspost'
import StatusCard from '../statuscard'
import { MdTransferWithinAStation } from 'react-icons/md'

export default class HomePage extends React.Component {
    constructor(){
        super()
        this.state ={
            data: null
        }
        this.likeHandle = this.likeHandle.bind(this)
        this.cmtHandle = this.cmtHandle.bind(this)
    }

    componentDidMount(){
        this.setState({
            data: this.props.data
        })
        console.log(this.state.data)
    }

    cmtHandle(){
        //post {statusId, token} retrive cmt of status
    }

    likeHandle(){
        //like handle
    }

    render(){
        return(
            <div className='hp-container col-md-15 col-sm-15 row'>
                <div className='hp-left col-md-3 col-sm-0'></div>
                <div className='hp-post col-md-8 col-sm-10'>
                    <StatusPost avatar={this.props.avatar} username={this.props.username}></StatusPost>
                    
                    {/* dynamic init stt here, put into props data */}
                    <div className='post-data col-md-9 col-sm-9'>
                        {(this.state.data && this.state.data.data.length > 0)?
                        this.state.data.data.map((value, index) => (
                            <StatusCard
                                key={value._id}
                                avatar={value.avatar}
                                username={value.name}
                                date={value.date}
                                imgcontent= {value.imgcontenturl}
                                textcontent={value.textcontent}
                                like={value.like}
                                cmt={value.cmt}
                                likeHandle={this.likeHandle}
                                cmtHandle={this.cmtHandle}
                                // likeStyle= {}
                                // likeIcon= {}
                                ></StatusCard>
                        )):<div style={{height:'500px', paddingTop:'4px'}}>
                            <div style={{color:'gray', textAlign:'center'}}>No content to show</div>
                        </div>}
                    </div>
                </div>
                <div className='hp-noti col-md-4 col-sm-5'>

                </div>
            </div>
        )
    }
}