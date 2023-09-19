import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaClock, FaFilter, FaRegComment } from "react-icons/fa";
import "./CSS/button.css";
import Cookies from "js-cookie";
import axios from "axios";
import { MovieResponseDto } from "../type/VideoType";

interface SideBarProps {
  setSelectedCategory: (category: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({ setSelectedCategory }) => {
  const navigate = useNavigate();
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [showRecommendation, setShowRecommendation] = useState<boolean>(false);

  const [recommendedMoviesByGenre, setRecommendedMoviesByGenre] = useState<
    MovieResponseDto[] | undefined
  >([]);
  const [topRatedMovies, setTopRatedMovies] = useState<
    MovieResponseDto[] | undefined
  >([]);

  const handleHomeClick = () => {
    setSelectedCategory("");
    navigate("/");
  };

  const handleCategoriesClick = () => {
    setShowCategories(!showCategories); // 카테고리 토글
  };

  const handleGenreClick = (genre: string) => {
    getRecommendations(userId || "");
    navigate(`/genres/${genre}`);
  };

  const handleHistoryClick = () => {
    navigate("/history");
  };

  const userId = Cookies.get("userId");

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

  // 사용자에게 영화 추천
  const getRecommendations = (userId: string) => {
    instance
      .get(`/recommendations/user/${userId}`)
      .then((response) => {
        const data: MovieResponseDto[] = response.data;
        setRecommendedMoviesByGenre(data);
        navigate(`/recommendations/user/${userId}`);
      })
      .catch((error) => {
        console.error("영화 추천 요청 오류:", error);
      });
  };

  // 상위 평점 4점 이상 영화 추천
  const getTopRatedRecommendations = () => {
    instance
      .get("/recommendations/top-rated")
      .then((response) => {
        const data: MovieResponseDto[] = response.data;
        setTopRatedMovies(data);
        navigate("/top-rated");
      })
      .catch((error) => {
        console.error("상위 평점 영화 추천 요청 오류:", error);
      });
  };

  const handleRecommendationsClick = () => {
    setShowRecommendation(!showRecommendation);
  };

  const handleRecommendationClick = () => {
    getRecommendations(userId || "");
  };

  const handleTopRatedClick = () => {
    getTopRatedRecommendations();
  };

  return (
    <aside className="sidebar">
      <button onClick={handleHomeClick} className="home-button">
        <FaHome className="home-icon" />
        <span className="home-text">홈</span>
      </button>
      <button onClick={handleCategoriesClick}>
        <FaFilter className="filter-icon" />
        <span className="filter-text">카테고리</span>
      </button>
      <div className={`side-list ${showCategories ? "show" : ""}`}>
        <button onClick={() => handleGenreClick("액션")}>액션</button>
        <button onClick={() => handleGenreClick("드라마")}>드라마</button>
        <button onClick={() => handleGenreClick("스릴러")}>스릴러</button>
        <button onClick={() => handleGenreClick("로맨스")}>로맨스</button>
      </div>
      <button onClick={handleHistoryClick}>
        <FaClock className="history-icon" />
        <span className="history-text">시청 기록</span>
      </button>
      <button onClick={handleRecommendationsClick}>
        <FaRegComment className="recommend-icon" />
        <span className="recommend-text">영화추천</span>
      </button>
      <div className={`side-list ${showRecommendation ? "show" : ""}`}>
        <button
          onClick={handleRecommendationClick}
        >{`${userId}님 선호 장르 영화 추천`}</button>
        <button onClick={handleTopRatedClick}>
          상위 평점 4점 이상 영화 추천
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
