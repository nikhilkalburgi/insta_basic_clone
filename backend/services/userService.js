const fs = require('fs');
const path = require('path');

// Path to our JSON file that will act as our database
const dbPath = path.join(__dirname, '../data/users.json');

// Ensure the data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([]));
  }
};

// Get all users
const getUsers = () => {
  ensureDataDir();
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

// Save users to file
const saveUsers = (users) => {
  ensureDataDir();
  fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
};

// Find user by Instagram ID
const findUserByInstagramId = (instagramId) => {
  const users = getUsers();
  return users.find(user => user.instagramId === instagramId);
};

// Find user by ID
const findUserById = (id) => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

// Create or update user
const saveUser = (userData) => {
  const users = getUsers();
  const existingUserIndex = users.findIndex(user => user.instagramId === userData.instagramId);
  
  if (existingUserIndex >= 0) {
    // Update existing user
    users[existingUserIndex] = {
      ...users[existingUserIndex],
      ...userData,
      updatedAt: new Date().toISOString()
    };
  } else {
    // Create new user
    users.push({
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  saveUsers(users);
  return existingUserIndex >= 0 ? users[existingUserIndex] : users[users.length - 1];
};

module.exports = {
  findUserByInstagramId,
  findUserById,
  saveUser
};