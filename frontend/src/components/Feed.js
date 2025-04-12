import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FaHeart, FaComment, FaSpinner, FaImage, FaVideo } from 'react-icons/fa';

// Add these styled components
const CommentSection = styled.div`
  padding: 16px;
  border-top: 1px solid #efefef;
  max-height: 300px;
  overflow-y: auto;
`;

const CommentItem = styled.div`
  margin-bottom: 12px;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const CommentUsername = styled.span`
  font-weight: 600;
  margin-right: 8px;
`;

const CommentText = styled.span`
  word-break: break-word;
`;

const CommentTime = styled.span`
  color: #8e8e8e;
  font-size: 12px;
`;

const CommentForm = styled.form`
  display: flex;
  padding: 16px;
  border-top: 1px solid #efefef;
`;

const CommentInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 8px 0;
  font-size: 14px;
  
  &::placeholder {
    color: #8e8e8e;
  }
`;

const CommentButton = styled.button`
  background: none;
  border: none;
  color: #0095f6;
  font-weight: 600;
  cursor: pointer;
  padding: 0 8px;
  
  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;

const ReplyButton = styled.button`
  background: none;
  border: none;
  color: #8e8e8e;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 0;
  margin-top: 4px;
`;

const ReplySection = styled.div`
  margin-left: 20px;
  padding-left: 10px;
  border-left: 1px solid #efefef;
`;

const ReplyForm = styled.form`
  display: flex;
  margin-top: 8px;
  margin-bottom: 16px;
`;

const FeedContainer = styled.div`
  max-width: 935px;
  margin: 0 auto;
  padding: 20px;
`;

const FeedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  
  @media (max-width: 735px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 3px;
  }
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const MediaCard = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* Square aspect ratio */
  background-color: #fafafa;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  
  &:hover .overlay {
    opacity: 1;
  }
`;

const MediaImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MediaOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  color: white;
`;

const MediaTypeIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
  font-size: 20px;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
`;

const MediaStats = styled.div`
  display: flex;
  gap: 20px;
`;

const MediaStat = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-weight: 600;
`;

const LoadingSpinner = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  font-size: 2rem;
  color: #e1306c;
  margin: 50px auto;
  display: block;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyFeed = styled.div`
  text-align: center;
  padding: 50px 0;
  color: #8e8e8e;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  color: #ed4956;
  text-align: center;
  margin: 50px 0;
  font-size: 16px;
`;

const MediaModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  max-width: 935px;
  max-height: 90vh;
  width: 90%;
  background-color: white;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  
  @media (max-width: 735px) {
    flex-direction: column;
    max-height: 80vh;
  }
`;

