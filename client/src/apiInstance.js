import Axios from 'axios';

const apiInstance = Axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        "Content-Type": "text/plain",
        "auth-token": localStorage.getItem("token"),
    },
    
});

export default apiInstance;