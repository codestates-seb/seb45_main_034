import React from "react";
import "./CSS/header.css";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleLoginpage = () => {
    navigate("/login");
  };

  return (
    <div className="header">
      <div className="header-title-logo">
        <h1 className="header-title">7Guys Flix</h1>
        <div className="header-logo">
          <img
            src="https://img1.daumcdn.net/thumb/R1280x0/?fname=http://t1.daumcdn.net/brunch/service/user/40q3/image/QQaey5FjoJcfXcL2zlP_v-ygSNI.jpg"
            alt="Logo"
          />
        </div>
      </div>
      <div className="header-buttons">
        <button className="login-button" onClick={handleLoginpage}>
          Login
        </button>
        <button className="join-button">Join</button>
      </div>
    </div>
  );
}

export default Header;
