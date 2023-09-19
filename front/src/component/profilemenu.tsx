import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import './CSS/userprofilemenu.css';
import axios from "axios";
import DeleteModal from "./deletemodal";

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

interface UserProfileMenuProps {
    userProfileImageLink: string | null;
    onClose?: () => void;
  }

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ userProfileImageLink }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleProfileClick = () => {
    navigate(`/mypage`);
  };

  const handleLogoutClick = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("userRoles");
    Cookies.remove("userId")
    navigate("/");
    window.location.reload();
  };

  const handleDeleteAccountClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
        const userId = Cookies.get("userId");

        if (!userId) {
            console.error('사용자 ID를 찾을 수 없습니다.')
            return;
        }

        const response = await instance.delete(`/api/users/delete/${userId}`)

        if (response.status === 200){
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            Cookies.remove("userRoles");
            Cookies.remove("userId");
            navigate("/");
            window.location.reload();
        } else {
            console.error("회원 탈퇴 요청이 실패했습니다.");
        }
    } catch (error) {
        console.error("회원 탈퇴 중 오류 발생:", error);
      }
  };

  return (
    <div className={`user-profile-menu ${isOpen ? "open" : ""}`}>
      <div className="menu">
        <button className="menu-item" onClick={handleProfileClick}>
          프로필
        </button>
        <button className="menu-item" onClick={handleLogoutClick}>
          로그아웃
        </button>
        <button className="menu-item" onClick={handleDeleteAccountClick}>
          회원 탈퇴
        </button>
      </div>
      {isModalOpen && (
        <DeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

export default UserProfileMenu;
