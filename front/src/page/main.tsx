import styled from "styled-components";
import VideoList from "../component/Videolist";

const Mainvideo = styled.div`
  margin-top: 80px;
  display: flex;`;

const Home = () => {
    return(
    <Mainvideo>
     <VideoList/>
    </Mainvideo>
    )
}
export default Home