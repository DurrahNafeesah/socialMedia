import React from 'react';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

const Post = ({ post }) => {
  const images = post.images?.map(url => ({
    original: url,
    thumbnail: url
  }));

  return (
    <PostContainer>
      <PostHeader>
        <UserInfo>
          <UserImage src={post.userPhoto} alt={post.userName} />
          <UserName>{post.userName}</UserName>
        </UserInfo>
        <TimeStamp>
          {formatDistanceToNow(post.createdAt?.toDate(), { addSuffix: true })}
        </TimeStamp>
      </PostHeader>

      <PostContent>
        {post.text && <PostText>{post.text}</PostText>}
        
        {post.images && post.images.length > 0 && (
          <MediaContainer>
            <ImageGallery 
              items={images}
              showPlayButton={false}
              showFullscreenButton={true}
              showThumbnails={post.images.length > 1}
            />
          </MediaContainer>
        )}
        
        {post.video && (
          <MediaContainer>
            <video controls>
              <source src={post.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </MediaContainer>
        )}
      </PostContent>
    </PostContainer>
  );
};

const PostContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #333;
`;

const TimeStamp = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const PostContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PostText = styled.p`
  color: #333;
  line-height: 1.5;
`;

const MediaContainer = styled.div`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;

  video {
    width: 100%;
    max-height: 400px;
    object-fit: contain;
  }

  .image-gallery {
    width: 100%;
  }
`;

export default Post;
