import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import '../component/CSS/myaccount.css';
import SideBar from "../component/Sidebar";

interface CustomerData {
  nickName: string; // 이름을 닉네임으로 변경합니다.
  proFilePicture: string; // 프로필 사진 필드 추가
  userId: string;
}

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

function CustomerForm() {
  const [nickName, setNickName] = useState<string>("");
  const [proFilePicture, setProFilePicture] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState('');

  const userIds = Cookies.get("userId")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get(`/api/users/info/${userIds}`);
        const data = response.data;

        if (data) {
          setNickName(data.nickName);
          setProFilePicture(data.proFilePicture);
          setUserId(data.userId);
        } else {
          console.error('서버에서 사용자 정보를 불러오지 못했습니다.');
        }
      } catch (error) {
        console.error('사용자 정보를 불러오지 못했습니다.', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const customerData: CustomerData = {
      nickName: nickName,
      proFilePicture: proFilePicture,
      userId: userId,
    };

    try {
      const response = await instance.patch(`/api/users/update/${userIds}`, customerData);
      console.log("정보 업데이트 성공:", response.data);
    } catch (error) {
      console.error("정보 업데이트 실패:", error);
    }
  };

  return (
    <div className='app-container'>
        <SideBar setSelectedCategory={setSelectedCategory} />
    <div className="my-account-container">
      <h2>내 계정 정보</h2>
      <form className="customer-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nickName">닉네임:</label>
          <input
            type="text"
            id="nickName"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="proFilePicture">프로필 사진:</label>
          <input
            type="text"
            id="proFilePicture"
            value={proFilePicture}
            onChange={(e) => setProFilePicture(e.target.value)}
          />
        </div>
        <button type="submit">정보 업데이트</button>
      </form>
    </div>
    </div>
  );
}

export default CustomerForm;