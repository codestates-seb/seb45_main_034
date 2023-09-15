import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/header.css";
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
    email: "admin@gmail.com",
    password: "1234asdf!@#",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    let timer;
    if (showErrorMessage) {
      // Show error message for 5 seconds
      timer = setTimeout(() => {
        setErrorMessage(""); // Clear the error message
        setShowErrorMessage(false);
      }, 5000);
    }

    return () => {
      // Clear the timer if the component unmounts or if the error message is hidden
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [showErrorMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await instance.post("/api/users/login", loginData);

      if (response.status === 200) {
        const responseData = response.data;
        console.log("Login successful:", responseData);

        const roles = responseData.roles;

        // 저장된 액세스 토큰과 리프레시 토큰을 로컬 스토리지에 설정
        localStorage.setItem("accessToken", responseData.accessToken);
        localStorage.setItem("refreshToken", responseData.refreshToken);

        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        console.log("Access Token:", accessToken);
        console.log("Refresh Token:", refreshToken);

        setErrorMessage("");

        navigate("/", { state: { roles } });
      } else {
        console.error("Login failed. Try again!");
        setErrorMessage("Login failed. Try again!");
        setShowErrorMessage(true);
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrorMessage("Network error. Try again later!");
      setShowErrorMessage(true);
    }
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
    <div className="main-content">
      <div className="container">
        <h1>Welcome to 7Guys Flix!</h1>
        <p>Please log in to access the website:</p>
        <form id="loginForm" onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="email">email:</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              autoComplete="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="current-password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </div>
          <div className="button-container">
            <button type="submit">Login</button>
          </div>
          <div
            id="error-container"
            style={{ color: "red", fontWeight: "bold", textAlign: "center" }}
          >
            {errorMessage}
          </div>
        </form>
      </div>
      <div className="social-buttons">
        <button className="facebook-button" onClick={""}>
          <FontAwesomeIcon icon={faFacebookF} /> Login with Facebook
        </button>
        <button className="twitter-button" onClick={""}>
          <FontAwesomeIcon icon={faTwitter} /> Login with Twitter
        </button>
        <button className="google-button" onClick={""}>
          <FontAwesomeIcon icon={faGoogle} style={{ color: "#EA4335" }} /> Login
          with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
