const axios = require('axios');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const keys = require('../config/keys');

// Generate Instagram OAuth URL
exports.getAuthUrl = (req, res) => {

  // Use the dynamically detected redirect URI
  const redirectUri = req.app.locals.instagramRedirectUri;
  console.log(redirectUri);

  const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=1736940180221584&redirect_uri=${redirectUri}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights`;
  
  res.json({ url: instagramAuthUrl });
};

// Handle Instagram callback
exports.handleCallback = async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is missing' });
  }
  
  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', {
      client_id: keys.INSTAGRAM_CLIENT_ID,
      client_secret: keys.INSTAGRAM_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: keys.REDIRECT_URI,
      code
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const { access_token, user_id } = tokenResponse.data;
    
    // Get user details from Instagram
    const userResponse = await axios.get(`https://graph.instagram.com/v22.0/me?fields=id,username,account_type&access_token=${access_token}`);
    
    const { id, username } = userResponse.data;
    
    // Get user profile picture and name
    const profileResponse = await axios.get(`https://graph.instagram.com/v22.0/${id}?fields=id,username,profile_picture_url,name&access_token=${access_token}`);
    
    // Find or create user in our file-based storage
    let user = userService.findUserByInstagramId(id);
    
    const userData = {
      instagramId: id,
      username,
      fullName: profileResponse.data.name || '',
      profilePicture: profileResponse.data.profile_picture_url || '',
      accessToken: access_token,
      tokenExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days
    };
    
    user = userService.saveUser(userData);
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, instagramId: user.instagramId },
      keys.JWT_SECRET,
      { expiresIn: '7d' }
    );
    const redirectUri = req.app.locals.appDomain;
    console.log('AppDomain',redirectUri, req.app.locals.instagramRedirectUri);
    
    // Redirect to frontend with token
    res.redirect(`${redirectUri}/auth/success?token=${token}`);
    
  } catch (error) {
    console.error('Instagram auth error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Verify user token
exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, keys.JWT_SECRET);
    const user = userService.findUserById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't send the access token to the client
    const { accessToken, ...userWithoutToken } = user;
    
    res.json({ user: userWithoutToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};