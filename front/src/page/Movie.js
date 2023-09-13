import MovieDetails from "../component/MovieDetail";
import VideoPlayer from "../component/VideoPlayer";
import MovieComment from "../component/MovieComment";
import styled from "styled-components";

const MovieContainer = styled.div`
  margin-top: 80px;
  display: flex;
  justify-content: center;
  background-color: #262626;
  color: white;

  .player-and-details {
    display: flex;
    flex-direction: column;
  }
`;

export default function Movie() {
  return (
    <MovieContainer>
      <div className="player-and-details">
        <VideoPlayer />
        <MovieDetails />
      </div>
      <MovieComment />
    </MovieContainer>
  );
}
