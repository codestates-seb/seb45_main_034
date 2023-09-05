import React from "react";
import YouTube from "react-youtube";
import styled from "styled-components";

const VideoPlayerContainer = styled.div`
  margin: 20px;
  
`;

const StyledYouTube = styled(YouTube)`
  max-width: 100%;
`;

export default function VideoPlayer() {
  const videoId = "_B13xpmyqvg";

  return (
    <VideoPlayerContainer>
      <StyledYouTube
        videoId={videoId}
        opts={{
          width: "640",
          height: "360",
        }}
      />
    </VideoPlayerContainer>
  );
}
