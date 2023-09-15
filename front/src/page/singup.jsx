import React from 'react';
import '../component/CSS/singup.css';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080',
});

function Singup() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const response = await instance.post(
        '/api/users/join',
        data
      );

      if (response.status === 200) {
        const responseData = response.data;
        console.log('Join successful:', responseData);

        // Handle successful join, e.g., redirect to a success page
      } else {
        console.error('Join failed. Try again!');
        // Handle join failure here if needed
      }
    } catch (error) {
      console.error('Network error:', error);
      // Handle network error here if needed
    }
  };

  return (
    <div className="Singup-header">
      <div className="Singup">
        <div className="Singupcontainer">
          <h2 className="Singupjoin-text">7Guys Flix 가입하기</h2>
          <form id="SingupjoinForm" onSubmit={handleSubmit}>
            <div className="Singupinput-container">
              <label htmlFor="username">사용자 이름:</label>
              <input type="text" id="username" name="username" required />
            </div>
            <div className="Singupinput-container">
              <label htmlFor="password">비밀번호:</label>
              <input type="password" id="password" name="password" required />
            </div>
            <div className="Singupinput-container">
              <label htmlFor="passwordCheck">비밀번호 확인:</label>
              <input
                type="password"
                id="passwordCheck"
                name="passwordCheck"
                required
              />
              <span id="passwordCheckError" className="Singuperror"></span>
            </div>
            <div className="Singupbutton-container">
              <button type="submit">가입하기</button>
            </div>
          </form>
          <div className="Singupsocial-buttons">
            <p id="usernameError" className="Singuperror"></p>

            <p id="passwordMismatchError" className="Singuperror"></p>

            <button className="Singupfacebook-button">
              <i className="Singupfab fa-facebook-f"></i> 페이스북으로 가입
            </button>
            <button className="Singuptwitter-button">
              <i className="Singupfab fa-twitter"></i> 트위터로 가입
            </button>
            <button
              className="Singupgoogle-button"
              style={{ color: '#EA4335' }}
            >
              <i className="Singupfab fa-google"></i> 구글로 가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Singup;
