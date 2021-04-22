import React, {useState, useEffect} from 'react'
import StatusPost from '../statuspost.component'
import StatusCard from '../statuscard.component'
import NotiZone from '../notificate-zone.component'
import axios from 'axios'
import Modal from 'react-modal';
// import socketIOClient from "socket.io-client";

const token = localStorage.getItem('token')

// const customStyles = {
//     content : {
//       top                   : '50%',
//       left                  : '50%',
//       right                 : 'auto',
//       bottom                : 'auto',
//       marginRight           : '-50%',
//       transform             : 'translate(-40%, -40%)',
//     }
// };  

const Newfeed = (props) =>  {
    const [newfeedData, setNewfeedData] = useState(null)
    const [userData, setUserData] = useState(null)
    // const [img, setImg] = useState()
    // const [modalIsOpen,setIsOpen] = useState(false)

    useEffect(async () => {
        await getUserData()
        await getNewfeed()

    }, [])

    async function getUserData(){
        const res = await axios.get(`http://${process.env.REACT_APP_IP}:3000/account/current`, {
            headers: {
                'Authorization' : 'Bearer ' + token
            }
        })
        .catch()
        
        if(res){
            if(res.status === 200){
                if(res.data.code === 0){
                    await setUserData(res.data.data)
                }
            }            
        }
    }
    
    // function openModal() {
    //     setIsOpen(true);
    // }

    // function afterOpenModal() {
        
    // }
    
    // function closeModal(){
    //     setIsOpen(false);
    // }

    async function getNewfeed(){
        const res = await axios.get(`http://${process.env.REACT_APP_IP}:3000/newfeed`, {
            headers: {
                'Authorization' : 'Bearer ' + token
            }
        })
        .catch()

        console.log(res)
        if(res){
            if(res.data.code === 0 && res.data.data){
                await setNewfeedData(res.data.data)
            }
        }
    }
    

    function cmtHandle(){
        console.log('cmt')
        //post {statusId, token} retrive cmt of status
    }

    function likeHandle(){
        console.log('like')
        //like handle
    }
    
    return(
        <div className='col-15 row'>
            <div className='col-8 p-0'>
                <StatusPost
                    avatar={''}
                    username={userData?userData.user:''}                    
                    ></StatusPost>     
                {/* <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    ariaHideApp={false}
                    style={customStyles}
                    contentLabel="Example Modal"
                    >
                    <form className='modal-body'>
                        <h4 className='modal-title'>Create post</h4>
                        <div className='row modal-head'>
                            <img src='' width='30px' height='30px' alt='avatar'></img>
                            <div style={{textAlign: 'center', fontSize:'15px', fontWeight:'bold'}}>{userData?userData.user:''}Tran Van Gia Huy</div>                        
                        </div>
                        <textarea rows='4' className='modal-textarea' placeholder='What in your mind?'></textarea>
                        {
                            (img && img.length > 0)?<img src={img}></img>:<div></div>
                        }
                        <div className='modal-media'>Add to post <span>
                            <input className='modal-upload-img' onChange={_onChange} type='image'/>
                        </span>
                        </div>
                        <button className='btn btn-primary'>Post</button>
                    </form>
                </Modal>                */}
                <div className='post-data col-12'>
                    {(newfeedData && newfeedData.length > 0)?
                        newfeedData.map((value, index) => (
                        <StatusCard
                            key={value._id}
                            avatar=''
                            username={value.user[0]}
                            date={value.date.split('T')[0]}
                            imgcontent= {value.image}
                            textcontent={value.content}
                            like={value.likecount}
                            cmt={value.commentcount}
                            likeHandle={likeHandle}
                            cmtHandle={cmtHandle}
                        ></StatusCard>))
                        :<div style={{paddingTop:'4px'}}>
                            <div style={{color:'gray', textAlign:'center'}}>No content to show</div>
                        </div>}
                </div>
            </div>
            <div className='col-4' style={{justifyContent:'center'}}>
                <NotiZone></NotiZone>
            </div>
        </div>
    )
}

export default Newfeed