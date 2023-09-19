import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import MovieDetails from "../component/MovieDetail";
import VideoPlayer from "../component/VideoPlayer";
import MovieComment from "../component/MovieComment";
import styled from "styled-components";
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

const MovieContainer = styled.div`
  margin-top: 80px;
  display: flex;
  justify-content: center;
  background-color: #262626;
  color: white;

  .player-and-details {
    display: flex;
    flex-direction: column;
  }
`;

export default function Movie() {
  const location = useLocation();
  const { movieId } = useParams();
  const userId = Cookies.get("userId");
  const watchTime = new Date().toISOString();
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (userId && movieId) {
      const requestData = {
        userId: userId,
        movieId: movieId,
        watchTime: watchTime,
      };

      instance
        .post("/api/watch-history", requestData)
        .then((response) => {
          console.log(
            "시청 기록이 성공적으로 업데이트되었습니다.",
            response.data
          );
        })
        .catch((error) => {
          console.error("시청 기록 업데이트 중 오류 발생:", error);
        });
    }
  }, [userId, movieId, watchTime]);

  return (
    <div className="app-container">
      <SideBar setSelectedCategory={setSelectedCategory} />
      <MovieContainer>
        <div className="player-and-details">
          <VideoPlayer />
          <MovieDetails />
        </div>
        <MovieComment />
      </MovieContainer>
    </div>
  );
}
