import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './Dashboard';
import FileListTable from './FileListTable';
import FileDetailsChart from './FileDetailsChart';
import './Profile.css';
import AddAttendence from './AddAttendence';
import Navbar from './Navbar'
import AggregateRating from './AggregateRating';
const Profile = () => {
 
  const { id } = useParams();
 
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
const server=process.env.REACT_APP_SERVER_URL
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`${server}/api/auth/users/${id}`);
      setUser(response.data);
      setLoading(false);
      console.log(user);
    }

    fetchData();
  }, [id,user]);

  return (
    <div className="profile-container">
      {loading ? (
        <div className="loading-container">
          <h1>Loading...</h1>
        </div>
      ) : (
        <>
         <Navbar />
        <div className="profile">
            <div className="left">
              <div className="det">
              <h4>Username : {user?.username}</h4>
          <h4>Email : {user?.email}</h4>
          <h4>Phone : {user?.phone}</h4>
          <h4>Address : {user?.address}</h4>
          <AggregateRating data={user?.attendance_rating} />

              </div>
           
              
          

            </div>
            <div className="right">
            <AddAttendence id={user?._id} />
            </div>
          
        </div>
          <div className="togetherprofile">
          <Dashboard attendanceRating={user?.attendance_rating} />
          <FileListTable id={user?._id} />
          <FileDetailsChart data={user?.dailyworking} />
          </div>
         
        </>
      )}
    </div>
  );
}

export default Profile;
