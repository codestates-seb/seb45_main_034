import React from 'react';
import '../component/CSS/signup.css';
import axios from 'axios';


const instance = axios.create({
  baseURL: 'http://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080',
});

function Signup() {
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
    <div className="Signup-header">
    <div className="Signup">
      <div className="Signup-container">
        <h2 className="Signup-text">7Guys Flix 가입하기</h2>
        <form id="SignupForm" onSubmit={handleSubmit}>
            <div className="Signupinput-container">
              <label htmlFor="username" className="Signup-label">사용자 이름:</label>
              <input type="text" id="username" name="username" className="Signup-input" required />
            </div>
            <div className="Signupinput-container">
              <label htmlFor="password" className="Signup-label">비밀번호:</label>
              <input type="password" id="password" name="password" className="Signup-input" required />
            </div>
            <div className="Signupinput-container">
              <label htmlFor="passwordCheck" className="Signup-label">비밀번호 확인:</label>
              <input
                type="password"
                id="passwordCheck"
                name="passwordCheck"
                className="Signup-input"
                required
              />
            </div>
            <div className="Signup-button-container">
              <button className="Signup-button" type="submit">가입하기</button>
            </div>
          </form>
          <div className="Signupsocial-buttons">
      <button className="Signupfacebook-button">
        <i className="Signupfab fa-facebook-f"></i> 페이스북으로 가입
      </button>
      <button className="Signuptwitter-button">
        <i className="Signupfab fa-twitter"></i> 트위터로 가입
      </button>
      <button className="Signupgoogle-button" >
        <i className="Signupfab fa-google"></i> 구글로 가입
      </button>
    </div>

        </div>
      </div>
    </div>
  );
}

export default Signup;
