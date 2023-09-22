import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "../component/CSS/GenreVideo.css";
import { Movie } from "../type/VideoType";
import SideBar from "../component/Sidebar";
import styled from "styled-components";
import '../component/CSS/Errormodal.css'

interface ErrorModalProps {
  isOpen: boolean;
  message: string;
}

const Mainvideo = styled.div`
  display: flex;
  margin-top: 40px;
  z-index: 10;
  background-color: #1D1D1D;
  width: 100%;`
  ;

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

function SearchResults() {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const location = useLocation();
  const searchKeyword = new URLSearchParams(location.search).get("keyword");
  const isAdmin = Cookies.get("userRoles") === "ADMIN";
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searcherrorMessage, setSearcherrorMessage] = useState<any>()

  const navigate = useNavigate();

  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (searchKeyword) {
      instance
        .get(`/api/movies/search?keyWord=${searchKeyword}&page=1`)
        .then((response) => {
          setSearchResults(response.data);
        })
        .catch((error) => {
          if (error.response.status === 401){
          console.error("검색 결과를 불러오는데 실패했습니다.", error);

          setSearcherrorMessage(error.response.data.message)          
          setErrorModalOpen(true);
        } else {
          console.error("검색 결과를 불러오는데 실패했습니다.", error);

          setSearcherrorMessage(error.response.data)          
          setErrorModalOpen(true);
        }
        });
    }
  }, [searchKeyword]);

  const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, message }) => {
    const navigate = useNavigate();
  
    const handleClose = () => {
      navigate('/')
    }
  
    return (
      <div className={`Errormodal ${isOpen ? 'open' : ''}`}>
        <div className="Errormodal-content">
          <h2>오류 발생</h2>
          <p>{searcherrorMessage}</p>
          <button onClick={handleClose}>닫기</button>
        </div>
      </div>
    );
  };

  return (
    <div className='app-container'>
        <SideBar setSelectedCategory={setSelectedCategory} />
        <Mainvideo>
    <main className="genre-page">
      <h2 className='genre-font'>검색 결과</h2>
      <div className="genrevideo-container">
        {searchResults.length === 0 ? (
          <div className="no-videos-message">검색 결과가 없습니다.</div>
        ) : (
          searchResults.map((movie) => {
            return (
              <div key={movie.movieId} className="genrevideo-item">
                <Link to={`/stream/${movie.movieId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img src={movie.previewPicture} alt={movie.title} />
                  <div className="video-title">{movie.title}</div>
                  <p className="genrevideo-description">{movie.description}</p>
                  
                </Link>
                {isAdmin && (
                    <div
                      className="menu-icon"
                      onClick={() => navigate(`/movie/edit/${movie.movieId}`)}
                    />
                  )}
              </div>
            );
          })
        )}
      </div>
      <ErrorModal isOpen={errorModalOpen} message={searcherrorMessage}/>
    </main>
    </Mainvideo>
    </div>
  );
}

export default SearchResults;
