import React, { useState } from 'react';
import './ChatHeader.css';
import { useSocketContext } from '../context/SocketContext';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

const ChatHeader = ({ channelName, channelPhoto, channelId }) => {

    const { onlineusers } = useSocketContext();
    const isOnline = onlineusers.includes(channelId);
    const [open, setOpen] = useState(false);

    return (
        <div className='chatheader'>
            <Avatar
                alt={channelName}
                src={channelPhoto}
                sx={{ width: 40, height: 40 }}
            />
            <div className='chatheader__text'>
                <h4>{channelName}</h4>
                {
                    isOnline ? (
                            <p className='chatheader__online'>Active Now</p>
                        ) : (
                            <p className='chatheader__offline'>Offline</p>
                        )
                }
            </div>
            <IconButton onClick={() => setOpen(true)}>
                <AccountBoxIcon fontSize='large' style={{ color: "#1893f8" }} />
            </IconButton>
            <div className='chatheader__dialoginfo'>
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                >
                    <DialogContent>
                        <Avatar
                            style={{ margin: "auto" }}
                            alt={channelName}
                            src={channelPhoto}
                            sx={{ width: 100, height: 100 }}
                        />
                        <h3 
                            style={{ 
                                marginLeft: "auto",
                                marginRight: "auto",
                                padding: "10px"
                            }}
                        >{channelName}</h3>
                        <div style={{ justifyContent: "center", alignItems: "center" }}>
                            {
                                isOnline ?
                                    (
                                        <p className='chatheader__online'>Active Now</p>
                                    ) : (
                                        <p className='chatheader__offline'>Offline</p>
                                    )
                            }
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='outlined' onClick={() => setOpen(false)}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default ChatHeader;