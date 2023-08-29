import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GenrePageProps, Movie, MoviesResponse } from '../type/VideoType';
import { useParams } from 'react-router-dom';
import './CSS/GenreVideo.css'

const GenrePage: React.FC<GenrePageProps> = ({ genre }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadedMovies, setLoadedMovies] = useState<number>(3);// 가로로 나열될 동영상 수
  
  useEffect(() => {
    axios.get<MoviesResponse>(`/api/movies?genre=${genre}`)
      .then((response) => {
        setMovies(response.data.movies);
      })
      .catch((error) => {
        console.error('Error fetching genre movies:', error);
      });
  }, [genre]);

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
    <div className="genre-page">
      <h2>{genre} 장르 영화 목록</h2>
      <div className="video-container">
        {movies.length === 0 ? (
          <div className="no-videos-message">해당 장르의 비디오가 없네요...</div>
        ) : (
          movies.slice(0, loadedMovies).map((movie) => (
            <div key={movie.moviesID} className="video-item">
              {movie.title}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GenrePage;