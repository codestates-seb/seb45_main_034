import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ReactPlayer from "react-player";
import VideoTime from "./VideoTime";
import { ReactComponent as PlayIcon } from "../images/player-play-filled.svg";
import { ReactComponent as PauseIcon } from "../images/player-pause-fill.svg";
import { ReactComponent as BackwardIcon } from "../images/backward-5-seconds.svg";
import { ReactComponent as ForwardIcon } from "../images/forward-5-seconds.svg";
import { ReactComponent as InFullScreen } from "../images/sharp-fullscreen.svg";
import { ReactComponent as OutFullScreen } from "../images/sharp-fullscreen-exit.svg";
import { ReactComponent as OpenCaptionIcon } from "../images/closed-caption-outline.svg";
import { ReactComponent as CloseCaptionIcon } from "../images/closed-caption.svg";
import { ReactComponent as QualityIcon } from "../images/settings-linear.svg";
import { ReactComponent as VolumeIcon } from "../images/volume-high.svg";
import { ReactComponent as VolumeMuteIcon } from "../images/volume-mute.svg";
import { useParams } from "react-router-dom";

import axios from "axios";

const instance = axios.create({
  baseURL: "http://ec2-54-180-87-8.ap-northeast-2.compute.amazonaws.com:8080",
});

const VideoContainer = styled.div`
  margin: 20px;
  background-color: transparent;
  position: relative;
`;

const ControlsContainer = styled.div`
  width: 99.9%; // 100%로 하면 전체화면일때 외곽으로 마우스커서를 보내도 컨트롤러가 보임
  height: 99.9%; // 이렇게하면 왼쪽 가장자리 제외하고 컨트롤러 숨겨짐
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  opacity: 1; // 완성하면 0으로 변경
  transition: opacity 0.5s ease;

  &:hover {
    opacity: 1;
  }
`;

const MiddleOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
  width: 80%;
`;

const ControlButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  color: white;
  border: none;
  padding: 1rem;
  cursor: pointer;
  border-radius: 50%;

  &:hover {
    background-color: rgba(0, 0, 0, 0.6);
    transition: 0.5s ease;
  }
`;

const BottomOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 2;
  width: 100%;
`;

const PlaySlider = styled.input`
  width: 100%;
  height: 0.3rem;
  border-radius: 0.1rem;
  cursor: pointer;
  background-color: white;
  -webkit-appearance: none;
`;

const VolumeSliderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const VolumeSlider = styled(PlaySlider)`
  width: 4rem;
`;

const Volume = styled.div`
  display: flex;
`;

const Caption = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  text-align: center;
  bottom: 100px;
  overflow-wrap: break-word;
  pointer-events: none;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 1);
`;

const TimeDisplay = styled.span`
  color: white;
  padding: 0 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  z-index: 2;
  font-size: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 1);
  pointer-events: none;
`;

const OptionsButton = styled(ControlButton)`
  padding: 0.3rem;
`;

const OptionsList = styled.div`
  display: ${({ visible }) => (visible ? "block" : "none")};
  background-color: rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: absolute;
  right: 2.7rem;
  bottom: 2.7rem;
  width: 4rem;
  z-index: 3;
`;

const Option = styled.button`
  background-color: transparent;
  color: black;
  border: none;
  width: 100%;
  padding: 6px;
  cursor: pointer;

  &:hover {
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    transition: 0.5s ease;
  }
`;

