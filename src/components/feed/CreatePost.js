import { useState, useContext } from 'react';
import { storage, db } from '../../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';
import { IoArrowBack, IoImage } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // Create preview URLs
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls = await Promise.all(
        Array.from(files).map(async (file) => {
          const fileName = `post_${user.uid}_${Date.now()}`;
          const storageRef = ref(storage, `posts/${fileName}.png`);
          
          const uploadTask = uploadBytesResumable(storageRef, file);
          
          return new Promise((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
              },
              (error) => {
                console.error('Upload error:', error);
                reject(error);
              },
              async () => {
                const url = await getDownloadURL(storageRef);
                resolve(url);
              }
            );
          });
        })
      );

      // Create post document
      await addDoc(collection(db, 'posts'), {
        content,
        images: uploadedUrls,
        createdAt: new Date(),
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL
      });

      alert('Post created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/')}>
          <IoArrowBack size={24} />
        </BackButton>
        <Title>Create Post</Title>
        <PostButton 
          onClick={handleSubmit} 
          disabled={uploading || (!content && files.length === 0)}
        >
          {uploading ? 'Posting...' : 'Post'}
        </PostButton>
      </Header>

      <UserInfo>
        <ProfileImage 
          src={user?.profilePicture || user?.photoURL || "/default-profile.jpg"} 
          alt={user?.displayName} 
        />
        <UserName>{user?.displayName}</UserName>
      </UserInfo>

      <ContentArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        rows={5}
      />

      {previews.length > 0 && (
        <PreviewGrid>
          {previews.map((preview, index) => (
            <PreviewImage key={index} src={preview} alt={`Preview ${index + 1}`} />
          ))}
        </PreviewGrid>
      )}

      <UploadButton>
        <IoImage size={24} />
        <span>Add Photos</span>
        <FileInput
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
      </UploadButton>

      {uploading && <UploadProgress value={uploadProgress} max="100" />}
    </Container>
  );
};

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
`;

const PostButton = styled.button`
  background: black;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.span`
  font-weight: 600;
`;

const ContentArea = styled.textarea`
  width: 100%;
  border: none;
  resize: none;
  font-size: 16px;
  font-family: inherit;
  margin-bottom: 20px;
  
  &:focus {
    outline: none;
  }
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
`;

const PreviewImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
`;

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadProgress = styled.progress`
  width: 100%;
  height: 4px;
  margin: 10px 0;
  
  &::-webkit-progress-bar {
    background-color: #f0f0f0;
    border-radius: 2px;
  }
  
  &::-webkit-progress-value {
    background-color: #000;
    border-radius: 2px;
  }
`;

export default CreatePost; 