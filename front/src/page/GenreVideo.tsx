import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Movie } from '../type/VideoType';
import '../component/CSS/GenreVideo.css'
import { useParams } from 'react-router-dom';

//api사용가능해지면 지워주기를 희망
const dummyData: Movie[] = [
  { moviesID: 1, title: '더미 영화 1', genre: 'SF' },
  { moviesID: 2, title: '더미 영화 2', genre: '무료' },
  { moviesID: 3, title: '더미 영화 3', genre: '드라마' },
  { moviesID: 4, title: '더미 영화 4', genre: '드라마' },
  { moviesID: 5, title: '더미 영화 5', genre: 'SF' },
  { moviesID: 6, title: '더미 영화 6', genre: 'SF' },
  { moviesID: 7, title: '더미 영화 7', genre: '무료' },
  { moviesID: 8, title: '더미 영화 8', genre: '공포' },
  { moviesID: 9, title: '더미 영화 9', genre: 'SF' },
  { moviesID: 10, title: '더미 영화 10', genre: 'SF' },
  { moviesID: 11, title: '더미 영화 11', genre: 'SF' },
  { moviesID: 12, title: '더미 영화 12', genre: 'SF' },
];

const NoVideosMessage = () => (
  <div className="no-videos-message">해당 장르의 비디오가 없네요...</div>
);

const GenrePage: React.FC = () => {
  const { genre } = useParams<{ genre: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadedMovies, setLoadedMovies] = useState<number>(6);

  //api사용되면 수정되야할
  useEffect(() => {
    const filteredMovies = dummyData.filter((movie) => movie.genre === genre);
    setMovies(filteredMovies);
  }, [genre]);

  // 나중에 사용될 코드
  // useEffect(() => {
  //   axios.get<MoviesResponse>(`/api/movies?genre=${genre}`)
  //     .then((response) => {
  //       setMovies(response.data.movies);
  //     })
  //     .catch((error: unknown) => {
  //       console.error('Error fetching genre movies:', error);
  //     });
  // }, [genre]);

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;

    if (windowHeight + scrollTop >= documentHeight - 100) {
      setLoadedMovies((prevLoaded) => prevLoaded + 6);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main className="genre-page">
      <h2>{genre}</h2>
      <div className="genrevideo-container">
        {movies.length === 0 ? (
          <NoVideosMessage />
        ) : (
          movies.slice(0, loadedMovies).map((movie) => (
            <div key={movie.moviesID} className="genrevideo-item">
              {movie.title}
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default GenrePage;