import React from 'react';
import axios from "axios"
import logo from "./PNG.png"
import "./OneLogin.css"
const Login = () => {
  const server=process.env.REACT_APP_SERVER_URL
  const handleLogin = async () => {
    try {
      // Gets authentication url from backend server
      const {
        data: { url },
      } = await axios.get(`${server}/api/admin/auth/url`)
      // Navigate to consent screen

      // await axios.post(`${server}/api/auth/message-queue-consume`)
      
      window.location.assign(url)
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <div className="oneLogin">
        {/* <img src={logo} className="loginimage" alt="logo"/>
      
      <button className="LoginButton" onClick={handleLogin}>
       Admin Login with Google Credential
      </button> */}

      <div className="leftlogin">
        

      </div>
      <div className="rightlogin">
      <img src={logo} className="loginimage" alt="logo"/>
      
      <button className="LoginButton" onClick={handleLogin}>
       Admin Login with Google Credential
      </button>
      </div>
    </div>
  )
}

export default Login;
