import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/authSlice';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ChatParticipant from './ChatParticipant';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import apiInstance from '../apiInstance';

const Sidebar = () => {

    const userInfo = useSelector(selectUser);
    const [searchfriendopen, setSearchfriendopen] = useState(false);
    const [profileDialog, setProfileDialog] = useState(false);
    const [friendId, setFriendId] = useState("");
    const [friendIdError, setFriendIdError] = useState("");
    const [frienddetails, setFriendDetails] = useState([]);
    const [frienddetailsopen, setFriendDetailsopen] = useState(false);
    const [friends, setFriends] = useState([]);
    const [search, setSearch] = useState('');

    const navigateTo = useNavigate();
    const dispatch = useDispatch();

    const handleSignOut = () => {
        localStorage.removeItem("token");
        dispatch(logout());
        navigateTo('/signin');
    }

    useEffect(() => {
        const fetchFriends = async () => {
            await apiInstance.get('/friends')
            .then((res) => {
                setFriends(res.data);
            })
            .catch((err) => {
                //alert(err.message);
            });          
        }
        fetchFriends();
    }, [friends])

        
    const searchDetails = async (e) => {
        e.preventDefault();
        if(!friendId){
            setFriendIdError("Friend Id should not be blank!!");
        } else if (friendId === userInfo.id){
            setFriendIdError("This is your id only");
        } else {
            await apiInstance.get(`/userinfo/${friendId}`)
            .then((res) => {
                if (res.data.status === "no") {
                    setFriendIdError(res.data.msg)
                } else if (res.data.status === "yes") {
                    setFriendDetails(res.data.user);
                    setSearchfriendopen(false);
                    setFriendDetailsopen(true);
                }
            })
            .catch((err) => {
                //alert(err.message);
            })            
        }
    };

    const addFriend = async (e) => {
        e.preventDefault();
        await apiInstance.post(`/friends/add/${friendId}`)
        .then((res) => {
            if (res.data.status === "ok") {
                setFriendDetailsopen(false);
                alert(data.msg);
            } else if (res.data.status === "notok") {
                alert("Not Added");
            }
        })
        .catch((err) => {
            //alert(err.message);
        })
    }

    return (
        <div className='sidebar'>
            <div className="sidebar__header">
                <h2>ClosedCircle</h2>
                <Avatar
                    onClick={() => setProfileDialog(true)}
                    style={{ alignItems: "center", marginRight: "10px", cursor: "pointer", marginTop: "10px" }}
                    alt={userInfo?.username}
                    src={userInfo?.profilePic}
                    sx={{ width: 50, height: 50 }}
                />
            </div>
            <div className="sidebar__profileDetailsDialog">
                <Dialog
                    open={profileDialog}
                    onClose={() => setProfileDialog(false)}
                >
                    <DialogTitle>
                        Profile
                    </DialogTitle>
                    <DialogContent>
                        <Avatar
                            style={{ margin: "auto" }}
                            alt={userInfo?.username}
                            src={userInfo?.profilePic}
                            sx={{ width: 100, height: 100 }}
                        />
                        <h3 style={{ marginTop: "10px" }}>{userInfo?.username}</h3>
                        <h4 style={{ marginTop: "10px" }}>{userInfo?.email}</h4>
                        <h5 style={{ marginTop: "10px" }}>{userInfo?.id}</h5>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='contained' onClick={handleSignOut}>Sign Out</Button>
                        <Button variant='outlined' onClick={() => setProfileDialog(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div className="sidebar__subheader">
                <h2>Chats</h2>
                <IconButton onClick={() => setSearchfriendopen(true)}>
                    <PersonAddIcon
                        fontSize='large'
                        style={{ color: "#1893f8", cursor: "pointer" }}
                    />
                </IconButton>
            </div>
            <div className='sidebar__search'>
                <div className="sidebar__searchContainer">
                    <SearchIcon />
                    <input 
                        value={search}
                        type='text' 
                        placeholder='Search Chats'
                        onChange={(e) => setSearch(e.target.value)} 
                    />
                </div>
            </div>
            <div className='sidebar__chats'>
                {
                    friends.length > 0 ? (
                        friends.filter((friend) => {
                            return search.toLowerCase() === '' ? friend :
                                friend.username.toLowerCase().includes(search)
                        }).map((friend) => (
                            <ChatParticipant
                                id={friend._id}
                                key={friend._id}
                                uname={friend.username}
                                pic={friend.profilePic}
                            />
                        ))
                    ) : (
                        <div style={{ display: "flex", flex: "0.25" }}>
                            <h3 style={{ margin: "auto", color: "#1893f8" }}>No friends to show</h3>
                        </div>
                    )
                }
            </div>
            <div className="sidebar__dialogs">
                <Dialog
                    open={searchfriendopen}
                    onClose={() => {setSearchfriendopen(false); setFriendIdError("")}}
                >
                    <DialogTitle>
                        Add New Friend
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            variant="standard"
                            label="Enter the friend's ID"
                            style={{ width: "280px" }}
                            value={friendId}
                            type='text'
                            onChange={(e) => setFriendId(e.target.value)}
                        />
                        <p
                            style={{
                                color: "red",
                                fontSize: "11px",
                                marginTop: "4px"
                            }}
                        >{friendIdError}</p>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='contained' onClick={searchDetails}>Search</Button>
                        <Button variant='outlined' onClick={() => { setSearchfriendopen(false); setFriendIdError("") }}>Close</Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={frienddetailsopen}
                    onClose={() => setSearchfriendopen(false)}
                >
                    <DialogTitle>
                        <h3>{frienddetails.username}</h3>
                    </DialogTitle>
                    <DialogContent>
                        {frienddetails.email}
                    </DialogContent>
                    <DialogActions>
                        <Button variant='contained' onClick={addFriend}>Add</Button>
                        <Button variant='outlined' onClick={() => setFriendDetailsopen(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default Sidebar;