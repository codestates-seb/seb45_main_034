import React, { useState, useEffect } from 'react';
import './CSS/Videolist.css';
import { Movie } from '../type/VideoType';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteMovie } from '../util/fetchVideo';
import PopupModal from './Modal';
import axios from 'axios';
import { Link } from 'react-router-dom';

const instance = axios.create({
  baseURL: 'http://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080',
});

interface GenreCounts {
  [genre: string]: number;
}

const VideoList: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadedMovies, setLoadedMovies] = useState<number>(5);
  const [genreCounts, setGenreCounts] = useState<GenreCounts>({});
  const [selectedMovieID, setSelectedMovieID] = useState<number | null>(null);
  const [videoDurations, setVideoDurations] = useState<{ [key: number]: string}>({});
  const [userRoles, setUserRoles] = useState<boolean>()
  const location = useLocation();
  const roles = location.state?.roles;
  console.log(roles)

  useEffect(() => {
    setUserRoles(true);
  }, []);

  const handleMenuClick = (movieID: number) => {
    setSelectedMovieID(movieID);
  };

  const handleDeleteClick = async () => {
    if (selectedMovieID !== null) {
      try {
        await deleteMovie(selectedMovieID);
        console.log('영화 삭제 성공');
        setSelectedMovieID(null);
      } catch (error) {
        console.error('영화 삭제 오류:', error);
      }
    }
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

  function formatVideoDuration(duration: number) {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${formattedMinutes}:${formattedSeconds}`;
  }

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
      <div
        className={`video-container ${genreCounts[genre] > 5 ? 'scrollable' : ''}`}
        onScroll={handleScroll(genre)}
      >
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
                const isAdmin = roles === "ADMIN";

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
                    <p className="video-description">{movie.description}</p></Link>
                    {isAdmin && (
                          <div className="menu-icon" onClick={() => handleMenuClick(movie.movieId)} />
                        )}
                    <div className="video-duration">{duration || '00:00'}</div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  ))}
  {selectedMovieID !== null && (
    <PopupModal
      title="영상 삭제"
      message="정말로 이 영상을 삭제하시겠습니까?"
      onDeleteClick={handleDeleteClick}
      onCancelClick={() => setSelectedMovieID(null)}
    />
  )}
</div>
  );  
};

export default VideoList;