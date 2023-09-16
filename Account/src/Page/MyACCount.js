import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CustomerForm({ addCustomer }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    
    addCustomer({ name, email });

    
    setName('');
    setEmail('');
  };
  useEffect(() => {
    
    axios.get('https://api.example.com/members')
      .then((response) => {
        
        setMembers(response.data);
      })
      .catch((error) => {
        console.error('회원 정보를 불러오는 중 에러 발생:', error);
      });
  }, []);
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">이름:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="email">이메일:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button type="submit">고객 추가</button>
    </form>
  );
  
}
  export default CustomerForm;