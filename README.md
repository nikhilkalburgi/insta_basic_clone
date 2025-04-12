# Instagram API Integration App

A full-stack web application that integrates with the Instagram Basic Display API to allow users to view their Instagram profiles, media, and interact with content through a clean, modern interface.

## 🚀 Introduction

This application demonstrates integration with the Instagram Basic Display API, allowing users to authenticate with their Instagram accounts, view their profiles, and browse their media content. The app features a responsive design and provides a seamless user experience for interacting with Instagram content.

## ✨ Features

- **Instagram Authentication**: Secure login with Instagram OAuth
- **User Profile Display**: View Instagram profile information
- **Media Feed**: Browse through Instagram posts, images, and videos
- **Comment System**: View and add comments on media posts
- **Responsive Design**: Modern UI that works across devices

## 💻 Tech Stack

### Frontend
- **React**: UI library for building the user interface
- **React Router**: For client-side routing
- **Styled Components**: For component-level styling
- **Axios**: For API requests

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **JSON Web Tokens (JWT)**: For secure authentication
- **Instagram Basic Display API**: For accessing Instagram data

### Development & Deployment
- **Git**: Version control
- **Heroku**: Cloud platform for hosting the application
- **dotenv**: For environment variable management

## 🌐 Live Demo

The application is deployed on Heroku and can be accessed at:
[https://instaclonebasic-e19a75004de6.herokuapp.com/](https://instaclonebasic-e19a75004de6.herokuapp.com/)

**Note**: Due to Heroku's dynamic domain assignment, the actual URL may include a unique identifier.

## 📥 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git
- Instagram Basic Display API credentials

### Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/instagram-api-integration.git

# Navigate to the project directory
cd instagram-api-integration
```

### Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Setup

1. Create a `.env` file in the backend directory:

```bash
cd ../backend
touch .env
```

2. Add the following environment variables to the `.env` file:

```
PORT=5000
JWT_SECRET=your_jwt_secret_key
INSTAGRAM_CLIENT_ID=your_instagram_app_id
INSTAGRAM_CLIENT_SECRET=your_instagram_app_secret
REDIRECT_URI=http://localhost:5000/api/auth/instagram/callback
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## ▶️ Running the App


### Production Mode

To run the app in production mode locally:

```bash
# Build the frontend
cd frontend
npm run build

# Start the server (from the backend directory)
cd ../backend
npm start
```

The application will be available at [http://localhost:5000](http://localhost:5000)


## 📁 Project Structure

```
instagram-api-integration/
├── backend/                 # Backend Node.js/Express server
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Express middleware
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── config/              # Configuration files
│   ├── data/                # Data storage (for development)
│   ├── .env                 # Environment variables
│   └── server.js            # Server entry point
├── frontend/                # React frontend
│   ├── public/              # Static files
│   ├── src/                 # Source files
│   │   ├── components/      # React components
│   │   ├── context/         # React context providers
│   │   ├── services/        # API services
│   │   ├── styles/          # Global styles
│   │   ├── App.js           # Main App component
│   │   └── index.js         # Entry point
│   └── package.json         # Frontend dependencies
├── package.json             # Root package.json for Heroku
└── README.md                # Project documentation
```
---

Created with ❤️ by Nikhil S Kalburgi
