import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Movie } from '../type/VideoType';
import '../component/CSS/popupmodal.css'
import '../component/CSS/GenreVideo.css'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import PopupModal from '../component/Modal';

//api사용가능해지면 지워주기를 희망
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

const handleDeleteClick = async () => {
  // if (selectedMovieID !== null) {
  //   try {
  //     await deleteMovie(selectedMovieID);
  //     console.log('영화 삭제 성공');
  //     setSelectedMovieID(null);
  //   } catch (error) {
  //     console.error('영화 삭제 오류:', error);
  //   }
  // }
};

const NoVideosMessage = () => (
  <div className="no-videos-message">해당 장르의 비디오가 없네요...</div>
);

const GenrePage: React.FC = () => {
  const navigate = useNavigate();
  const { genre } = useParams<{ genre: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadedMovies, setLoadedMovies] = useState<number>(6);
  const [selectedMovieID, setSelectedMovieID] = useState<number | null>(null)

  const handleMenuClick = (movieID: number) => {
    setSelectedMovieID(movieID);
  };

  const handleMovieClick = (movieID: number) => {
    // const userID = 1; //일단 임의로 채워넣은값
    // const lastPosition = 0; //일단 임의로 채워넣은값

    //axios.post('/api/history', { userID, movieID, lastPosition })
    //.then((response) => {
    //  console.log('History recorded:', response.data);
    //})
    //.catch((error: Error) => {
    //  console.error('Error recording history:', error);
    //});

    navigate(`/api/stream/${movieID}`);
  };

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
              <img src={movie.posterUrl} alt={movie.title} onClick={() => handleMovieClick(movie.moviesID)} />
              <div className="video-title" onClick={() => handleMovieClick(movie.moviesID)}>{movie.title}</div>
              <div className="menu-icon" onClick={() => handleMenuClick(movie.moviesID)}/>
            </div>
          ))
        )}
      </div>
      {selectedMovieID !== null && (
        <PopupModal
          title="영상 삭제"
          message="정말로 이 영상을 삭제하시겠습니까?"
          onDeleteClick={handleDeleteClick}
          onCancelClick={() => setSelectedMovieID(null)}
        />
      )}
    </main>
  );
};

export default GenrePage;