const ModalMedia = styled.div`
  flex: 1;
  min-height: 450px;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img, video {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const ModalInfo = styled.div`
  width: 335px;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 735px) {
    width: 100%;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #efefef;
`;

const ModalCaption = styled.div`
  padding: 16px;
  flex: 1;
  overflow-y: auto;
`;

const ModalClose = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
`;

const Feed = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  // New state variables for comments
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  
  const commentInputRef = useRef(null);
  
  
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('/api/feed', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data);
        setMedia(response.data.media);
      } catch (err) {
        console.error('Error fetching feed:', err);
        setError('Failed to load Instagram feed. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeed();
  }, []);

  // New function to fetch comments when a media item is selected
  const fetchComments = async (mediaId) => {
    setLoadingComments(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`/api/feed/media/${mediaId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data)
      setComments(response.data.comments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };
  
  // Update the openModal function to fetch comments
  const openModal = (item) => {
    setSelectedMedia(item);
    document.body.style.overflow = 'hidden';
    fetchComments(item.id);
  };
  
  // Function to handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post(`/api/feed/media/${selectedMedia.id}/comments`, 
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Refetch comments to show the new comment
      fetchComments(selectedMedia.id);
      setCommentText('');
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };
  
  // Function to handle reply submission
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    if (!replyText.trim() || !replyingTo) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post(`/api/feed/comments/${replyingTo}/replies`, 
        { text: replyText },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Refetch comments to show the new reply
      fetchComments(selectedMedia.id);
      setReplyText('');
      setReplyingTo(null);
    } catch (err) {
      console.error('Error posting reply:', err);
    }
  };
  
  // Function to start replying to a comment
  const startReply = (commentId) => {
    setReplyingTo(commentId);
    // Focus on the reply input after a short delay to allow the form to render
    setTimeout(() => {
      const replyInput = document.getElementById(`reply-input-${commentId}`);
      if (replyInput) replyInput.focus();
    }, 100);
  };
  
  // Function to cancel replying
  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };
  
  const closeModal = () => {
    setSelectedMedia(null);
    document.body.style.overflow = 'auto';
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }
  
  if (media.length === 0) {
    return <EmptyFeed>No posts to show</EmptyFeed>;
  }
  
  return (
    <FeedContainer>
      <FeedGrid>
        {media.map(item => (
          <MediaCard key={item.id} onClick={() => openModal(item)}>
            <MediaImage 
              src={item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url} 
              alt={item.caption || 'Instagram post'} 
            />
            
            <MediaTypeIcon>
              {item.media_type === 'VIDEO' && <FaVideo />}
              {item.media_type === 'CAROUSEL_ALBUM' && <FaImage />}
            </MediaTypeIcon>
            
            <MediaOverlay className="overlay">
              <MediaStats>
                <MediaStat>
                  <FaHeart /> --
                </MediaStat>
                <MediaStat>
                  <FaComment /> --
                </MediaStat>
              </MediaStats>
            </MediaOverlay>
          </MediaCard>
        ))}
      </FeedGrid>
      
      {selectedMedia && (
        <MediaModal onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
          <ModalMedia>
              {selectedMedia.media_type === 'VIDEO' ? (
                <video controls>
                  <source src={selectedMedia.media_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img 
                  src={selectedMedia.media_url} 
                  alt={selectedMedia.caption || 'Instagram post'} 
                />
              )}
            </ModalMedia>
            
            <ModalInfo>
              <ModalHeader>
                <div>
                  {new Date(selectedMedia.timestamp).toLocaleDateString()}
                </div>
              </ModalHeader>
              <ModalCaption>
                {selectedMedia.caption || 'No caption'}
              </ModalCaption>
              
              {/* Comment section */}
              <CommentSection>
                {loadingComments ? (
                  <LoadingSpinner style={{ fontSize: '1rem', margin: '20px auto' }} />
                ) : comments.length > 0 ? (
                  comments.map(comment => (
                    <CommentItem key={comment.id}>
                      <CommentHeader>
                        <div>
                          <CommentUsername>{comment.username}</CommentUsername>
                          <CommentText>{comment.text}</CommentText>
                        </div>
                        <CommentTime>
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </CommentTime>
                      </CommentHeader>
                      
                      <ReplyButton onClick={() => startReply(comment.id)}>
                        Reply
                      </ReplyButton>
                      
                      {/* Reply form */}
                      {replyingTo === comment.id && (
                        <ReplyForm onSubmit={handleReplySubmit}>
                          <CommentInput
                            id={`reply-input-${comment.id}`}
                            type="text"
                            placeholder="Reply to comment..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <CommentButton type="submit" disabled={!replyText.trim()}>
                            Post
                          </CommentButton>
                          <CommentButton type="button" onClick={cancelReply}>
                            Cancel
                          </CommentButton>
                        </ReplyForm>
                      )}
                      
                      {/* Display replies if any */}
                      {comment.replies && comment.replies.length > 0 && (
                        <ReplySection>
                          {comment.replies.map(reply => (
                            <CommentItem key={reply.id}>
                              <CommentHeader>
                                <div>
                                  <CommentUsername>{reply.username}</CommentUsername>
                                  <CommentText>{reply.text}</CommentText>
                                </div>
                                <CommentTime>
                                  {new Date(reply.timestamp).toLocaleDateString()}
                                </CommentTime>
                              </CommentHeader>
                            </CommentItem>
                          ))}
                        </ReplySection>
                      )}
                    </CommentItem>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', color: '#8e8e8e' }}>
                    No comments yet
                  </div>
                )}
              </CommentSection>
              
              {/* Comment form */}
              <CommentForm onSubmit={handleCommentSubmit}>
                <CommentInput
                  ref={commentInputRef}
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <CommentButton type="submit" disabled={!commentText.trim()}>
                  Post
                </CommentButton>
              </CommentForm>
            </ModalInfo>
          </ModalContent>
          <ModalClose onClick={closeModal}>×</ModalClose>
        </MediaModal>
      )}
    </FeedContainer>
  );
};

export default Feed;