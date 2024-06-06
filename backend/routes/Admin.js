require('dotenv').config();
const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const Admin = require('../models/Admin');

const router = express.Router();

const config = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  redirectUrl: process.env.REDIRECT_URL,
  clientUrl: process.env.CLIENT_URL,
  tokenSecret: process.env.TOKEN_SECRET,
  tokenExpiration: 60000*60,
  postUrl: 'https://jsonplaceholder.typicode.com/posts',
};

const getAuthParams = () => {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUrl,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',
    state: 'standard_oauth',
    prompt: 'consent',
  });
  return params.toString();
};

const getTokenParams = (code) => {
  const params = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: config.redirectUrl,
  });
  return params.toString();
};


router.get('/auth/url', (_, res) => {
  res.json({
    url: `${config.authUrl}?${getAuthParams()}`,
  });
});

router.get('/auth/token', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ message: 'Authorization code must be provided' });
  try {
    const tokenParam = getTokenParams(code);
    const { data: { id_token } } = await axios.post(`${config.tokenUrl}?${tokenParam}`);
    if (!id_token) return res.status(400).json({ message: 'Auth error' });

    const { email, name, picture } = jwt.decode(id_token);
    const user = { name, email, picture };

    const token = jwt.sign({ user }, config.tokenSecret, { expiresIn: config.tokenExpiration });
    res.cookie('token', token, { maxAge: config.tokenExpiration, httpOnly: true });
    console.log("token",token)

    res.status(201).json({ user });
  } catch (err) {
    console.error('Error: ', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

router.get('/auth/logged_in', async (req, res) => {
  try {
    
    const token = req.cookies.token;
    if (!token) return res.json({ loggedIn: false });

    const { user } = jwt.verify(token, config.tokenSecret);
   
    const admin = await Admin.findOne( { email: user.email } );
   

    const alladmins=await Admin.find();
   
    if (!admin) return res.json({ loggedIn: false });

    const newToken = jwt.sign({ user }, config.tokenSecret, { expiresIn: config.tokenExpiration });
    res.cookie('token', newToken, { maxAge: config.tokenExpiration, httpOnly: true });
    res.status(200).json({ loggedIn: true, user });
  } catch (err) {
    res.json({ loggedIn: false });
  }
});

router.post('/auth/logout', (_, res) => {
  res.clearCookie('token').json({ message: 'Logged out' });
});

router.post('/addadmin', async (req, res) => {
  const { email ,username } = req.body;
  
  try {

    const token = req.cookies.token;
  
    if (!token) return res.json({ loggedIn: false });

    const { user } = jwt.verify(token, config.tokenSecret);

    if(!user || user.isAdmin==false)
    {
      return res.status(401).json({ message: 'Unauthorized' });
    }
     
    const admin = new Admin({ email, username,  });
    
    await admin.save();
    res.status(201).json({ message: 'Admin added successfully' });

  }
  catch(err)
  {
    res.status(500).json({ message: err.message || 'Server error' });
  }

})

router.post('/superadmin',async(req,res)=>{

  const { email ,username ,isAdmin} = req.body;

  try{

    const admin = new Admin({ email, username,isAdmin:true  });
    
    await admin.save();

    res.status(200).json(admin)

  }catch(err)
  {
    res.status(500).json({ message: err.message || 'Server error' });

  }
  



})


router.get('/alladmins',async (req,res)=>{
  try {
   

    const alladmins=await Admin.find();
    res.status(200).json(alladmins);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }

}
)


router.delete('/deleteadmin/:id',async (req,res)=>{
  try {
    const token = req.cookies.token;
    if (!token) return res.json({ loggedIn: false });

    const { user } = jwt.verify(token, config.tokenSecret);
    const { id } = req.params;
   const admin = await Admin.findOne( { email: user.email } )
  const deleting=await Admin.findById(id)
   console.log(admin)
   console.log(user)
    if(!user || admin.isAdmin==false ||deleting.isAdmin==true)
    {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    await Admin.findByIdAndDelete(id);
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'delete nhi hua' });
  }
}
)

module.exports = router;
