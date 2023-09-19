import { type } from "os";

export type Movie = {
  movieId: number;
  title: string;
  genre: string;
  streamingURL: string;
  previewPicture: string;
  description: string;
  duration?: any;
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
};

export type HistoryRecord = {
  userID: number;
  movieID: number;
  lastPosition: number;
};
export type GenrePageProps = {
  genre: string;
};

export type MovieResponseDto = {
  id: number;
  title: string;
  genre: string;
};
