import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaPlus } from 'react-icons/fa';
import Post from './Post';

const Feed = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // eslint-disable-next-line no-unused-vars
//   const formatTime = (date) => {
//     return formatDistanceToNow(new Date(date), { addSuffix: true });
//   };

  return (
    <FeedContainer>
      <WelcomeSection onClick={() => navigate('/profile')}>
        <ProfileImage 
          src={user?.profilePicture || user?.photoURL || "/images/default-profile.jpg"} 
          alt="Profile" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/default-profile.jpg";
          }}
        />
        <WelcomeContainer>
          <WelcomeText>Welcome back</WelcomeText>
          <UserName>{user?.displayName || "User"}</UserName>
        </WelcomeContainer>
       
      </WelcomeSection>
      <TagText>Feeds</TagText>

      <PostsContainer>
        
        {loading ? (
          <LoadingText>Loading posts...</LoadingText>
        ) : posts.length === 0 ? (
          <NoPostsMessage>No posts yet. Be the first to share!</NoPostsMessage>
        ) : (
          posts.map(post => <Post key={post.id} post={post} />)
        )}
      </PostsContainer>

      <CreatePostButton onClick={() => navigate('/create')}>
        <FaPlus />
      </CreatePostButton>
    </FeedContainer>
  );
};

const FeedContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  min-height: 100vh;
`;
const TagText = styled.span`
  width: 68px;
  height: 28px;
  top: 70px;
  gap: 0px;
  font-size: 19px;
  color: black;
  font-weight: 600;
  margin-top: 70px;
  margin-left: 0px;
  padding-left: 2px;
  display: block;
   display: flex;
  flex-direction: column;
`;
const WelcomeSection = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: fixed;
  top: 5px;
  left: 5px;
  right: 5px;
  gap: 10px;
  padding: 10px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.2s;
  border-radius: 20px;

  &:hover {
  background:  rgb(255, 206, 243);
    transform: translateY(-2px);
  }
`;

const ProfileImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
`;

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  
`;

const WelcomeText = styled.span`
  font-size: 10px;
  color: gray;
  display: block;
`;

const UserName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: black;
  display: block;
`;

const PostsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-left: 0px;
  margin-right: 0px;
  right: 0px;
  left: 0px;
`;

const LoadingText = styled.p`
  text-align: center;
  color: #666;
  padding: 20px;
   margin-left: 0px;
  margin-right: 0px;
  right: 0px;
  left: 0px;
`;

const NoPostsMessage = styled.p`
  text-align: center;
  color: #666;
  padding: 40px;
  top: 200px;
  background: white;
  border-radius: 12px;
   margin-left: 0px;
  margin-right: 0px;
  right: 0px;
  left: 0px;
`;

const CreatePostButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: black;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

export default Feed; 