import React, { useState, useEffect } from 'react';
import './GroupSection.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/authSlice';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import GroupParticipant from './GroupParticipant';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { formattedDate } from '../utils/formattedDate';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import apiInstance from '../apiInstance';

const GroupSection = () => {

    const userInfo = useSelector(selectUser);
    const [newgroup, setNewgroup] = useState(false);
    const [groupname, setGroupname] = useState("");
    const [grpnameError, setGroupnameError] = useState("");
    const [search, setSearch] = useState('');
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            await apiInstance.get('/groups')
            .then((res) => {
                setGroups(res.data);
            })
            .catch((err) => {
                //alert(err);
            })          
        }
        fetchGroups();
    }, [groups])


    const createNewGroup = async (e) => {
        e.preventDefault()
        if (!groupname) {
            setGroupnameError("Group Name cannot be blank")
        } else if (groupname.length < 4) {
            setGroupnameError("Group Name must be min 4 chars")
        } else {
            await apiInstance.post('/groups/create', {
                groupname: groupname,
            })
            .then((res) => {
                if (res.data.status === "created") {
                    alert("New Group Created")
                    setNewgroup(false);
                }
            })
            .catch((err) => {
                alert("Cannot Create Group", err.message);
                setNewgroup(false);
            })
        }
    }

    return (
        <div className='groupsection'>
            <div className='groupsection__header'>
                <h2>Groups</h2>
                <IconButton onClick={() => setNewgroup(true)}>
                    <GroupAddIcon
                        fontSize='large'
                        style={{ color: "#1893f8", cursor: "pointer" }}
                    />
                </IconButton>
            </div>
            <div className="groupsection__search">
                <div className="groupsection__searchContainer">
                    <SearchIcon />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type='text'
                        placeholder='Search Groups'
                    />
                </div>
            </div>
            <div className="groupsection__groups">
                {
                    groups.length > 0 ? (
                        groups.filter((group) => {
                            return search.toLowerCase() === '' ? group :
                                group.groupname.toLowerCase().includes(search)
                        }).map((group) => (
                            <GroupParticipant
                                id={group._id}
                                key={group._id}
                                grpname={group.groupname}
                                pic={group.groupPic}
                                date={formattedDate(group.updatedAt)}
                                madeby={group.createdBy.username === userInfo.username ? "You" : group.createdBy.username}
                            />
                        ))
                    ) : (
                        <div style={{ display: "flex", flex: "0.25" }}>
                            <h3 style={{ margin: "auto", color: "#1893f8" }}>No Groups to show</h3>
                        </div>
                    )
                }
            </div>
            <div className="groupsection__dialog">
                <Dialog
                    open={newgroup}
                    onClose={() => {setNewgroup(false); setGroupnameError("")}}
                >
                    <DialogTitle>
                        Create New Group
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            style={{ width: "250px" }}
                            value={groupname}
                            type='text'
                            variant='standard'
                            label='Enter Group Name'
                            onChange={(e) => setGroupname(e.target.value)}
                        />
                        <p
                            style={{
                                color: "red",
                                fontSize: "11px",
                                marginTop: "4px"
                            }}
                        >{grpnameError}</p>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='contained' onClick={createNewGroup}>Add</Button>
                        <Button variant='outlined' onClick={() => { setNewgroup(false); setGroupnameError("") }}>Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default GroupSection;