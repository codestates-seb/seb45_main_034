export type Movie = {
    moviesID: number;
    title: string;
    genre: string;
    posterUrl: string;
  };
  
export type MoviesResponse = {
    movies: Movie[];
  };

export type Historys = {
    userID: number;
    movieID: number;
    movieTitle: string;
    lastPosition: number;
    timestamp: Date;
}

export type HistoryRecord = {
    userID: number;
    movieID: number;
    lastPosition: number;
  }
export type GenrePageProps = {
    genre: string;
  }