import { useState } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';

export const useInfiniteScroll = () => {
  const [posts, setPosts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const postsQuery = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc || 0),
        limit(20)
      );

      const snapshot = await getDocs(postsQuery);
      const newPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPosts(prev => [...prev, ...newPosts]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === 20);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return { posts, loading, hasMore, loadPosts };
};
