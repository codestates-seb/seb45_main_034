import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MemberList() {
 const [members, setMembers] = useState([]);

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
    <div>
      <h1>회원 정보 조회</h1>
      <ul>
        {members.map((member) => (
          <li key={member.id}>{member.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default MemberList;