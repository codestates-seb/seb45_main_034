import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import '../component/CSS/movieadd.css'

const instance = axios.create({
  baseURL: 'http://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080',
});

instance.interceptors.request.use((config) => {
  const accessToken = Cookies.get('accessToken');

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

const MovieAdd: React.FC = () => {
  const navigate = useNavigate();

  const [movie, setMovie] = useState({
    title: '',
    genre: '',
    streamingURL: '',
    description: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMovie((prevMovie) => ({ ...prevMovie, [name]: value }));
  };

  const handleAddMovie = async () => {
    try {
      const response = await instance.post('/api/movies', movie);
      console.log('영화 정보가 추가되었습니다:', response.data);
      navigate('/');
    } catch (error) {
      console.error('영화 정보를 추가하는 중 에러:', error);
    }
  };

  return (
    <div className="movieadd-container">
      <h2 className="movieadd-h2">영화 추가 페이지</h2>
      <label className="movieadd-label">
        제목:
        <input
          type="text"
          name="title"
          value={movie.title}
          onChange={handleInputChange}
          className="movieadd-input"
        />
      </label>
      <br />
      <label className="movieadd-label">
        장르:
        <input
          type="text"
          name="genre"
          value={movie.genre}
          onChange={handleInputChange}
          className="movieadd-input"
        />
      </label>
      <br />
      <label className="movieadd-label">
        스트리밍 URL:
        <input
          type="text"
          name="streamingURL"
          value={movie.streamingURL}
          onChange={handleInputChange}
          className="movieadd-input"
        />
      </label>
      <br />
      <label className="movieadd-label">
        설명:
        <textarea
          name="description"
          value={movie.description}
          onChange={handleInputChange}
          className="movieadd-textarea"
        />
      </label>
      <br />
      <button onClick={handleAddMovie} className="movieadd-button">
        영화 추가
      </button>
    </div>
  );
};

export default MovieAdd;