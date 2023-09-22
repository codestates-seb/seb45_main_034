import React, { useEffect, useState } from "react";
import axios from "axios";
import { MovieResponseDto } from "../type/VideoType";
import Cookies from "js-cookie";

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
