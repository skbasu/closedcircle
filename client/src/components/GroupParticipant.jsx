import React from 'react';
import { useDispatch } from 'react-redux';
import { setChannel } from '../features/channelSlice';

const GroupParticipant = ({ pic, grpname, id, date, madeby }) => {

    const dispatch = useDispatch(setChannel);
    
    return (
        <div 
            onClick={() => dispatch(
                setChannel({
                    channelId: id,
                    channelName: grpname,
                    channelPhoto: pic,
                    channelIsGroup: true,
                })
            )}
            style={{ 
                display: "flex", 
                alignItems: "center",
                padding: "10px",
                cursor: "pointer",
            }} 
            className='groupparticipant'
        >
            <img style={{ height: "45px", width: "45px" }} src={pic} />
            <div>
                <h4 style={{ marginLeft: "10px", fontWeight: "500" }}>{grpname}</h4>
                <span style={{ marginLeft: "10px", fontSize: "13px", color: "gray" }}>
                    {date} by {madeby}
                </span>
            </div>
        </div>
    );
}

export default GroupParticipant;