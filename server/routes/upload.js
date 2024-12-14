import axios from 'axios';
import { checkConnection } from '../config/mongodb';

export const uploadImage = async (file, type, userId) => {
  try {
    // Check connection before attempting upload
    const isConnected = await checkConnection();
    if (!isConnected) {
      throw new Error('MongoDB is not connected');
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    formData.append('userId', userId);

    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload Progress: ${percentCompleted}%`);
      }
    });

    return response.data.imageUrl;
  } catch (error) {
    console.error('Upload Error:', error.message);
    throw new Error(error.message || 'Failed to upload image');
  }
}; 