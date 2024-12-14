import { useEffect } from 'react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import Post from './Post';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';

const PostList = () => {
  const { posts, loading, hasMore, loadPosts } = useInfiniteScroll();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasMore) {
      loadPosts();
    }
  }, [inView, hasMore, loadPosts]);

  return (
    <PostListContainer>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {loading && <LoadingMessage>Loading more posts...</LoadingMessage>}
      <div ref={ref} style={{ height: '20px' }} />
    </PostListContainer>
  );
};

const PostListContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
`;

export default PostList; 