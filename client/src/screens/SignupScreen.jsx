import React, { useState, useEffect } from 'react';
import Logo from "../assets/Logo.png";
import "./FormScreen.css";
import { Link, useNavigate } from "react-router-dom";
import apiInstance from '../apiInstance';

const SignupScreen = () => {

    const navigateTo = useNavigate();
    
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const [gender, setGender] = useState("");
    const [genderError, setGenderError] = useState("");

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [cpassword, setCpassword] = useState("");
    const [cpasswordError, setCpasswordError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigateTo('/signup', { replace: true });
            localStorage.removeItem("token");
        } else {
            navigateTo('/');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const regex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
        if(!username){
            setUsernameError("Username should not be blank");
        } else if (username.length <= 4){
            setUsernameError("Username must be of min 4 chars");
        } else if (!email){
            setEmailError("Email should not be blank")
        } else if (!regex.test(email)){
            setEmailError("Not a valid email");
        } else if (!gender) {
            setGenderError("Gender should not be blank");
        } else if (gender === "nos") {
            setGenderError("Select Your Gender");
        } else if (password.length < 8){
            setPasswordError("Password should be min 8 characters")
        } else if (cpassword.length < 8) {
            setCpasswordError("Password should be min 8 characters")
        } else if (password !== cpassword){
            setCpasswordError("Passwords don't match")
        } else {
            await apiInstance.post('/users/register', {
                username: username,
                email: email,
                gender: gender,
                password: password,
            })
            .then((res) => {
                if (res.data.status === "ok") {
                    alert("Register Successfull");
                    navigateTo("/signin");
                } else if (res.data.err === "sameusername") {
                    setUsernameError(data.msg);
                } else if (res.data.err === "sameemail") {
                    setEmailError(data.msg);
                }
            })
            .catch((err) => {

            })          
        }
    }

    return (
        <div>
            <img className='logo' src={Logo} />
            <div className='userform'>
                <h3>Sign Up</h3>
                <input
                    onChange={(e) => setUsername(e.target.value)}
                    type='text'
                    placeholder='Enter Your Username'
                    value={username}
                />
                <p 
                    style={{ color: "red", 
                        fontSize: "11px",
                        marginTop: "4px" 
                    }}
                >{usernameError}</p>
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
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="nos">Select Your Gender</option>
                    <option value="boy">Male</option>
                    <option value="girl">Female</option>
                </select>
                <p
                    style={{
                        color: "red",
                        fontSize: "11px",
                        marginTop: "4px"
                    }}
                >{genderError}</p>
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
                <input
                    onChange={(e) => setCpassword(e.target.value)}
                    type='password'
                    placeholder='Confirm Your Password'
                    value={cpassword}
                />
                <p
                    style={{
                        color: "red",
                        fontSize: "11px",
                        marginTop: "4px"
                    }}
                >{cpasswordError}</p>
                <button onClick={handleSubmit}>Sign Up</button>
                <h4
                    style={{
                        color: "#1893f8",
                        marginTop: "10px",
                    }}
                >Already have an account?</h4>
                <Link
                    style={{ color: "#1893f8", textDecoration: "none", fontWeight: "bold" }}
                    to='/signin'
                >Sign In</Link>
            </div>
        </div>
    );
}

export default SignupScreen;