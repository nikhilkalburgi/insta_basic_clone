const axios = require('axios');
const userService = require('../services/userService');

// Get user profile data
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = userService.findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get additional profile data from Instagram if needed
    try {
      const response = await axios.get(`https://graph.instagram.com/v22.0/me?fields=id,username,account_type,media_count&access_token=${user.accessToken}`);
      
      const profileData = {
        ...user,
        mediaCount: response.data.media_count || 0,
        accountType: response.data.account_type || 'personal'
      };
      
      // Don't send access token to client
      const { accessToken, ...safeProfileData } = profileData;
      
      res.json({ profile: safeProfileData });
    } catch (error) {
      // If Instagram API fails, return basic profile
      const { accessToken, ...safeProfileData } = user;
      res.json({ profile: safeProfileData });
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile data' });
  }
};