import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useContext } from 'react';
import styled from 'styled-components';

// Components
import Login from './components/auth/Login';
import Feed from './components/feed/Feed';
import CreatePost from './components/feed/CreatePost';
import UserProfile from './components/profile/UserProfile';
import EditProfile from './components/profile/EditProfile';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContainer>
          <MainContent>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Feed />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </MainContent>
        </AppContainer>
      </AuthProvider>
    </Router>
  );
}

export default App;
