
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import {useNavigate } from 'react-router-dom'
// import Badge from '@mui/material/Badge';
// import "./Navbar.css"
// const Navbar = () => {
//     const navigate = useNavigate();
//     const [notification,setNotification]=useState(0)
//     const [loading, setLoading] = useState(true);
//     const server=process.env.REACT_APP_SERVER_URL
//   useEffect(() => {
//     async function fetchData() {
//       try { 
 
//         const noti=  await axios.get(`${server}/api/auth/notifications`)
//         setNotification(noti.data.length)
       
        
       
      
//         setLoading(false);
//       } catch (err) {
//         console.log(err);
//       }
//     }

//     fetchData();
//   }, [loading]);
//   return (
//     <div className="navbar">
//       navbar   <Badge badgeContent={notification} color="primary"><NotificationsIcon onClick={() => navigate('/notification')}/></Badge> 
//     </div>
//   )
// }

// export default Navbarimport React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

const pages = ['Home', 'AddAdmin'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(0);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const server = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    async function fetchData() {
      try {
        const noti = await axios.get(`${server}/api/auth/notifications`);
        setNotification(noti.data.length);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigate = (page) => {
    navigate(`/${page}`);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'rgb(37, 54, 48)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Badge badgeContent={notification} color="secondary">
            <NotificationsIcon onClick={() => navigate('/notification')} />
          </Badge>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: 'flex',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              paddingLeft: '2rem',
            }}
          >
            JYTHU
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleNavigate(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
