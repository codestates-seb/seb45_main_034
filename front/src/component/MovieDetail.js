import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
// import { ReactComponent as ShareIcon } from "../images/share.svg"; // 공유하기 버튼

import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const MovieDetailsContainer = styled.div`
  margin: 20px;
  max-width: 100%;
  border-radius: 5px;
  padding: 1rem;
  padding-bottom: 10rem;
  background-color: #333333;

  .detail-box {
    display: flex;
    flex-direction: column;
  }

  .title-share {
    display: flex;
    justify-content: space-between;
  }

  .share {
    cursor: pointer;
  }

  .padding {
    padding-top: 1rem;
  }
`;

export default function MovieDetails() {
  const { movieId } = useParams();
  const [movieInfo, setMovieInfo] = useState("");

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

  useEffect(() => {
    
    if (movieId) {
      instance
        .get(`/api/movies/${movieId}`)
        .then((response) => {
          const data = response.data.movieResponseDto;
          setMovieInfo(data);
        })
        .catch((error) => {
          console.error("영화 정보를 가져오는데 실패했습니다.", error);
        });
    }
  }, []);

  return (
    <MovieDetailsContainer>
      <div className="detail-box">
        <div className="title-share">
          <h1>제목: {movieInfo.title}</h1>
          {/* <div className="share">
            <ShareIcon title="페이지 공유" />
          </div> */}
        </div>
        <div className="padding">장르: {movieInfo.genre}</div>
        <div className="padding">줄거리: {movieInfo.description}</div>
      </div>
    </MovieDetailsContainer>
  );
}
