import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Header() {
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, []);

  const onLogoutClick = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setIsLogged(false);
    navigate("/");
  };

  const handleLogin = () => {
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
        {isLogged ? (
          <button className="logout-button" onClick={onLogoutClick}>
            Logout
          </button>
        ) : (
          <>
            <button className="login-button" onClick={handleLogin}>
              Login
            </button>
            <button className="join-button">Join</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
