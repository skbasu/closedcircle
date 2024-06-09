import React, { useEffect } from 'react';
import "./HomeScreen.css";
import Sidebar from '../components/Sidebar';
import ChatPortion from '../components/ChatPortion';
import GroupSection from '../components/GroupSection';
import { useSelector } from 'react-redux';
import { selectChannelId } from '../features/channelSlice';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {

    const navigateTo = useNavigate();
    const channelId = useSelector(selectChannelId);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigateTo('/signin', { replace: true });
            localStorage.removeItem("token");
        }
    }, []);

    return (
        <div className='homescreen'>
            <div className="homescreen__container">
                <Sidebar />
                <GroupSection />
                {
                    channelId != null ? <ChatPortion /> : (
                        <div style={{ display: "flex", flex: "0.50" }}>
                            <h3 style={{ 
                                margin: "auto",
                                color: "#1893f8",
                            }}>Select a friend/group to start chatting</h3>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default HomeScreen;