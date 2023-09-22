import React, { useState } from "react";
import "../component/CSS/signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 모달 컴포넌트

const instance = axios.create({
  baseURL: "http://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080",
});

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickName: "",
    proFilePicture: "",
  });

  const [tisModalOpen, settIsModalOpen] = useState(false); // 모달 상태
  const [modalMessage, setModalMessage] = useState(""); // 모달 메세지

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await instance.post("/api/users/register", formData);

      if (response.status === 201) {
        const responseData = response.data;
        console.log("Join successful:", responseData);

        navigate("/");
      } else {
        if (response.status === 409) {
          setModalMessage(response.data.message);
          settIsModalOpen(true);
        } else {
          console.error("Join failed. Try again!");
        }
      }
    } catch (error) {
      if (error.response.status === 400) {
        setModalMessage(error.response.data);
        settIsModalOpen(true);
      } else {
        setModalMessage(error.response.data.message);
        settIsModalOpen(true);
        console.error("Network error:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const closeModal = () => {
    settIsModalOpen(false);
    setModalMessage(""); // 모달 메세지 초기화
  };
  function Modal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
      <div className="signupmodal">
        <div className="signupmodal-content">
          <p>{modalMessage}</p>
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    );
  }
  return (
    <div className="Signup-header">
      <div className="Signup">
        <div className="Signup-container">
          <h2 className="Signup-text">MINIFLIX</h2>
          <form id="SignupForm">
            <div className="Signupinput-container">
              <label htmlFor="email" className="Signup-label">
                이메일:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="Signup-input"
                required
                onChange={handleInputChange}
                value={formData.email}
              />
            </div>
            <div className="Signupinput-container">
              <label htmlFor="password" className="Signup-label">
                비밀번호:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="Signup-input"
                required
                onChange={handleInputChange}
                value={formData.passWord}
              />
            </div>
            <div className="Signupinput-container">
              <label htmlFor="nickName" className="Signup-label">
                사용자 이름:
              </label>
              <input
                type="text"
                id="nickName"
                name="nickName"
                className="Signup-input"
                required
                onChange={handleInputChange}
                value={formData.nickName}
              />
            </div>
            <div className="Signupinput-container">
              <label htmlFor="proFilePicture" className="Signup-label">
                프로필 사진 (URL):
              </label>
              <input
                type="text"
                id="proFilePicture"
                name="proFilePicture"
                className="Signup-input"
                onChange={handleInputChange}
                value={formData.proFilePicture}
              />
            </div>
            <div className="Signup-button-container">
              <button
                className="Signup-button"
                type="submit"
                onClick={handleSubmit}
              >
                가입하기
              </button>
            </div>
          </form>
          <div className="Signupsocial-buttons">
            <button className="Signupfacebook-button">
              <i className="Signupfab fa-facebook-f"></i> 페이스북으로 가입
            </button>
            <button className="Signuptwitter-button">
              <i className="Signupfab fa-twitter"></i> 트위터로 가입
            </button>
            <button className="Signupgoogle-button">
              <i className="Signupfab fa-google"></i> 구글로 가입
            </button>
          </div>
        </div>
      </div>
      {/* 에러 모달 */}
      <Modal isOpen={tisModalOpen} onClose={closeModal}>
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
}

export default Signup;
