import { createContext, useState, useEffect, useContext } from "react";
import { useSelector } from 'react-redux';
import { selectUser } from '../features/authSlice';
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineusers, setOnlineusers] = useState([]);
    const userInfo = useSelector(selectUser);

    useEffect(() => {
        if (userInfo) {
            const socket = io(import.meta.env.VITE_SOCKET_URL, {
                query: {
                    userId: userInfo.id
                }
            });
            setSocket(socket);
            socket.on("getOnlineUsers", (users) => {
                setOnlineusers(users);
            })

            return () => socket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }

    }, [userInfo]);

    return <SocketContext.Provider value={{ socket, onlineusers }}>{children}</SocketContext.Provider>
}