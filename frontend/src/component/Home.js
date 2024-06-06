

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, Modal } from '@mui/material';
import Cookies from 'js-cookie';

import axios from 'axios';
import "./Home.css";

import Navbar from "./Navbar.js"
import {useNavigate } from 'react-router-dom'



const Home = () => {
  const [adminuser, setadminUser] = useState(null);


  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notification,setNotification]=useState(0)

  const server=process.env.REACT_APP_SERVER_URL
  useEffect(() => {
    async function fetchData() {
      try { 
        
        const userData = localStorage.getItem('user');
         console.log('hello',JSON.parse(userData))
         setadminUser(JSON.parse(userData))
     const res = await axios.get(`${server}/api/auth/users`);
        setUsers(res.data);
        const noti=  await axios.get(`${server}/api/auth/notifications`)
        setNotification(noti.data.length)
       
        
       
      
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, [users,loading]);
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async () => {
    setLoading(true);
    console.log(newUser);

    try {
      await axios.post(`${server}/api/auth/register`, newUser);
    } catch (err) {
      console.log(err.message);
    }

    setLoading(false);
    setNewUser({
      username: '',
      email: '',
      password: '',
      phone: '',
      address: '',
    });

    // Refresh the user list
    try {
      const res = await axios.get(`${server}/api/auth/users`);
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${server}/api/auth/users/${deleteUserId}`);
      // Refresh the user list
      const res = await axios.get(`${server}/api/auth/users`);
      setUsers(res.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

const handleCloud=async()=>{

  try{
    await axios.post(`${server}/api/auth/message-queue-consume`);

  }catch(err)
  {

    console.log(err.message);
  }
}

  const openDeleteModal = (id) => {
    setDeleteUserId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteUserId(null);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      {loading ? (
        <div className="loading-container">
          <h1>Loading...</h1>
        </div>
      ) : (
        <>
        <Navbar></Navbar>
        <div className="homeClass">
          <div className="leftHome">
         
      <img src={adminuser?.picture} alt="User Profile" style={{ width: '200px', height: '200px' }} />
      <p>Name: {adminuser?.name}</p>
      <p>Email: {adminuser?.email}</p>
              <div className="two-buttons">
                
                <div className="hometab">
                <Button variant="contained"  onClick={handleCloud}>
                    Upload Screenshots
                  </Button>
                </div>
                <div className="hometab">
                  
                 
                  <Button variant="contained"  onClick={handleOpen}>
        + Add Employee
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle} className="FormBox">
          <Typography id="modal-title" variant="h6" component="h2">
            Add New Employee
          </Typography>
          <TextField
            label="Username"
            name="username"
            className="form"
            value={newUser.username}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            className="form"
            value={newUser.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            className="form"
            value={newUser.password}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            name="phone"
            className="form"
            value={newUser.phone}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            name="address"
            className="form"
            value={newUser.address}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button variant="contained" className="form" color="primary" onClick={handleAddUser} sx={{ mt: 2 }}>
            Add User
          </Button>
        </Box>
      </Modal>
                </div>

                
              </div>

           
          </div>
          <div className="rightHome">
            <Box mt={4}>
              <List>
                {users?.map((user, index) => (
                  <Box mt={4} key={index}>
                    <ListItem className="emp-box">
                      <div className="emp-button">
                        <Button variant="contained" onClick={() => openDeleteModal(user._id)}>
                          Delete
                        </Button>
                      </div>
                      {/* <div className="emp-det">
                        <ListItemText
                          primary={<p className="emp-name">Username: {user?.username}</p>}
                          secondary={
                            <>
                              <div className="emp-phone">Phone: {user?.phone}</div>
                              <div className="emp-email">Email: {user?.email}</div>
                              <div className="emp-address">Address: {user?.address}</div>
                              <div className="emp-profile">
                                <Link to={`/profile/${user?._id}`}>
                                  Profile
                                </Link>
                              </div>
                            </>
                          }
                        />
                      </div> */}
                        <div className="emp-det-card">
      <ListItemText
        primary={<p className="emp-name">Username: {user?.username}</p>}
        secondary={
          <>
            <div className="emp-phone">Phone: {user?.phone}</div>
            <div className="emp-email">Email: {user?.email}</div>
            <div className="emp-address">Address: {user?.address}</div>
            <div className="emp-profile">
              <Link to={`/profile/${user?._id}`}>
                Profile
              </Link>
            </div>
          </>
        }
      />
    </div>
                    </ListItem>
                  </Box>
                ))}
              </List>
            </Box>
          </div>
        </div>
      </>)
      
      }

      <Modal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        aria-labelledby="delete-confirmation-modal"
        aria-describedby="modal-to-confirm-deletion-of-user"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            outline: 'none',
          }}
        >
          <Typography id="delete-confirmation-modal" variant="h6" component="h2">
            Confirm Deletion
          </Typography>
          <Typography id="modal-to-confirm-deletion-of-user" sx={{ mt: 2 }}>
            Are you sure you want to delete this user?
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="contained" color="secondary" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="outlined" onClick={closeDeleteModal}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Home;