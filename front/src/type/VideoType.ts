export type Movie = {
    moviesID: number;
    title: string;
    genre: string;
  };
  
export type MoviesResponse = {
    movies: Movie[];
  };

export type HistoryRecord = {
    userID: number;
    movieID: number;
    lastPosition: number;
    timestamp: Date;
  }
export type GenrePageProps = {
    genre: string;
  }