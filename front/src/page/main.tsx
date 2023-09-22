import styled from "styled-components";
import VideoList from "../component/Videolist";
import SideBar from "../component/Sidebar";
import { useState } from "react";

const Mainvideo = styled.div`
  display: flex;
  margin-top: 40px;
  z-index: 10;
  background-color: #1D1D1D;
  width: 100%;`
  ;

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

    return(
      <div className='app-container'>
        <SideBar setSelectedCategory={setSelectedCategory} />
    <Mainvideo>
     <VideoList/>
    </Mainvideo>
    </div>
    )
}
export default Home