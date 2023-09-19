import React, { useEffect, useState } from "react";
import axios from "axios";
import { MovieResponseDto } from "../type/VideoType";
import '../component/CSS/recommend.css'

const TopRatedRecommendations: React.FC = () => {
  const [topRatedMovies, setTopRatedMovies] = useState<
    MovieResponseDto[] | undefined
  >([]);

  useEffect(() => {
    const fetchTopRatedMovies = async () => {
      try {
        const response = await axios.get(
          "/api/movies/recommendations/top-rated"
        );
        const data: MovieResponseDto[] = response.data;
        setTopRatedMovies(data);
      } catch (error) {
        console.error("상위 평점 영화 추천 요청 오류:", error);
      }
    };

    fetchTopRatedMovies();
  }, []);

  return (
    <div className="recommend-page">
      <h2>상위 평점 4점 이상 영화 추천</h2>
      <ul>
        {topRatedMovies?.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default TopRatedRecommendations;
