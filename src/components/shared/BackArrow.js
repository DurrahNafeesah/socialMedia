import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { IoArrowBack } from 'react-icons/io5';

const BackArrow = () => {
  const navigate = useNavigate();

  return (
    <ArrowButton onClick={() => navigate(-1)}>
      <IoArrowBack size={24} />
    </ArrowButton>
  );
};

const ArrowButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  cursor: pointer;
  color: #292929;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  &:hover {
    opacity: 0.8;
  }
`;

export default BackArrow; 