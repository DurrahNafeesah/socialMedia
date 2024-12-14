import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { IoArrowBack, IoAdd } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa';
import Post from '../feed/Post';

const LoadingText = styled.p`
  text-align: center;
  color: #666;
  font-size: 14px;
  padding: 20px;
`;

const NoPostsMessage = styled.p`
  text-align: center;
  color: #666;
  font-size: 14px;
  padding: 20px;
`;

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      const postsQuery = query(
        collection(db, 'posts'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserPosts(posts);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <ProfileContainer>
      <BackButton onClick={() => navigate(-1)}>
        <IoArrowBack size={24} />
      </BackButton>

      <HeaderSection>
        <CoverImage src={user?.coverImage || "/images/default-background.jpg"} alt="Cover" />
        
        <ProfileImageContainer>
          <ProfilePicture 
            src={user?.profilePicture || user?.photoURL || "/images/default-profile.jpg"} 
            alt="Profile"
          />
          <EditButton onClick={() => navigate('/profile/edit')}>
            Edit Profile
          </EditButton>
        </ProfileImageContainer>

      
        
        <UserInfoSection>
          <ProfileName>{user?.displayName || "No Name"}</ProfileName>
          <ProfileBio>
            {user?.bio || "No Bio"}
          </ProfileBio>
        </UserInfoSection>
      </HeaderSection>

      <PostsSection>
        <PostsHeader>My Posts</PostsHeader>
        <PostsGrid>
          {loading ? (
            <LoadingText>Loading posts...</LoadingText>
          ) : userPosts.length === 0 ? (
            <NoPostsMessage>No posts yet</NoPostsMessage>
          ) : (
            userPosts.map(post => (
              <PostCard key={post.id}>
                <PostImage src={post.imageUrl} alt={post.title} />
                <PostOverlay>
                  <PostTitle>{post.title}</PostTitle>
                  <LikeCount>❤️ {post.likes}</LikeCount>
                </PostOverlay>
              </PostCard>
            ))
          )}
        </PostsGrid>
      </PostsSection>

      <CreatePostButton onClick={() => navigate('/create')}>
        <FaPlus />
      </CreatePostButton>
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  width: 100%;
  background: white;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
`;

const BackButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  background: transparent;
  border: none;
  color: black;
  z-index: 100;
  cursor: pointer;
`;

const HeaderSection = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 20px;
`;

const CoverImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 0 0 12px 12px;
`;

const ProfileStats = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const StatText = styled.span`
  color: #666;
  font-size: 12px;
`;

const UserInfoSection = styled.div`
  margin-top: 40px;
  padding: 15px 20px;
`;

const ProfileName = styled.h1`
  font-size: 20px;
  font-weight: 700;
  text-align: left;
  color: #000;
  top: 10px;
  margin-bottom: 8px;
`;

const ProfileBio = styled.p`
  font-size: 14px;
  color: #666;
  line-height:1.2;
`;

const PostsSection = styled.div`
  padding: 0 20px;
`;

const PostsHeader = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin: 20px 0;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const PostCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
`;

const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PostOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: white;
`;

const PostTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const LikeCount = styled.span`
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ProfileImageContainer = styled.div`
  position: absolute;
  top: 100px;
  left: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const ProfilePicture = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const EditButton = styled.button`
 position: absolute;
  top: 60px; /* Below background image */
  left: 140px; /* Right side of profile image (profile image width + left margin + gap) */
  background: white;
  color: black;
  width: 200%;

  border: 1px solid black;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;

  &:hover {
    background: rgb(255, 206, 243);
    transform: translateY(-2px);
  }
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

export default UserProfile; 