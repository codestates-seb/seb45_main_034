import styled from "styled-components";
import VideoList from "../component/Videolist";

const Mainvideo = styled.div`
  display: flex;`;

const Home = () => {
    return(
    <Mainvideo>
     <VideoList/>
    </Mainvideo>
    )
}
export default Home