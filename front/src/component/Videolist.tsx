import React, { useState, useEffect } from 'react';
import './CSS/Videolist.css';
import { Movie } from '../type/VideoType';
import { useNavigate } from 'react-router-dom';
import { deleteMovie } from '../util/fetchVideo';
import PopupModal from './Modal';
import axios from 'axios';

interface GenreCounts {
  [genre: string]: number;
}

const VideoList: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadedMovies, setLoadedMovies] = useState<number>(5);
  const [genreCounts, setGenreCounts] = useState<GenreCounts>({});
  const [selectedMovieID, setSelectedMovieID] = useState<number | null>(null)

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

  // 더미 데이터
  const dummyData: Movie[] = [
    { moviesID: 1, title: '더미 영화 1', genre: 'SF', posterUrl: '영화 1의 이미지 URL', },
    { moviesID: 2, title: '더미 영화 2', genre: '무료', posterUrl: '영화 2의 이미지 URL', },
    { moviesID: 3, title: '더미 영화 3', genre: '드라마', posterUrl: '영화 3의 이미지 URL', },
    { moviesID: 4, title: '더미 영화 4', genre: '드라마', posterUrl: '영화 4의 이미지 URL', },
    { moviesID: 5, title: '더미 영화 5', genre: 'SF', posterUrl: '영화 5의 이미지 URL', },
    { moviesID: 6, title: '더미 영화 6', genre: 'SF', posterUrl: '영화 6의 이미지 URL', },
    { moviesID: 7, title: '더미 영화 7', genre: '무료', posterUrl: '영화 7의 이미지 URL', },
    { moviesID: 8, title: '더미 영화 8', genre: '공포', posterUrl: '영화 8의 이미지 URL', },
    { moviesID: 9, title: '더미 영화 9', genre: 'SF', posterUrl: '영화 9의 이미지 URL', },
    { moviesID: 10, title: '더미 영화 10', genre: 'SF', posterUrl: '영화 10의 이미지 URL', },
    { moviesID: 11, title: '더미 영화 11', genre: 'SF', posterUrl: '영화 11의 이미지 URL', },
    { moviesID: 12, title: '더미 영화 12', genre: 'SF', posterUrl: '영화 12의 이미지 URL', },
  ];

  // 아직 못쓰는 부분 (추후 검토도 필요할것으로 보임)
  const handleMovieClick = (movieID: number) => {
    const userID = 1; //일단 임의로 채워넣은값
    const lastPosition = 0; //일단 임의로 채워넣은값

    axios.post('/api/history', { userID, movieID, lastPosition })
    .then((response) => {
     console.log('History recorded:', response.data);
    })
    .catch((error: Error) => {
     console.error('Error recording history:', error);
    });

    navigate(`/stream/${movieID}`);
  };

  // 무한 스크롤기능
  const handleScroll = (genre: string) => (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const scrollLeft = target.scrollLeft;

    if (target.scrollWidth - scrollLeft === target.clientWidth) {
      setLoadedMovies((prevLoaded) => prevLoaded + 5);
    }
  };

  useEffect(() => {
    setMovies(dummyData);

    const counts: GenreCounts = dummyData.reduce((acc, movie) => {
      if (acc[movie.genre]) {
        acc[movie.genre]++;
      } else {
        acc[movie.genre] = 1;
      }
      return acc;
    }, {} as GenreCounts);
    setGenreCounts(counts);
  }, []);

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
                  .map((movie) => (
                    <div key={movie.moviesID} className="video-item">
                      <img src={movie.posterUrl} alt={movie.title} onClick={() => handleMovieClick(movie.moviesID)} />
                      <div className="video-title" onClick={() => handleMovieClick(movie.moviesID)}>{movie.title}</div>
                      <div className="menu-icon" onClick={() => handleMenuClick(movie.moviesID)}/>
                    </div>
                  ))}
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