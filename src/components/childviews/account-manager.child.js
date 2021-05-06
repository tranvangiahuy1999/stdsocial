import React, {useState, useEffect} from 'react'
import AccRow from '../account-row.component'
// import Modal from 'react-modal';

// const customStyles = {
//     content : {
//       top                   : '50%',
//       left                  : '50%',
//       right                 : 'auto',
//       bottom                : 'auto',
//       marginRight           : '-50%',
//       transform             : 'translate(-50%, -50%)'
//     }
// };

// Modal.setAppElement('#root')

const AccManagerPage = (props) => {
    const [searchInput, setSearchInput] = useState('')
    const [modalIsOpen,setIsOpen] = useState(false);

    useEffect(() => {

    })

    function openModal() {
        setIsOpen(true);
    }

    function editHandle(){

    }

    function deleteHandle(){
  
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
                            <AccRow editHandle={editHandle} deleteHandle={deleteHandle}></AccRow>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default AccManagerPage