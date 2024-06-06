// NotificationComponent.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NotificationComponent.css"; // Import CSS file
import {useNavigate} from 'react-router-dom';
import Navbar from "./Navbar.js"
const NotificationComponent = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
const server=process.env.REACT_APP_SERVER_URL
  useEffect(() => {

    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${server}/api/auth/notifications`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${server}/api/auth/notification/${id}`);
      setNotifications(notifications.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="notification-container">
      <h2>Notifications</h2>
      {notifications?.map((notification) => (
        <div key={notification._id} className="notification">
          <h4 onClick={()=>{navigate(`/profile/${notification.id}`)}}>Go To Employee ID: {notification.id}</h4>
          <p>Start Time: {new Date(notification.starttime).toLocaleString()}</p>
          <p>End Time: {new Date(notification.endtime).toLocaleString()}</p>
          <button onClick={() => deleteNotification(notification._id)}>Delete</button>
        </div>
      ))}
    </div>
  </>);
};

export default NotificationComponent;
