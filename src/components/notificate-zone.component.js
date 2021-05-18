import React from 'react'
import NotiCard from './notificatecard.component'
import {connect} from 'react-redux'
import { Spin, Space } from 'antd';

const NotiZone = (props) => {
    function notiClickHandle(){

    }

    return(
        <div className='notizone-container bg-white'>
            <div className='component-title'>
                <div className='title'>NOTIFICATION <span className='mr-1' style={{fontSize:'16px', fontWeight:'normal', float: 'right'}}>{props.notilink}</span></div>
            </div>
            <div className='notizone-body'>            
                {
                    (props.loading)?(
                        <div style={{textAlign:'center', margin:'30px'}}>
                            <Space size="middle">
                                <Spin size='default' />
                            </Space>
                        </div>
                    ):(
                    props.notiData && props.notiData.length > 0?
                    props.notiData.map((value, index) => (
                        <NotiCard
                            key={value._id}
                            borderStyle={index%2===0?'5px solid rgba(150,204,108,255)':'5px solid rgba(118,201,190,255)'}
                            textStyle={index%2===0?'rgba(150,204,108,255)':'rgba(118,201,190,255)'}                   
                            notiClickHandle={notiClickHandle}
                            falcutyname={value.role}
                            date={value.date.split('T')[0]}
                            title={value.title}
                            content = {value.content}
                            subtitle={value.description}
                            noti_id= {value._id}
                            seedetail={() => props.seedetail(value._id)}
                            >                                
                        </NotiCard>
                    )):<div className='empty-data'>
                            <div className='empty-text'>No content to show</div>
                        </div>)
                }
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        token: state.token
    };
}

export default connect(mapStateToProps)(NotiZone)