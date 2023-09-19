import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Movie } from '../type/VideoType';
import '../component/CSS/popupmodal.css';
import '../component/CSS/GenreVideo.css';
import { Link, useLocation, useParams } from 'react-router-dom';
import PopupModal from '../component/Modal';
import { formatVideoDuration } from '../component/videoduration';
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
interface MoviesResponse {
  movies: Movie[];
}

const NoVideosMessage = () => (
  <div className="no-videos-message">해당 장르의 비디오가 없네요...</div>
);

const GenrePage: React.FC = () => {
  const { genre } = useParams<{ genre: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadedMovies, setLoadedMovies] = useState<number>(6);
  const [selectedMovieID, setSelectedMovieID] = useState<number | null>(null);
  const [userRoles, setUserRoles] = useState<boolean>();
  const location = useLocation();
  const [videoDurations, setVideoDurations] = useState<{ [key: number]: string }>({});
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const userRoles = Cookies.get("userRoles");

    if (userRoles) {
      setIsAdmin(userRoles === "ADMIN");
    } else {
      setIsAdmin(false);
    }
  }, []);

  const handleMenuClick = (movieID: number) => {
    setSelectedMovieID(movieID);
  };

  const handleMovieClick = (movie: Movie) => {
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get(`/api/movies/all?page=1&size=10&genre=${genre}`);
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

  const fetchVideoDuration = async (movie: Movie) => {
    try {
      const video = document.createElement('video');
      video.src = movie.streamingURL;
  
      await new Promise<void>((resolve, reject) => {
        video.addEventListener('loadedmetadata', () => {
          const duration = video.duration;
          videoDurations[movie.movieId] = formatVideoDuration(duration);
          resolve();
        });
  
        video.addEventListener('error', (error) => {
          console.error('비디오를 로드하는 중 오류 발생:', error);
          reject(error);
        });
  
        video.load();
      });
    } catch (error) {
      console.error('비디오 길이를 가져오는 중 오류 발생:', error);
      videoDurations[movie.movieId] = '00:00';
    }
  };

  return (
    <main className="genre-page">
      <h2>{genre}</h2>
      <div className="genrevideo-container">
        {movies.length === 0 ? (
          <NoVideosMessage />
        ) : (
          movies
            .filter((movie) => movie.genre === genre)
            .slice(0, loadedMovies)
            .map((movie) => {
              const duration = videoDurations[movie.movieId] || '00:00';
  
              return (
                <div key={movie.movieId} className="genrevideo-item">
                  <Link to={`/stream/${movie.movieId}`}>
                  <img src={movie.previewPicture} alt={movie.title} onClick={() => handleMovieClick(movie)} />
                  <div className="video-title" onClick={() => handleMovieClick(movie)}>
                    {movie.title}
                  </div>
                  <p className="genrevideo-description">{movie.description}</p>
                  </Link>
                  {isAdmin && <div className="menu-icon" onClick={() => handleMenuClick(movie.movieId)} />}
                  <div className="video-duration">{formatVideoDuration(parseFloat(duration))}</div>
                </div>
              );
            })
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
