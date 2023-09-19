import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams } from "react-router-dom";
import '../component/CSS/movieedit.css'
import { useNavigate } from 'react-router-dom';
import PopupModal from '../component/Modal';

const instance = axios.create({
  baseURL: 'http://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080',
});

instance.interceptors.request.use(async (config) => {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");
  
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);

  const accessTokenExpire = Cookies.get("accessTokenExpire");
  if (accessTokenExpire && currentTimestamp >= parseInt(accessTokenExpire, 10)) {
    try {
      const refreshResponse = await axios.post("http://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080/api/refresh", {
        refreshToken: refreshToken,
      });

      if (refreshResponse.status === 200) {
        const newAccessToken = refreshResponse.headers.authorization;
        
        Cookies.set("accessToken", newAccessToken, { path: "/" });

        config.headers.Authorization = `Bearer ${newAccessToken}`;
      }
    } catch (error) {
      console.error("토큰 재발급 실패:", error);
    }
  }

  return config;
});

interface MovieEdits {
  movieResponseDto?: any;
  movieId: number;
  title: string;
  genre: string;
  streamingURL: string;
  description: string;
}

const MovieEdit: React.FC = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [selectedMovieID, setSelectedMovieID] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  const [movie, setMovie] = useState<MovieEdits>({
    movieId: 0,
    title: '',
    genre: '',
    streamingURL: '',
    description: '',
  });

  useEffect(() => {
    // 수정할 영화 정보를 서버에서 가져오는 로직
    const fetchMovieData = async () => {
        try {
          const response = await instance.get<MovieEdits>(`/api/movies/${movieId}`);
          setMovie({
            movieId: response.data.movieResponseDto.movieId,
            title: response.data.movieResponseDto.title,
            genre: response.data.movieResponseDto.genre,
            streamingURL: response.data.movieResponseDto.streamingURL,
            description: response.data.movieResponseDto.description,
          });
        } catch (error) {
          console.error('영화 정보를 가져오는 중 에러:', error);
        }
      };
    
      fetchMovieData();
    }, [movieId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMovie((prevMovie) => ({ ...prevMovie, [name]: value }));
  };

  const handleUpdateMovie = async () => {
    try {
      const response = await instance.patch(`/api/movies/${movie.movieId}`, movie);
      console.log('영화 정보가 업데이트되었습니다:', response.data);
      navigate('/')
    } catch (error) {
      console.error('영화 정보를 업데이트하는 중 에러:', error);
    }
  };

  const handleMenuClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {

    const movieID = movie.movieId;

    setSelectedMovieID(movieID);
    setShowModal(true);
  };

  const handleDeleteClick = async () => {
    if (selectedMovieID !== null) {
      try {
        await instance.delete(`/api/movies/${movie.movieId}`);
        console.log('영화 삭제 성공');
        setSelectedMovieID(null);
        setShowModal(false);
        navigate('/')
      } catch (error) {
        console.error('영화 삭제 오류:', error);
      }
    }
  };

  return (
    <div className="movieedit-container">
        <h2 className="movieedit-h2">영화 수정 페이지</h2>
        <label className="movieedit-label">
            제목:
            <input
                type="text"
                name="title"
                value={movie.title}
                onChange={handleInputChange}
                className="movieedit-input"
            />
        </label>
        <br />
        <label className="movieedit-label">
            장르:
            <input
                type="text"
                name="genre"
                value={movie.genre}
                onChange={handleInputChange}
                className="movieedit-input"
            />
        </label>
        <br />
        <label className="movieedit-label">
            스트리밍 URL:
            <input
                type="text"
                name="streamingURL"
                value={movie.streamingURL}
                onChange={handleInputChange}
                className="movieedit-input"
            />
        </label>
        <br />
        <label className="movieedit-label">
            설명:
            <textarea
                name="description"
                value={movie.description}
                onChange={handleInputChange}
                className="movieedit-textarea"
            />
        </label>
        <br />
        <button onClick={handleUpdateMovie} className="movieedit-button">
            영화 정보 수정
        </button>
        <button onClick={handleMenuClick} className="movieedit-button">
          영화 삭제
        </button>
        {showModal && (
          <PopupModal
            title="영상 삭제"
            message="정말로 이 영상을 삭제하시겠습니까?"
            onDeleteClick={handleDeleteClick}
            onCancelClick={() => setShowModal(false)}
          />
        )}
    </div>
  );
};

export default MovieEdit;
