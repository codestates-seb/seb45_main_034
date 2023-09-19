import React, { useEffect, useState } from "react";
import axios from "axios";
import { MovieResponseDto } from "../type/VideoType";
import Cookies from "js-cookie";
import '../component/CSS/recommend.css'

interface UserRecommendationsProps {
  userId: string;
}

const UserRecommendations: React.FC<UserRecommendationsProps> = ({
  userId,
}) => {
  const [recommendedMovies, setRecommendedMovies] = useState<
    MovieResponseDto[] | undefined
  >([]);

  useEffect(() => {
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

    const fetchUserRecommendations = async () => {
      try {
        const response = await instance.get(
          `/api/movies/recommendations/user/${userId}`
        );
        const data: MovieResponseDto[] = response.data;
        setRecommendedMovies(data);
      } catch (error) {
        console.error("Error fetching user recommendations:", error);
      }
    };

    fetchUserRecommendations();
  }, [userId]);

  return (
    <div className='recommend-page'>
      <h2>{`${userId}님을 위한 영화 추천`}</h2>
      <ul>
        {recommendedMovies?.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserRecommendations;
