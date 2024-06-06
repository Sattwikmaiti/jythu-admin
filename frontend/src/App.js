import React, { useEffect, useRef, useState, createContext, useContext, useCallback } from 'react';
import { RouterProvider, createBrowserRouter, useNavigate, Navigate } from 'react-router-dom';
import OneLogin from './component/OneLogin';
import Home from './component/Home';
import Profile from './component/Profile';
import NotFound from './component/NotFound'; // Assuming you have a NotFound component
import axios from 'axios';
import Notification from './component/Notification';
import AddAdmin from './component/AddAdmin';
import Cookies from 'js-cookie';

axios.defaults.withCredentials = true;
const serverUrl = process.env.REACT_APP_SERVER_URL;

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(null);
  const [user, setUser] = useState(null);

  const checkLoginState = useCallback(async () => {
    try {
      const { data: { loggedIn: logged_in, user } } = await axios.get(`${serverUrl}/api/admin/auth/logged_in`);
      setLoggedIn(logged_in);
      user && setUser(user);
    } catch (err) {
      console.error("Axios",err);
    }
  }, []);

  useEffect(() => {
    checkLoginState();
  }, [checkLoginState]);

  return <AuthContext.Provider value={{ loggedIn, checkLoginState, user }}>{children}</AuthContext.Provider>;
};

const Callback = () => {
  const called = useRef(false);
  const { checkLoginState, loggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      if (loggedIn === false) {
        try {
          if (called.current) return; // prevent rerender caused by StrictMode
          called.current = true;
          const res = await axios.get(`${serverUrl}/api/admin/auth/token${window.location.search}`);
          console.log('response: ', res.data.user);
      localStorage.setItem('user',JSON.stringify(res.data.user)) // Expires in 7 days


          checkLoginState();
          navigate('/');
        } catch (err) {
          console.error(err);
          navigate('/');
        }
      } else if (loggedIn === true) {
        navigate('/');
      }
    })();
  }, [checkLoginState, loggedIn, navigate]);
  return <></>;
};

const ProtectedRoute = ({ element }) => {
  const { loggedIn } = useContext(AuthContext);
  if (loggedIn === null) return <></>; // or a loading indicator
  return loggedIn ? element : <Navigate to="/404" replace />;
};
const Window = () => {
  const { loggedIn } = useContext(AuthContext);
  if (loggedIn === true) return <Home />;
  if (loggedIn === false) return <OneLogin />;
  return <></>;
};


const router = createBrowserRouter([
  {
    path: '/',
    element: <Window />,
  },
  {
    path: '/Home',
    element: <Home />,
  },
  {
    path: '/auth/callback',
    element: <Callback />,
  },
  {
    path: '/profile/:id',
    element: <ProtectedRoute element={<Profile />} />,
  },
  {
    path: '/404',
    element: <NotFound />,
  },
  {
    path:'/notification',
    element:<Notification/>
  },
  {
    path:'/addAdmin',
    element:<AddAdmin/>
  },
  {
    path:'/AddAdmin',
    element:<AddAdmin/>

  }
]);


function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
