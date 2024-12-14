import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export const useAutoPlayVideo = (videoRef, containerRef) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (!videoRef?.current) return;

    if (inView) {
      videoRef.current.play().catch((error) => {
        console.log('Autoplay failed:', error);
      });
    } else {
      videoRef.current.pause();
    }
  }, [inView, videoRef]);

  useEffect(() => {
    if (containerRef.current) {
      ref(containerRef.current);
    }
  }, [containerRef, ref]);
}; 