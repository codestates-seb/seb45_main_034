import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import '../component/CSS/profile.css';

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

function UserProfile() {
  const [email, setEmail] = useState<string>("");
  const [nickName, setNickName] = useState<string>("");
  const [proFilePicture, setProFilePicture] = useState<string>("");

  const userId = Cookies.get("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get(`/api/users/info/${userId}`);
        const data = response.data;

        if (data) {
          setEmail(data.email);
          setNickName(data.nickName);
          setProFilePicture(data.proFilePicture);
        } else {
          console.error('서버에서 사용자 정보를 불러오지 못했습니다.');
        }
      } catch (error) {
        console.error('사용자 정보를 불러오지 못했습니다.', error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="profile-container">
      <h2>프로필 정보</h2>
      <div className="profile-info">
        <div>
          <label>Email:</label>
          <p>{email}</p>
        </div>
        <div>
          <label>닉네임:</label>
          <p>{nickName}</p>
        </div>
        <div>
          <label>프로필 사진:</label>
          <img src={proFilePicture} alt="프로필 사진" />
        </div>
      </div>
    </div>
  );
}

export default UserProfile;