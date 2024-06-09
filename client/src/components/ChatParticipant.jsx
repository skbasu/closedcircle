import React from 'react';
import './ChatParticipant.css';
import { useSocketContext } from '../context/SocketContext';
import { useDispatch } from 'react-redux';
import { setChannel } from '../features/channelSlice';
import Avatar from '@mui/material/Avatar';

const ChatParticipant = ({ uname, pic, id }) => {

    const { onlineusers } = useSocketContext();
    const isOnline = onlineusers.includes(id);

    const dispatch = useDispatch(setChannel);

    return (
        <div 
            className='chatparticipant'
            onClick={() => dispatch(
                setChannel({
                    channelId: id,
                    channelName: uname,
                    channelPhoto: pic,
                    channelIsGroup: false,
                })
            )}
        >
            <div>
                <Avatar
                    alt={uname}
                    src={pic}
                    sx={{ width: 45, height: 45 }}
                />
            </div>
            <div className='chatparticipant__text'>
                <h4>{uname}</h4>
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

export default ChatParticipant;