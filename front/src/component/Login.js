import React, { useState, useEffect } from "react";
import "./CSS/header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faGoogle,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

function Login() {
  // const [user, setUser] = useState(null);

  // const handleAmazonLogin = () => {
  //   // Amazon OAuth 클라이언트 ID와 리디렉션 URI 설정
  //   const clientId = 'YOUR_AMAZON_CLIENT_ID';
  //   const redirectUri = `${window.location.origin}/amazon-redirect`;

  //   // Amazon OAuth 인증 URL
  //   const authUrl = `https://www.amazon.com/ap/oa?client_id=${clientId}&scope=profile&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;

  //   // Amazon OAuth 인증 페이지로 리디렉션
  //   window.location.href = authUrl;
  // };

  // // 페이지 로드시 Amazon OAuth 코드를 추출하여 사용자 정보 가져오기
  // const handleCodeExtraction = () => {
  //   const params = new URLSearchParams(window.location.search);
  //   const code = params.get('code');

  //   if (code) {
  //     // 코드가 있으면 서버로 전송하거나, 사용자 정보를 가져오는 등의 작업 수행
  //     console.log('Amazon OAuth Code:', code);
  //   }
  // };

  // 페이지 로드시 코드 추출 작업 수행
  // useEffect(() => {
  //   handleCodeExtraction();
  // }, []);

  const [formData, setFormData] = useState({
    username: "admin@gmail.com",
    password: "asdfasdf1",
  });

  // Handle login with Facebook
  const handleFacebookLogin = () => {
    window.location.href =
      "https://www.facebook.com/?stype=lo&jlou=Afc5cCFWxkGMbviVGImZuMoyyUgyt1tn5MDA4r09wSPZssF0B2Ya3uhW-8Rly1l71cQ4Hj6Pvlm_vGJkOgGHn9WPPgqlr5f24lfIS46nAVTEUQ&smuh=58999&lh=Ac-YDRpLU1NocfJIOK8";
  };

  // Handle login with Twitter
  const handleTwitterLogin = () => {
    window.location.href = "https://twitter.com/?logout=1693978673285";
  };

  // Handle login with Google
  const handleGoogleLogin = () => {
    window.location.href =
      "https://accounts.google.com/signout/chrome/landing?continue=https%3A%2F%2Faccounts.google.com%2FServiceLogin%3Felo%3D1&hl=en";
  };

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
      username: formData.username,
      password: formData.password,
    };

    try {
      const response = await fetch(
        "http://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Login successful:", responseData);
        setErrorMessage(""); // Clear any previous error message
      } else {
        console.error("Login failed. Try again!");
        setErrorMessage("Login failed. Try again!");
        setShowErrorMessage(true); // Show the error message
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrorMessage("Network error. Try again later!");
      setShowErrorMessage(true); // Show the error message
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
            <label htmlFor="username">Username:</label>
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
            <label htmlFor="password">Password:</label>
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
        <button className="facebook-button" onClick={handleFacebookLogin}>
          <FontAwesomeIcon icon={faFacebookF} /> Login with Facebook
        </button>
        <button className="twitter-button" onClick={handleTwitterLogin}>
          <FontAwesomeIcon icon={faTwitter} /> Login with Twitter
        </button>
        <button className="google-button" onClick={handleGoogleLogin}>
          <FontAwesomeIcon icon={faGoogle} style={{ color: "#EA4335" }} /> Login
          with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
