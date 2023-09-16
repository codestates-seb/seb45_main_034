import React, { useState } from "react";
import './CSS/deletemodal.css';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }

  function DeleteModal({ isOpen, onClose, onConfirm }: DeleteModalProps) {
  const [confirmationText, setConfirmationText] = useState("");

  const handleConfirm = () => {
    if (confirmationText === "회원탈퇴") {
      onConfirm();
      onClose();
    } else {
      alert("올바른 확인 문구를 입력해주세요.");
    }
  };

  return isOpen ? (
    <div className="deletemodal">
      <div className="deletemodal-content">
            <p>정말로 탈퇴하시겠습니까?<br />탈퇴하시려면 "회원탈퇴"라고 적어주세요.</p>
            <input
            type="text"
            placeholder="회원탈퇴"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            />
            <div className="deletemodal-button-container">
            <button onClick={handleConfirm}>확인</button>
            <button onClick={onClose}>취소</button>
            </div>
        </div>
    </div>
  ) : null;
}

export default DeleteModal;