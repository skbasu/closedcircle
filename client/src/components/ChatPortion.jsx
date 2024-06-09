import React, { useState, useEffect, useRef } from 'react';
import './ChatPortion.css';
import { useSelector } from 'react-redux';
import { selectChannelId, selectChannelName, selectChannelPhoto, selectChannelIsGroup } from '../features/channelSlice';
import ChatHeader from './ChatHeader';
import GroupHeader from './GroupHeader';
import SendIcon from '@mui/icons-material/Send';
import { selectUser } from '../features/authSlice';
import { formattedTime } from '../utils/formattedTime';
import apiInstance from '../apiInstance';

const ChatPortion = () => {

    const userInfo = useSelector(selectUser);
    const channelName = useSelector(selectChannelName);
    const channelId = useSelector(selectChannelId);
    const channelPhoto = useSelector(selectChannelPhoto);
    const channelIsGroup = useSelector(selectChannelIsGroup);
    const [personalchats, setpersonalChats] = useState([]);
    const [groupchats, setgroupChats] = useState([]);
    const [sendMsg, setSendMsg] = useState("");
    const msgEnd = useRef(null);
    const whiteSpaceRegx = /^\s+$/;

    useEffect(() => {
        const fetchPersonalChats = async () => {
            await apiInstance.get(`/messages/${channelId}`)
                .then((res) => {
                    setpersonalChats(res.data);
                })
                .catch((err) => {
                    alert(err.message)
                })
        }

        const fetchGroupChats = async () => {
            await apiInstance.get(`/groups/getmsg/${channelId}`)
                .then((res) => {
                    setgroupChats(res.data);
                })
                .catch((err) => {
                    alert(err.message)
                })
        }

        channelIsGroup ? fetchGroupChats() : fetchPersonalChats();

    }, [channelId, personalchats, groupchats]);

    const sendPersonalMessage = async (e) => {
        msgEnd.current?.scrollIntoView();
        e.preventDefault();
        await apiInstance.post(`/messages/send/${channelId}`, {
            content: sendMsg
        })
            .then((res) => {
                if (res.data.status === "ok") {
                    setSendMsg("");
                }
            })
            .catch((err) => {
                //alert(err.message);
            })
    }

    const sendGroupMessage = async (e) => {
        e.preventDefault();
        msgEnd.current?.scrollIntoView();
        await apiInstance.post(`/groups/send/${channelId}`, {
            content: sendMsg
        })
            .then((res) => {
                if (res.data.status === "ok") {
                    setSendMsg("");
                }
            })
            .catch((err) => {
                //alert(err.message);
            })
    }

    return (
        <div className='chatportion'>
            <div className='chatportion__header'>
                {
                    channelIsGroup ? (
                        <GroupHeader
                            channelName={channelName}
                            channelPhoto={channelPhoto}
                            channelId={channelId}
                        />
                    ) : (
                        <ChatHeader
                            channelName={channelName}
                            channelPhoto={channelPhoto}
                            channelId={channelId}
                        />
                    )
                }
            </div>
            <div className="chatportion__chats">
                {
                    channelIsGroup ? (
                        groupchats.map((groupchat) => (
                            <div>
                                <p className={`group__message ${groupchat?.senderId?._id === userInfo?.id && `group__receive`}`}>
                                    <span
                                        style={{ color: `#${groupchat.senderId._id.toString().slice(6, 12)}` }}
                                        className={`${groupchat?.senderId?._id === userInfo?.id ? "group__memberNameNo" : "group__memberName"}`}>
                                        {groupchat?.senderId?.username}
                                    </span>
                                    {groupchat?.content}
                                    <span className='group__messageTime'>{formattedTime(groupchat?.createdAt)}</span>
                                </p>
                                <span className={`${groupchat?.senderId?._id === userInfo?.id ? "chat__sendStatus" : "chat__recieved"}`}>
                                    Delivered
                                </span>
                            </div>
                        ))
                    ) : (
                        personalchats.map((personalchat) => (
                            <div key={personalchat._id}>
                                <p className={`chat__message ${personalchat?.senderId?._id === userInfo?.id && `chat__receive`}`}>
                                    {personalchat?.content}
                                    <span className='chat__messageTime'>{formattedTime(personalchat?.createdAt)}</span>
                                </p>
                                <span className={`${personalchat?.senderId?._id === userInfo?.id ? "chat__sendStatus" : "chat__recieved"}`}>
                                    Delivered
                                </span>
                            </div>
                        ))
                    )
                }
                <div ref={msgEnd} />
            </div>
            <div className="chatportion__footer">
                <input
                    value={sendMsg}
                    onChange={(e) => setSendMsg(e.target.value)}
                    type='text'
                    placeholder='Send a message'
                />
                {
                    sendMsg.length > 0 && !whiteSpaceRegx.test(sendMsg) ? (
                        <SendIcon style={{ color: "#1893f8", marginRight: "10px", cursor: "pointer" }} onClick={channelIsGroup ? sendGroupMessage : sendPersonalMessage} />
                    ) : (
                        <SendIcon style={{ color: "gray", marginRight: "10px" }} />
                    )
                }

            </div>
        </div>
    );
}

export default ChatPortion;