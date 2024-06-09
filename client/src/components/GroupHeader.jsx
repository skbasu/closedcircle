import React, { useState, useEffect } from 'react';
import './GroupHeader.css';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Groups2Icon from '@mui/icons-material/Groups2';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MemberParticipants from './MemberParticipants';
import apiInstance from '../apiInstance';

const GroupHeader = ({ channelName, channelPhoto, channelId }) => {

    const [addmember, setAddmember] = useState(false);
    const [membersDia, setMembersDia] = useState(false);
    const [memberId, setMemberId] = useState("");
    const [memberIdError, setMemberIdError] = useState("");
    const [scroll, setScroll] = useState('paper');
    const [members, setMembers] = useState([]);

    const addNewMember = async (e) => {
        e.preventDefault();
        if(!memberId){
            setMemberIdError("Member Id should not be blank");
        } else {
            await apiInstance.post(`/groups/add/${channelId}/${memberId}`)
            .then((res) => {
                if (res.data.status === "notadded") {
                    setMemberIdError(res.data.error);
                } else if (res.data.status === "added") {
                    setAddmember(false);
                    alert("Member Added to the Group")
                }
            })
            .catch((err) => {
                //alert(err.message);
            })
                 
        }
        setMemberId("");
    }

    useEffect(() => {
        const fetchMembers = async () => {
            await apiInstance.get(`/groups/members/${channelId}`)
            .then((res) => {
                setMembers(res.data.grpmembers.members);
            })
            .catch((err) => {
                alert(err.message);
            }) 
        }

        fetchMembers();
    },[members])

    return (
        <div className='groupheader'>
            <Avatar
                alt={channelName}
                src={channelPhoto}
                sx={{ width: 40, height: 40 }}
            />
            <div className='groupheader__text'>
                <h4>{channelName}</h4>
            </div>
            <IconButton onClick={() => setAddmember(true)}>
                <AddIcon fontSize='large' style={{ color: "#1893f8" }} />
            </IconButton>
            <IconButton onClick={() => setMembersDia(true)}>
                <Groups2Icon fontSize='large' style={{ color: "#1893f8" }} />
            </IconButton>
            <div className='groupheader__addmemberdialog'>
                <Dialog
                    open={addmember}
                    onClose={() => {setAddmember(false); setMemberIdError("")}}
                >
                    <DialogTitle>
                        Add New Member 
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            style={{ width: "280px" }}
                            variant="standard"
                            value={memberId}
                            type='text'
                            label='Enter Member ID'
                            onChange={(e) => setMemberId(e.target.value)}
                        />
                        <p
                            style={{
                                color: "red",
                                fontSize: "11px",
                                marginTop: "4px"
                            }}
                        >{memberIdError}</p>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='contained' onClick={addNewMember}>Add</Button>
                        <Button variant='outlined' onClick={() => {setAddmember(false); setMemberIdError("")}}>Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div className='groupheader__membersdialog'>
                <Dialog
                    open={membersDia}
                    onClose={() => setMembersDia(false)}
                    scroll={scroll}
                >
                    <DialogTitle>
                        Members
                    </DialogTitle>
                    <DialogContent dividers={scroll === 'paper'}>
                        {
                            members.map((member) => (
                                <MemberParticipants 
                                    uname={member.username}
                                    pic={member.profilePic}
                                    id={member._id}
                                />
                            ))
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button variant='outlined' onClick={() => setMembersDia(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default GroupHeader;