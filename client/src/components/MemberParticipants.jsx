import React from 'react';
import './ChatParticipant.css';
import { useSocketContext } from '../context/SocketContext';
import Avatar from '@mui/material/Avatar';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/authSlice';

const MemberParticipants = ({ uname, pic, id }) => {

    const userInfo = useSelector(selectUser);
    const { onlineusers } = useSocketContext();
    const isOnline = onlineusers.includes(id);

    return (
        <div
            className='chatparticipant'
        >
            <div>
                <Avatar
                    alt={uname}
                    src={pic}
                    sx={{ width: 45, height: 45 }}
                />
            </div>
            <div className='chatparticipant__text'>
                {userInfo?.username === uname ? (<h4>You</h4>): (<h4>{ uname }</h4>)}
                {
                    isOnline ?
                        (
                            <p className='chatparticipant__online'>Active Now</p>
                        ) : (
                            <p className='chatparticipant__offline'>Offline</p>
                        )
                }
            </div>
        </div>
    );
}

export default MemberParticipants;