export default function VideoPlayer() {
  const [playing, setPlaying] = useState(false);
  const [screenClicked, setScreenClicked] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [isQualityOptionsVisible, setQualityOptionsVisible] = useState(false);
  const [isCaptionOptionsVisible, setCaptionOptionsVisible] = useState(false);
  const [isVolumeSliderVisible, setVolumeSliderVisible] = useState(false);
  const [selectedCaptionLanguage, setSelectedCaptionLanguage] = useState(null);
  const [volume, setVolume] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoRef = useRef(null);
  const { movieId } = useParams();

  const [videoURL, setVideoURL] = useState("");
  const [movieData, setMovieData] = useState(null);

  useEffect(() => {
    if (movieId) {
      instance
        .get(`/api/movies/${movieId}`)
        .then((response) => {
          const streamingURL = response.data.movieResponseDto;
          setVideoURL(streamingURL);
          setMovieData(streamingURL);
        })
        .catch((error) => {
          console.error("비디오 URL을 가져오는 동안 오류 발생:", error);
        });
    } else {
      console.error("유효하지 않은 movieId입니다.");
    }
  }, [movieId]);

  // useEffect를 사용하여 키보드 이벤트를 처리
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === " ") {
        // 스페이스바 키가 눌렸을 때 재생 및 일시정지를 토글
        setPlaying((prevPlaying) => !prevPlaying);
        setScreenClicked(true);
        // 스페이스바의 기본 동작을 차단
        event.preventDefault();
      }
    };

    // 이 컴포넌트가 마운트되었을 때 키보드 이벤트 리스너 추가
    window.addEventListener("keydown", handleKeyPress);

    // 이 컴포넌트가 언마운트될 때 키보드 이벤트 리스너 제거
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행

  // 키보드 이벤트를 처리하는 함수
  const handleKeyPress = (event) => {
    if (event.key === " ") {
      // 스페이스바 키가 눌렸을 때 재생 및 일시정지를 토글
      setPlaying((prevPlaying) => !prevPlaying);
      setScreenClicked(true);
      // 스페이스바의 기본 동작을 차단
      event.preventDefault();
    } else if (event.key === "ArrowLeft") {
      // 왼쪽 방향키 눌렸을 때 비디오 5초 앞으로 이동
      handleSeek(-5);
    } else if (event.key === "ArrowRight") {
      // 오른쪽 방향키 눌렸을 때 비디오 5초 뒤로 이동
      handleSeek(5);
    }
  };

  // 비디오 시간을 변경하는 함수
  const handleSeek = (seconds) => {
    if (videoRef.current) {
      const newSeekTime = currentTime + seconds;
      setSeekTime(newSeekTime);
      videoRef.current.seekTo(newSeekTime);
    }
  };

  // useEffect를 사용하여 키보드 이벤트 리스너 추가
  useEffect(() => {
    // 이 컴포넌트가 마운트되었을 때 키보드 이벤트 리스너 추가
    window.addEventListener("keydown", handleKeyPress);

    // 이 컴포넌트가 언마운트될 때 키보드 이벤트 리스너 제거
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  const handlePlayClick = () => {
    setPlaying(!playing);
    setScreenClicked(true);
  };

  const handleRewind = () => {
    if (videoRef.current) {
      const newSeekTime = currentTime - 5;
      setSeekTime(newSeekTime);
      videoRef.current.seekTo(newSeekTime);
    }
  };

  const handleForward = () => {
    if (videoRef.current) {
      const newSeekTime = currentTime + 5;
      setSeekTime(newSeekTime);
      videoRef.current.seekTo(newSeekTime);
    }
  };

  const handleTimeUpdate = (e) => {
    setCurrentTime(e.playedSeconds);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
    setSeekTime(0);
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      const videoContainer = document.getElementById("video-container");
      if (videoContainer) {
        videoContainer.requestFullscreen();
        setIsFullScreen(true);
      }
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const handleQualityOptionsClick = () => {
    setQualityOptionsVisible(!isQualityOptionsVisible);
    setCaptionOptionsVisible(false);
  };

  const handleCaptionOptionsClick = () => {
    setCaptionOptionsVisible(!isCaptionOptionsVisible);
    setQualityOptionsVisible(false);
  };

  const handleOptionQulitySelect = (option) => {
    // 화질 선택 기능
    console.log("Selected option:", option);
  };

  const handleOptionCaptionSelect = (option) => {
    if (selectedCaptionLanguage === option) {
      setSelectedCaptionLanguage(null);
    } else {
      setSelectedCaptionLanguage(option);
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  const toggleVolumeSlider = () => {
    setVolumeSliderVisible(!isVolumeSliderVisible);
  };

  const handleVolumeClick = () => {
    const newVolume = volume === 0 ? 1 : 0;
    setVolume(newVolume);
  };

  const handleVolumeSliderMouseEnter = () => {
    setVolumeSliderVisible(true);
  };

  const handleVolumeSliderMouseLeave = () => {
    // 마우스가 볼륨 슬라이더를 떠날 때 슬라이더를 숨깁니다.
    if (!isVolumeSliderVisible) {
      setVolumeSliderVisible(false);
    }
  };

  return (
    <VideoContainer
      id="video-container"
      style={{ padding: videoURL ? "0" : "15.6rem 27.6rem" }}
    >
      <ReactPlayer
        width="100%"
        height="100%"
        ref={videoRef}
        url={videoURL.streamingURL}
        controls={false}
        playing={playing}
        volume={volume}
        onProgress={handleTimeUpdate}
        onDuration={handleDuration}
      />
      <ControlsContainer>
        <Title>{movieData ? movieData.title : ""}</Title>
        <MiddleOption>
          <ControlButton onClick={handleRewind} title="5초 앞으로">
            <BackwardIcon />
          </ControlButton>
          <ControlButton
            onClick={handlePlayClick}
            title={playing === false ? "재생" : "일시정지"}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </ControlButton>
          <ControlButton onClick={handleForward} title="5초 뒤로">
            <ForwardIcon />
          </ControlButton>
        </MiddleOption>
        <BottomOption>
          <OptionsButton
            onClick={handlePlayClick}
            title={playing === false ? "재생" : "일시정지"}
          >
            {playing ? (
              <PauseIcon style={{ width: "1.6rem", height: "1.6rem" }} />
            ) : (
              <PlayIcon style={{ width: "1.6rem", height: "1.6rem" }} />
            )}
          </OptionsButton>
          <Volume onMouseLeave={() => toggleVolumeSlider(true)}>
            <OptionsButton
              onClick={handleVolumeClick}
              title={volume === 0 ? "음소거 해제" : "음소거 "}
              onMouseEnter={handleVolumeSliderMouseEnter}
              onMouseLeave={handleVolumeSliderMouseLeave}
            >
              {volume === 0 ? <VolumeMuteIcon /> : <VolumeIcon />}
            </OptionsButton>
            {isVolumeSliderVisible && (
              <VolumeSliderContainer>
                <VolumeSlider
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) =>
                    handleVolumeChange(parseFloat(e.target.value))
                  }
                />
              </VolumeSliderContainer>
            )}
          </Volume>
          <TimeDisplay>{VideoTime(currentTime)}</TimeDisplay>
          <PlaySlider
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            playing={playing}
            volume={volume}
            onChange={(e) => setSeekTime(e.target.value)}
            onMouseUp={() => {
              if (videoRef.current) {
                videoRef.current.seekTo(seekTime, "seconds");
              }
            }}
          />
          <TimeDisplay>{VideoTime(duration)}</TimeDisplay>
          {selectedCaptionLanguage && (
            <OptionsButton onClick={handleCaptionOptionsClick} title="자막">
              <CloseCaptionIcon />
            </OptionsButton>
          )}
          {!selectedCaptionLanguage && (
            <OptionsButton onClick={handleCaptionOptionsClick} title="자막">
              <OpenCaptionIcon />
            </OptionsButton>
          )}
          <OptionsList visible={isCaptionOptionsVisible}>
            <Option
              onClick={() => handleOptionCaptionSelect("한국어 자막입니다.")}
            >
              한국어
            </Option>
            <Option
              onClick={() => handleOptionCaptionSelect("English captions")}
            >
              English
            </Option>
          </OptionsList>
          <OptionsButton onClick={handleQualityOptionsClick} title="화질">
            <QualityIcon />
          </OptionsButton>
          <OptionsList visible={isQualityOptionsVisible}>
            <Option onClick={() => handleOptionQulitySelect("1080p")}>
              1080p
            </Option>
            <Option onClick={() => handleOptionQulitySelect("720p")}>
              720p
            </Option>
            <Option onClick={() => handleOptionQulitySelect("480p")}>
              480p
            </Option>
          </OptionsList>
          <OptionsButton
            onClick={toggleFullScreen}
            title={isFullScreen === false ? "전체화면" : "전체화면 종료"}
          >
            {isFullScreen ? <OutFullScreen /> : <InFullScreen />}
          </OptionsButton>
        </BottomOption>
      </ControlsContainer>
      <Caption>{selectedCaptionLanguage}</Caption>
    </VideoContainer>
  );
}
