import React, { useState, useEffect } from 'react';
import Logo from "../assets/Logo.png";
import "./FormScreen.css";
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from '../features/authSlice';
import apiInstance from '../apiInstance';

const SigninScreen = () => {

    const navigateTo = useNavigate();
    const dispatch = useDispatch(); 

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigateTo('/signin');
            localStorage.removeItem("token");
        } else {
            navigateTo('/');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const regex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
        if (!email) {
            setEmailError("Email should not be blank")
        } else if (!regex.test(email)) {
            setEmailError("Not a valid email");
        }else if(!password){
            setPasswordError("Password should be blank");
        } else if (password.length < 8) {
            setPasswordError("Password should be min 8 characters");
        } else {
            await apiInstance.post('/users/login', {
                email: email,
                password: password,
            })
            .then((res) => {
                if (res.data.status === "user exist") {
                    localStorage.setItem("token", res.data.token);
                    navigateTo("/");
                    dispatch(setCredentials({
                        username: res?.data?.user?.username,
                        email: res?.data?.user?.email,
                        gender: res?.data?.user?.gender,
                        profilePic: res?.data?.user?.profilePic,
                        id: res?.data?.user?._id,
                    }));
                } else if (res.data.err === "noemail") {
                    setEmailError(res.data.msg);
                } else if (res.data.err === "incpass") {
                    setPasswordError(res.data.msg);
                }
            })
            .catch((err) => {
                console.log(err.message);
            })
        }
    }

    return (
        <div>
            <img className='logo' src={Logo} />
            <div className='userform'>
                <h3>Sign In</h3>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    type='email'
                    placeholder='Enter Your Email'
                    value={email}
                />
                <p
                    style={{
                        color: "red",
                        fontSize: "11px",
                        marginTop: "4px"
                    }}
                >{emailError}</p>
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    type='password'
                    placeholder='Enter Your Password'
                    value={password}
                />
                <p
                    style={{
                        color: "red",
                        fontSize: "11px",
                        marginTop: "4px"
                    }}
                >{passwordError}</p>
                <button onClick={handleSubmit}>Sign In</button>
                <h4
                    style={{ 
                        color: "#1893f8",
                        marginTop: "10px", 
                    }}
                >Don't have an account?</h4>
                <Link 
                    style={{ color: "#1893f8", textDecoration: "none", fontWeight: "bold" }} 
                    to='/signup'
                >Sign Up</Link>
            </div>
        </div>
    );
}

export default SigninScreen;