import React from "react";
import styled from "styled-components";
import { ReactComponent as ShareIcon } from "../images/share.svg";

const MovieDetailsContainer = styled.div`
  margin: 20px;
  max-width: 100%;
  border-radius: 5px;
  padding: 1rem;
  padding-bottom: 450px;
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
`;

export default function MovieDetails() {
  const movieTitle = "영화123";
  const releaseYear = "2023";
  const director = "김아무개";
  const actor = "이아무개";
  const storyline = "이것은 영화 줄거리입니다.";

  return (
    <MovieDetailsContainer>
      <div className="detail-box">
        <div className="title-share">
          <h2>영화 제목: {movieTitle}</h2>
          <div className="share">
            <ShareIcon title="페이지 공유" />
          </div>
        </div>
        <p>개봉 년도: {releaseYear}</p>
        <p>감독: {director}</p>
        <p>배우: {actor}</p>
        <p>줄거리: {storyline}</p>
      </div>
    </MovieDetailsContainer>
  );
}
