import { useState } from 'react';
import { auth } from '../../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import styled from 'styled-components';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <RegisterContainer>
      <h2>Register</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </RegisterContainer>
  );
};

const RegisterContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

export default Register; 