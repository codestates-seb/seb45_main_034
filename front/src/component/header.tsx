import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import userimg from '../images/userimg.png'
import UserProfileMenu from "./profilemenu";
import { FaPlus } from 'react-icons/fa';

const instance = axios.create({
  baseURL: 'http://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080',
});

instance.interceptors.request.use((config) => {
  const accessToken = Cookies.get("accessToken");
  
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

function Header() {
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(false);
  const [userProfileImageLink, setUserProfileImageLink] = useState(userimg);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const userRoles = Cookies.get("userRoles");

    if (userRoles) {
      setIsAdmin(userRoles === "ADMIN");
    } else {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      setIsLogged(true);
      fetchUserProfileImage();
    } else {
      setIsLogged(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfileImage();
  }, []);

  const fetchUserProfileImage = async () => {
    try {
      const userId = Cookies.get("userId");
      if (!userId) {
        return;
      }

      const response = await instance.get(`/api/users/info/${userId}`);
      const userProfileImageLink = response.data.proFilePicture;

      setUserProfileImageLink(userProfileImageLink || userimg);
    } catch (error) {
      console.error("프로필 이미지를 가져오지 못했습니다.", error);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSingup = () => {
    navigate("/signup");
  };

  const handleProfileClick = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsOpen(!isOpen);
  };

  const handleAddMovie = () => {
    navigate('/movie/add')
  }

  return (
    <div className="header">
      <div className="header-title-logo">
        <h1 className="header-title">Mini Flix</h1>
        <div className="header-logo">
          <img
            src="https://img1.daumcdn.net/thumb/R1280x0/?fname=http://t1.daumcdn.net/brunch/service/user/40q3/image/QQaey5FjoJcfXcL2zlP_v-ygSNI.jpg"
            alt="Logo"
          />
        </div>
      </div>
      <div className="header-buttons">
        {isLogged ? (
          <>
            <div className="profile-image-container">
            <img src={userProfileImageLink || userimg} alt="User Profile" onClick={handleProfileClick} />
              {isMenuOpen && <UserProfileMenu userProfileImageLink={userProfileImageLink} onClose={() => setIsMenuOpen(false)} />}
            </div>
            {isAdmin && (
              <button className="add-movie-button" onClick={handleAddMovie}>
                <FaPlus />
              </button>
              )}
          </>
        ) : (
          <>
            <button className="login-button" onClick={handleLogin}>
              Login
            </button>
            <button className="join-button" onClick={handleSingup}>
              Singup
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
