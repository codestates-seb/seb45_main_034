import React from "react";
import styled from "styled-components";

const MovieDetailsContainer = styled.div`
  margin: 20px;
  border: solid 1px black;
  max-width: 100%;
  border-radius: 5px;

  .detail-box {
    display: flex;
    flex-direction: column;
  }
`;

export default function MovieDetails() {
  const movieTitle = "영화 제목";
  const releaseYear = "2023";
  const director = "김아무개";
  const description = "이것은 영화 설명입니다.";

  return (
    <MovieDetailsContainer>
      <div className="detail-box">
        <h2>{movieTitle}</h2>
        <p>개봉년도: {releaseYear}</p>
        <p>영화 감독: {director}</p>
        <p>영화 설명: {description}</p>
      </div>
    </MovieDetailsContainer>
  );
}
