import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Movie } from '../type/VideoType';
import '../component/CSS/popupmodal.css';
import '../component/CSS/GenreVideo.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import PopupModal from '../component/Modal';

const instance = axios.create({
  baseURL: 'http://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080',
});

interface MoviesResponse {
  movies: Movie[];
}

const NoVideosMessage = () => (
  <div className="no-videos-message">해당 장르의 비디오가 없네요...</div>
);

const GenrePage: React.FC = () => {
  const navigate = useNavigate();
  const { genre } = useParams<{ genre: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadedMovies, setLoadedMovies] = useState<number>(6);
  const [selectedMovieID, setSelectedMovieID] = useState<number | null>(null);

  const handleMenuClick = (movieID: number) => {
    setSelectedMovieID(movieID);
  };

  const handleMovieClick = (movie: Movie) => {
    // const userID = 1; // 일단 임의로 채워넣은 값
    // const lastPosition = 0; // 일단 임의로 채워넣은 값

    // instance
    //   .post('/api/history', { userID, movieId: movie.movieId, lastPosition })
    //   .then((response) => {
    //     console.log('History recorded:', response.data);
    //   })
    //   .catch((error: Error) => {
    //     console.error('Error recording history:', error);
    //   });

    navigate(`/stream/${movie.movieId}`);
  };

  useEffect(() => {
    instance
      .get<MoviesResponse>(`/api/movies/all?page=1&size=10&genre=${genre}`)
      .then((response) => {
        if (response.data.movies) {
          setMovies(response.data.movies);
        } else {
          console.error('서버에서 영화 목록을 불러오지 못했습니다.');
        }
      })
      .catch((error: unknown) => {
        console.error('Error fetching genre movies:', error);
      });
  }, [genre]);

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
            <div key={movie.movieId} className="genrevideo-item">
              <img src={movie.streamingURL} alt={movie.title} onClick={() => handleMovieClick(movie)} />
              <div className="video-title" onClick={() => handleMovieClick(movie)}>{movie.title}</div>
              <div className="menu-icon" onClick={() => handleMenuClick(movie.movieId)} />
            </div>
          ))
        )}
      </div>
      {selectedMovieID !== null && (
        <PopupModal
          title="영상 삭제"
          message="정말로 이 영상을 삭제하시겠습니까?"
          onDeleteClick={() => {}}
          onCancelClick={() => setSelectedMovieID(null)}
        />
      )}
    </main>
  );
};

export default GenrePage;