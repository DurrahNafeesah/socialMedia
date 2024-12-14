import React, { useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { AuthContext } from '../../context/AuthContext';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import loginIcon from '../../assets/images/login-icon.png';
import page1 from '../../assets/images/page1.jpg';
import page2 from '../../assets/images/page2.jpg';
import page3 from '../../assets/images/page3.jpg';
import page4 from '../../assets/images/page4.jpg';
import page5 from '../../assets/images/page5.jpg';
import page6 from '../../assets/images/page6.jpg';
import page7 from '../../assets/images/page7.jpg';
import page8 from '../../assets/images/page8.jpg';
import page9 from '../../assets/images/page9.jpg';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    if (user) {
      navigate('/feed');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      // Set persistence to LOCAL
      await setPersistence(auth, browserLocalPersistence);
      
      // Create Google provider
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      // Sign in with popup
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        console.log('Successfully signed in:', result.user.email);
        navigate('/feed');
      }
    } catch (error) {
      console.error('Error during Google sign in:', error.message);
      // You might want to show this error to the user
    }
  };

  return (
    <LoginContainer>
      <ImageGrid>
        <GridImage src={page1} alt="" />
        <GridImage src={page2} alt="" />
        <GridImage src={page3} alt="" />
        <GridImage src={page4} alt="" />
        <GridImage src={page5} alt="" />
        <GridImage src={page6} alt="" />
        <GridImage src={page7} alt="" />
        <GridImage src={page8} alt="" />
        <GridImage src={page9} alt="" />
      </ImageGrid>
      
      <ContentWrapper>
        <LogoContainer>
          <LogoImage src={loginIcon} alt="Login Icon" />
          <LogoText>Vibesnap</LogoText>
        </LogoContainer>
        <Tagline>Moments That Matter, Shared Forever.</Tagline>
        
        <GoogleButton onClick={handleGoogleLogin}>
          <GoogleIconWrapper>
            <svg viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </GoogleIconWrapper>
          Continue with Google
        </GoogleButton>
      </ContentWrapper>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  height: 100%;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: white;
`;

const ImageGrid = styled.div`
  position: relative;
  width: 100vw;
  height: 70vh;
  overflow: hidden;
  margin: 0 0 0 0;
  padding: 0;
  left: 0;
  right: 0;
`;

const GridImage = styled.img`
  position: absolute;
  width: 127px;
  width-right: 0;
  width-left: 0;
  height: 207px;
  object-fit: cover;

  &:nth-child(1) {
    top: -23px;
    left: -10px;
  }

  &:nth-child(2) {
    top: -142px;
    left: 124px;
  }

  &:nth-child(3) {
    top: -23px;
    left: 256px;
  }

  &:nth-child(4) {
    top: 192px;
    left: -9px;
  }

  &:nth-child(5) {
    top: 73px;
    left: 123px;
  }

  &:nth-child(6) {
    top: 192px;
    left: 257px;
  }

  &:nth-child(7) {
    top: 407px;
    left: -9px;
    height: 250px;
    z-index: -1;
  }

  &:nth-child(8) {
    top: 288px;
    left: 123px;
  }

  &:nth-child(9) {
    top: 407px;
    left: 257px;
    height: 250px;
    z-index: -1;
  }
`;

const ContentWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100vw;
  height: 200px;
  top: 65%;
  gap: 0px;
  border-radius: 63px 63px 0 0;
  opacity: 0px;
  margin: 0;
  padding: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin:0;
  padding:0;
  top: 0;
  left: 0;
  right: 0;
`;

const LogoImage = styled.img`
  width: 46px;
  height: 34px;
  top: 539px;
  left: 95px;
  gap: 0px;
  opacity: 0px;
`;

const LogoText = styled.h1`
  width: 123px;
  height: 33px;
  top: 440px;
  left: 143px;
  gap: 0px;
  opacity: 0px;
  font-family:"Arial";
  font-size: 28px;
  font-weight: 600;
  line-height: 32.73px;
  text-align: left;
`;

const Tagline = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0 0 2rem 0;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 26px;
  padding: 13px;
  font-size: 1rem;
  color: #ffffff;
  font-weight: 600;
  background-color: #292929;
  cursor: pointer;
  width: 232.59px;
  height: 50px;
  max-width: 300px;

  &:hover {
    background: rgb(113, 146, 255);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const GoogleIconWrapper = styled.div`
  width: 24px;
  height: 24px;
  svg {
    width: 100%;
    height: 100%;
  }
`;

export default Login;
