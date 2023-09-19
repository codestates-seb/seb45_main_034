import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "../component/CSS/GenreVideo.css";
import ErrorModal from "../component/ErrorModal";
import { Movie } from "../type/VideoType";
import SideBar from "../component/Sidebar";

const instance = axios.create({
  baseURL: "http://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080",
});

instance.interceptors.request.use((config) => {
  const accessToken = Cookies.get("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

function SearchResults() {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const location = useLocation();
  const searchKeyword = new URLSearchParams(location.search).get("keyword");
  const isAdmin = Cookies.get("userRoles") === "ADMIN";
  const [selectedCategory, setSelectedCategory] = useState('');

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
          console.error("검색 결과를 불러오는데 실패했습니다.", error);
          
          setErrorModalOpen(true);
        });
    }
  }, [searchKeyword]);

  return (
    <div className='app-container'>
        <SideBar setSelectedCategory={setSelectedCategory} />
    <main className="genre-page">
      <h2>검색 결과</h2>
      <div className="genrevideo-container">
        {searchResults.length === 0 ? (
          <div className="no-videos-message">검색 결과가 없습니다.</div>
        ) : (
          searchResults.map((movie) => {
            return (
              <div key={movie.movieId} className="genrevideo-item">
                <Link to={`/stream/${movie.movieId}`}>
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
      <ErrorModal isOpen={errorModalOpen} message="로그인이 필요한 서비스입니다. 로그인 후 다시 시도해주세요." />
    </main>
    </div>
  );
}

export default SearchResults;
