import React, { useState, useEffect } from 'react';
import './CSS/Videolist.css';
import axios from 'axios';
import { Movie, MoviesResponse } from '../type/VideoType';

const VideoList = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadedMovies, setLoadedMovies] = useState<number>(5);

  /* 아직 못쓰는 부분 (추후 검토도 필요할것으로 보임)
  useEffect(() => {
    // API에서 영화 목록 가져오기
    axios.get<MoviesResponse>('/api/movies')
      .then((response) => {
        setMovies(response.data.movies);
        setSelectedCategory(response.data.movies[0]?.genre || '');
      })
      .catch((error: Error) => {
        console.error('Error fetching movies:', error);
      });
  }, []);*/

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;

    if (windowHeight + scrollTop === documentHeight) {
      setLoadedMovies((prevLoaded) => prevLoaded + 5);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="video-list">
      {movies.map((movie) => (
        <div key={movie.moviesID}>
          <h2>{movie.genre}</h2>
          <div className="video-container">
            {movies.length === 0 ? (
              <div className="no-videos-message">아이고 비디오가 없네요...</div>
            ) : (
              movies.slice(0, loadedMovies).map((movie) => (
                <div key={movie.moviesID} className="video-item">
                  {movie.title}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoList;
