import React from 'react';
import { PopupModaltype } from '../type/modalType';
import './CSS/popupmodal.css'

  const PopupModal: React.FC<PopupModaltype> = ({ title, message, onDeleteClick, onCancelClick }) => {
    
    
    return (
      <div className="popup-modal">
        <div className="popup-content">
          <div className="popup-title">{title}</div>
          <div className="popup-message">{message}</div>
          <div className="popup-buttons">
            <button onClick={onDeleteClick}>삭제</button>
            <button onClick={onCancelClick}>취소</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default PopupModal;