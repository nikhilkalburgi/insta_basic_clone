const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/feed', require('./routes/feedRoutes'));

// Middleware to detect and store the app's domain
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    // Get the host from the request headers
    const host = req.get('Host');
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const appDomain = `${protocol}://${host}`;
    
    // Store it for use throughout the app
    app.locals.appDomain = appDomain;
    
    // Also store the redirect URI specifically for Instagram
    app.locals.instagramRedirectUri = `${appDomain}/api/auth/instagram/callback`;
    
    console.log(`Detected app domain: ${appDomain}`);
    console.log(`Instagram redirect URI: ${app.locals.instagramRedirectUri}`);
  } else {
    // For development
    app.locals.appDomain = 'http://localhost:5000';
    app.locals.instagramRedirectUri = 'http://localhost:5000/api/auth/instagram/callback';
  }
  next();
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*path', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));