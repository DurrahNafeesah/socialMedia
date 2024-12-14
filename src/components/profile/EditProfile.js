import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';
import { IoArrowBack, IoCamera } from 'react-icons/io5';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUserContext } = useContext(AuthContext);
  const [name, setName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) {
        alert("Please select an image.");
        return;
      }

      setLoading(true);
      try {
        const fileName = `${type}_${user.uid}_${Date.now()}`;
        const storageRef = ref(storage, `images/${type}/${fileName}.png`);
        
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload progress:', progress);
          },
          (error) => {
            console.error('Upload error:', error);
            alert('Error uploading image: ' + error.message);
            setLoading(false);
          },
          async () => {
            try {
              const imageUrl = await getDownloadURL(storageRef);
              
              const userRef = doc(db, 'users', user.uid);
              const updateData = {
                updatedAt: new Date()
              };

              if (type === 'profile') {
                await updateProfile(user, { photoURL: imageUrl });
                updateData.profilePicture = imageUrl;
              } else {
                updateData.coverImage = imageUrl;
              }

              await updateDoc(userRef, updateData);
              
              await addDoc(collection(db, 'pictures'), {
                userId: user.uid,
                type: type,
                name: fileName,
                url: imageUrl,
                createdAt: new Date()
              });

              alert('Image updated successfully!');
              setLoading(false);
            } catch (error) {
              console.error('Error saving image reference:', error);
              alert('Error saving image reference: ' + error.message);
              setLoading(false);
            }
          }
        );
      } catch (error) {
        console.error('Error initiating upload:', error);
        alert('Error initiating upload: ' + error.message);
        setLoading(false);
      }
    };

    input.click();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
  
    try {
      const userRef = doc(db, 'users', user.uid);
  
      const updates = {
        displayName: name,
        bio: bio,
        updatedAt: new Date()
      };
  
      // Update auth profile first
      await updateProfile(user, { displayName: name });
      
      // Then update Firestore
      await updateDoc(userRef, updates);
      
      // Update context
      await updateUserContext();
      
      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <EditProfileContainer>
      <BackButton onClick={() => navigate(-1)}>
        <IoArrowBack size={24} />
      </BackButton>

      <ImageSection>
        <CoverImageContainer>
          <CoverImage 
            src={user?.coverImage || "/images/default-background.jpg"} 
            alt="Cover" 
          />
          <EditImageButton onClick={() => !loading && handleImageChange('cover')}>
            <IoCamera size={20} />
          </EditImageButton>
        </CoverImageContainer>
        
        <ProfileImageContainer>
          <ProfilePicture 
            src={ "/images/default-profile.jpg"} 
            alt="Profile" 
          />
          <EditImageButton onClick={() => !loading && handleImageChange('profile')}>
            <IoCamera size={20} />
          </EditImageButton>
        </ProfileImageContainer>
      </ImageSection>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Name</Label>
          <Input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </FormGroup>

        <FormGroup>
          <Label>Bio</Label>
          <TextArea 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write something about yourself..."
            rows={2}
          />
        </FormGroup>

        <SaveButton type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'SAVE'}
        </SaveButton>
      </Form>
    </EditProfileContainer>
  );
};

const EditProfileContainer = styled.div`
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

const ImageSection = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
`;

const CoverImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
`;

const CoverImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 0 0 12px 12px;
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

const EditImageButton = styled.button`
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const Form = styled.form`
  padding: 80px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #666;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 0;
  border: none;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
  resize: none;
  background: transparent;
  min-height: 100px;

  &:focus {
    outline: none;
    border-bottom-color: #666;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 0;
  border: none;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
  background: transparent;

  &:focus {
    outline: none;
    border-bottom-color: #666;
  }
`;

const SaveButton = styled.button`
  background: black;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 20px;
  font-family: Arial, Helvetica, sans-serif;

  &:hover {
    background: rgb(255, 206, 243);
  }

  &:disabled {
    background: #999;
    cursor: not-allowed;
  }
`;

export default EditProfile; 