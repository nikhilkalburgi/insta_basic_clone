// controllers/feedController.js
const axios = require('axios');
const userService = require('../services/userService');

// Get user media feed
exports.getUserFeed = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = userService.findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get user media from Instagram
    try {
      // First, get the user's media IDs
      const mediaResponse = await axios.get(
        `https://graph.instagram.com/v22.0/me/media?fields=id,caption&access_token=${user.accessToken}`
      );
      
      const mediaItems = mediaResponse.data.data || [];
      
      if (mediaItems.length === 0) {
        return res.json({ media: [] });
      }
      
      // For each media ID, get detailed information
      const mediaDetailsPromises = mediaItems.map(item => 
        axios.get(`https://graph.instagram.com/v22.0/${item.id}?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${user.accessToken}`)
      );
      
      const mediaDetailsResponses = await Promise.all(mediaDetailsPromises);
      const mediaDetails = mediaDetailsResponses.map(response => response.data);
      
      res.json({ media: mediaDetails });
    } catch (error) {
      console.error('Instagram media fetch error:', error.response?.data || error);
      res.status(500).json({ error: 'Failed to fetch Instagram media' });
    }
  } catch (error) {
    console.error('Feed fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch feed data' });
  }
};

// Get media comments
exports.getMediaComments = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = userService.findUserById(userId);
    const mediaId = req.params.mediaId;
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    try {
      const commentsResponse = await axios.get(
        `https://graph.instagram.com/v22.0/${mediaId}/comments?fields=id,text,timestamp,username&access_token=${user.accessToken}`
      );
      
      console.log(commentsResponse.data);
      const comments = commentsResponse.data.data || [];
      // For each comment, fetch replies if available
      const commentsWithRepliesPromises = comments.map(async (comment) => {
        try {
          const repliesResponse = await axios.get(
            `https://graph.instagram.com/v22.0/${comment.id}/replies?fields=id,text,timestamp,username&access_token=${user.accessToken}`
          );
          
          return {
            ...comment,
            replies: repliesResponse.data.data || []
          };
        } catch (error) {
            console.log(error);
          // If replies endpoint fails, return comment without replies
          return {
            ...comment,
            replies: []
          };
        }
      });
      
      const commentsWithReplies = await Promise.all(commentsWithRepliesPromises);
      res.json({ comments: commentsWithReplies });
    } catch (error) {
      console.error('Instagram comments fetch error:', error.response?.data || error);
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  } catch (error) {
    console.error('Comments fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Post a comment
exports.postComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = userService.findUserById(userId);
    const mediaId = req.params.mediaId;
    const { text } = req.body;
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }
    
    try {
      const commentResponse = await axios.post(
        `https://graph.instagram.com/v22.0/${mediaId}/comments`,
        null,
        {
          params: {
            message: text,
            access_token: user.accessToken
          }
        }
      );
      console.log('Post Comment: ', commentResponse.data)
      // Get the newly created comment details
      const newCommentId = commentResponse.data.id;
      const newCommentResponse = await axios.get(
        `https://graph.instagram.com/v22.0/${newCommentId}?fields=id,text,timestamp,username&access_token=${user.accessToken}`
      );
      console.log('Per Comment', newCommentResponse.data)
      res.json({ success: true, comment: newCommentResponse.data });
    } catch (error) {
      console.error('Instagram comment post error:', error.response?.data || error);
      res.status(500).json({ error: 'Failed to post comment' });
    }
  } catch (error) {
    console.error('Comment post error:', error);
    res.status(500).json({ error: 'Failed to post comment' });
  }
};

// Reply to a comment
exports.replyToComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = userService.findUserById(userId);
    const commentId = req.params.commentId;
    const { text } = req.body;
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!text) {
      return res.status(400).json({ error: 'Reply text is required' });
    }
    
    try {
      const replyResponse = await axios.post(
        `https://graph.instagram.com/v22.0/${commentId}/replies`,
        null,
        {
          params: {
            message: text,
            access_token: user.accessToken
          }
        }
      );
      
      // Get the newly created reply details
      const newReplyId = replyResponse.data.id;
      const newReplyResponse = await axios.get(
        `https://graph.instagram.com/v22.0/${newReplyId}?fields=id,text,timestamp,username&access_token=${user.accessToken}`
      );
      
      res.json({ success: true, reply: newReplyResponse.data });
    } catch (error) {
      console.error('Instagram reply post error:', error.response?.data || error);
      res.status(500).json({ error: 'Failed to post reply' });
    }
  } catch (error) {
    console.error('Reply post error:', error);
    res.status(500).json({ error: 'Failed to post reply' });
  }
};