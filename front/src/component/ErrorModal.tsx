import React from 'react';
import { useNavigate } from 'react-router-dom'
import './CSS/Errormodal.css'

interface ErrorModalProps {
  isOpen: boolean;
  message: string;
}


const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, message }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/')
  }

  return (
    <div className={`Errormodal ${isOpen ? 'open' : ''}`}>
      <div className="Errormodal-content">
        <h2>오류 발생</h2>
        <p>로그인후 다시 이용해주세요.</p>
        <button onClick={handleClose}>닫기</button>
      </div>
    </div>
  );
};

export default ErrorModal;