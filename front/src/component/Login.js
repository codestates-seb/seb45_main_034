import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faGoogle,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import Cookies from "js-cookie";
import axios from "axios";

// Axios 인스턴스 생성
const instance = axios.create({
  baseURL: "http://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080",
});

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let timer;
    if (showErrorMessage) {
      timer = setTimeout(() => {
        setErrorMessage("");
        setShowErrorMessage(false);
      }, 5000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [showErrorMessage]);

  const handleGoogleLogin = () => {
    // // Google OAuth 2.0 클라이언트 ID
    // const clientId =
    //   "845142340290-3h2ko2t3qr3qabnj4mhl8b8mee8p9o4o.apps.googleusercontent.com"; // 여기에 클라이언트 ID를 넣으세요
    // // Google OAuth 2.0 로그인 URL 생성
    // const redirectUri = "http://localhost:3000/google-callback";
    // const scope = "https://www.googleapis.com/auth/userinfo.email"; // 필요한 범위를 설정하세요
    // const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    // // Google 로그인 페이지로 이동
    // window.location.href = authUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await instance.post("/api/users/login", loginData);

      if (response.status === 200) {
        const responseData = response.headers;
        console.log("Login successful:", responseData);

        const roles = response.data.roles;
        const userId = response.data.userId;

        const accessToken = responseData.authorization;
        const tokenParts = accessToken.split(".");
        const payload = JSON.parse(atob(tokenParts[1]));

        const expirationTimeInSeconds = payload.exp;

        Cookies.set("accessToken", accessToken, { path: "/" });
        Cookies.set("accessTokenExpire", expirationTimeInSeconds, {
          path: "/",
        });
        Cookies.set("refreshToken", responseData.refresh, { path: "/" });
        Cookies.set("userRoles", roles, { path: "/" });
        Cookies.set("userId", userId, { path: "/" });

        setErrorMessage("");

        navigate("/", { state: { roles } });
        window.location.reload();
      } else {
        console.error("Login failed. Try again!");
        setErrorMessage("Login failed. Try again!");
        setShowErrorMessage(true);
      }
    } catch (error) {
      console.error("Network error:", error);
      const errorMessage = error.response.data.message;
      setErrorMessage(errorMessage);
      setShowErrorMessage(true);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // Event handler for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="login-container">
      <div className="login-header-container">
        <h1 className="login-title">MINIFLIX</h1>
      </div>
      <div className="login-form-container">
        <form id="loginForm" onSubmit={handleSubmit}>
          <div className="login-input-container">
            <input
              type="text"
              id="email"
              name="email"
              placeholder="이메일"
              autoComplete="username"
              className="login-input"
              onChange={handleInputChange}
              value={formData.email}
            />
          </div>
          <div className="login-input-container">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="비밀번호"
              autoComplete="current-password"
              className="login-input"
              onChange={handleInputChange}
              value={formData.password}
            />
          </div>
          <button type="submit" className="login-button">
            로그인
          </button>
          <div className="login-error-message">{errorMessage}</div>
        </form>
      </div>
      <div className="login-social-buttons">
        <button className="login-social-button">
          <FontAwesomeIcon icon={faFacebookF} /> Facebook으로 로그인
        </button>
        <button className="login-social-button">
          <FontAwesomeIcon icon={faTwitter} /> Twitter로 로그인
        </button>
        <button className="login-social-button" onClick={handleGoogleLogin}>
          <FontAwesomeIcon icon={faGoogle} style={{ color: "#EA4335" }} />{" "}
          Google로 로그인
        </button>
      </div>
    </div>
  );
}

export default Login;
