import React, { useState, useEffect } from 'react';
import './CSS/Videolist.css';
import { Movie } from '../type/VideoType';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { formatVideoDuration } from './videoduration';
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: 'http://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080',
});

instance.interceptors.request.use((config) => {
  const accessToken = Cookies.get("accessToken");
  
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

interface GenreCounts {
  [genre: string]: number;
}

const VideoList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadedMovies, setLoadedMovies] = useState<number>(5);
  const [genreCounts, setGenreCounts] = useState<GenreCounts>({});
  const [isLogged, setIsLogged] = useState(false);
  const [videoDurations, setVideoDurations] = useState<{ [key: number]: string}>({});
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, []);

  useEffect(() => {
    const userRoles = Cookies.get("userRoles");

    if (userRoles) {
      setIsAdmin(userRoles === "ADMIN");
    } else {
      setIsAdmin(false);
    }
  }, []);

  const handleMovieClick = (movie: Movie) => {
  };

  const handleScroll = (genre: string) => (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const scrollLeft = target.scrollLeft;
  
    if (target.scrollWidth - scrollLeft === target.clientWidth) {
      setLoadedMovies((prevLoaded) => prevLoaded + 5);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get('/api/movies/all?page=1&size=10');
        const data: any = response.data;
  
        if (data) {
          setMovies(data);
        } else {
          console.error('서버에서 영화 목록을 불러오지 못했습니다.');
        }
      } catch (error) {
        console.error('영화 목록을 불러오지 못했습니다.', error);
      }
    };
  
    fetchData();
  }, []);

  const fetchVideoDuration = async (movie: Movie) => {
    try {
      const video = document.createElement('video');
      video.src = movie.streamingURL;
  
      video.addEventListener('loadedmetadata', () => {
        const duration = video.duration;
  
        videoDurations[movie.movieId] = formatVideoDuration(duration);
      });

      video.load();
    } catch (error) {
      console.error('비디오 길이를 가져오는 중 오류 발생:', error);
      videoDurations[movie.movieId] = '00:00';
    }
  };


  useEffect(() => {
    const counts: GenreCounts = movies.reduce((acc, movie) => {
      if (acc[movie.genre]) {
        acc[movie.genre]++;
      } else {
        acc[movie.genre] = 1;
      }
      return acc;
    }, {} as GenreCounts);
    setGenreCounts(counts);
  }, [movies]);

  return (
    <div className="video-list">
      {Object.keys(genreCounts).map((genre) => (
        <div key={genre}>
          <h2>{genre}</h2>
          <div className="video-container">
            {movies.length === 0 ? (
              <div className="no-videos-message">아이고 비디오가 없네요...</div>
            ) : (
              <div className="video-container">
                {movies
                  .filter((movie) => movie.genre === genre)
                  .slice(0, loadedMovies)
                  .map((movie) => {
                    fetchVideoDuration(movie);
                    const duration = videoDurations[movie.movieId] || '00:00';

                    return (
                      <div key={movie.movieId} className="video-item">
                        <Link to={`/stream/${movie.movieId}`}>
                          <img
                            src={movie.previewPicture}
                            alt={movie.title}
                            onClick={() => handleMovieClick(movie)}
                          />
                          <div className="video-title" onClick={() => handleMovieClick(movie)}>
                            {movie.title}
                          </div>
                          <p className="video-description">{movie.description}</p>
                        </Link>
                        {isAdmin && (
                          <div
                          className="menu-icon"
                          onClick={() => navigate(`/movie/edit/${movie.movieId}`)}
                        />
                        )}
                        <div className="video-duration">{duration || null}</div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoList;