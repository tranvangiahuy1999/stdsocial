import React, {useState, useEffect} from 'react'
import StatusPost from '../statuspost'
import StatusCard from '../statuscard'
import { MdTransferWithinAStation } from 'react-icons/md'

const HomePage = (props) =>  {
    const [data, setData] = useState(null)
    
    useEffect(() => {
        setData(props.data)
    })

    function cmtHandle(){
        //post {statusId, token} retrive cmt of status
    }

    function likeHandle(){
        //like handle
    }
    return(
        <div className='hp-container col-md-15 col-sm-15 row'>
            <div className='hp-left col-md-3 col-sm-0'></div>
            <div className='hp-post col-md-8 col-sm-10'>
                <StatusPost avatar={props.avatar} username={props.username}></StatusPost>                    
                {/* dynamic init stt here, put into props data */}
                <div className='post-data col-md-9 col-sm-9'>
                    {(data && data.data.length > 0)?
                    data.data.map((value, index) => (
                        <StatusCard
                            key={value._id}
                            avatar={value.avatar}
                            username={value.name}
                            date={value.date}
                            imgcontent= {value.imgcontenturl}
                            textcontent={value.textcontent}
                            like={value.like}
                            cmt={value.cmt}
                            likeHandle={likeHandle}
                            cmtHandle={cmtHandle}
                            // likeStyle= {}
                            // likeIcon= {}
                        ></StatusCard>)):<div style={{height:'500px', paddingTop:'4px'}}>
                        <div style={{color:'gray', textAlign:'center'}}>No content to show</div>
                    </div>}
                </div>
            </div>
            <div className='hp-noti col-md-4 col-sm-5'>
            </div>
        </div>
    )
}

export default HomePage