import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ReactPlayer from "react-player";
import { ReactComponent as PlayIcon } from "../images/player-play-filled.svg";
import { ReactComponent as PauseIcon } from "../images/player-pause-fill.svg";
import { ReactComponent as BackIcon } from "../images/player-skip-back-filled.svg";
import { ReactComponent as ForwardIcon } from "../images/player-skip-forward-filled.svg";
import { ReactComponent as InFullScreen } from "../images/sharp-fullscreen.svg";
import { ReactComponent as CaptionIcon } from "../images/closed-caption-alt.svg";
import { ReactComponent as QualityIcon } from "../images/settings-linear.svg";
import { ReactComponent as VolumeIcon } from "../images/volume-high.svg";
import { ReactComponent as VolumeMuteIcon } from "../images/volume-mute.svg";
import { ReactComponent as ShareIcon } from "../images/share.svg";

const VideoContainer = styled.div`
  margin: 20px;
  background-color: transparent;
  position: relative;
`;

const ControlsContainer = styled.div`
  width: 100%;
  height: 100%;
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

const ControlButtonBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10rem;
  z-index: 2;
  width: 100%;
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
    background-color: rgba(0, 0, 0, 0.3);
    transition: 0.5s ease;
  }
`;

const Input = styled.input`
  width: 100%;
`;

const ControlOptionBox = styled.div`
  width: 100%;
`;

const Caption = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  text-align: center;
  bottom: 60px;
  overflow-wrap: break-word;
  pointer-events: none;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 1);
`;

const BottomOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 2;
  width: 100%;
`;

const TimeDisplay = styled.span`
  color: white;
  padding: 0 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
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
  background-color: rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: absolute;
  right: 2.5rem;
  bottom: 2.5rem;
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
    background-color: rgba(0, 0, 0, 0.3);
    transition: 0.5s ease;
  }
`;

const OptionTop = styled(Option)`
  border-radius: 4px 4px 0 0;
`;
const OptionBottom = styled(Option)`
  border-radius: 0 0 4px 4px;
`;

export default function VideoPlayer() {
  const [playing, setPlaying] = useState(false);
  const [screenClicked, setScreenClicked] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [isQualityOptionsVisible, setQualityOptionsVisible] = useState(false); // State for quality options
  const [isCaptionOptionsVisible, setCaptionOptionsVisible] = useState(false); // State for caption options
  const [selectedCaptionLanguage, setSelectedCaptionLanguage] = useState(null);
  const [volume, setVolume] = useState(1);
  const videoRef = useRef(null);

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
    let video = videoRef.current.getInternalPlayer();

    if (!document.fullscreenElement) {
      video.requestFullscreen();
    } else {
      document.exitFullscreen();
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
    // Handle option selection logic here
    console.log("Selected option:", option);
  };

  const handleOptionCaptionSelect = (option) => {
    if (selectedCaptionLanguage === option) {
      setSelectedCaptionLanguage(null);
    } else {
      setSelectedCaptionLanguage(option);
    }
  };

  const handleVolumeChange = () => {
    // 볼륨을 0 (음소거)과 1 (최대 볼륨) 사이에서 토글합니다.
    const newVolume = volume === 0 ? 1 : 0;
    setVolume(newVolume);
  };

  return (
    <VideoContainer>
      <ReactPlayer
        width="100%"
        height="100%"
        ref={videoRef}
        url={process.env.PUBLIC_URL + "/video-sample.mp4"}
        controls={false}
        playing={playing}
        volume={volume}
        onProgress={handleTimeUpdate}
        onDuration={handleDuration}
      />
      <ControlsContainer>
        <Title>영화 제목</Title>
        <ControlButtonBox>
          <ControlButton onClick={handleRewind} title="5초 앞으로">
            <BackIcon />
          </ControlButton>
          <ControlButton onClick={handlePlayClick}>
            {playing ? (
              <PauseIcon title="일시중지" />
            ) : (
              <PlayIcon title="재생" />
            )}
          </ControlButton>

          <ControlButton onClick={handleForward} title="5초 뒤로">
            <ForwardIcon />
          </ControlButton>
        </ControlButtonBox>
        <ControlOptionBox>
          <BottomOption>
            <OptionsButton onClick={handlePlayClick}>
              {playing ? (
                <PauseIcon
                  title="일시중지"
                  style={{ width: "1.6rem", height: "1.6rem" }}
                />
              ) : (
                <PlayIcon
                  title="재생"
                  style={{ width: "1.6rem", height: "1.6rem" }}
                />
              )}
            </OptionsButton>
            <OptionsButton onClick={handleVolumeChange} title="볼륨">
              {volume === 0 ? <VolumeMuteIcon /> : <VolumeIcon />}
            </OptionsButton>
            <TimeDisplay title="시간">{formatTime(currentTime)}</TimeDisplay>
            <Input
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
            <TimeDisplay title="시간">{formatTime(duration)}</TimeDisplay>
            <OptionsButton onClick={handleCaptionOptionsClick} title="자막">
              <CaptionIcon />
            </OptionsButton>
            <OptionsList visible={isCaptionOptionsVisible}>
              <OptionTop onClick={() => handleOptionCaptionSelect("English")}>
                English
              </OptionTop>
              <Option onClick={() => handleOptionCaptionSelect("Spanish")}>
                Spanish
              </Option>
              <OptionBottom
                onClick={() => handleOptionCaptionSelect("Deutsch")}
              >
                Deutsch
              </OptionBottom>
            </OptionsList>
            <OptionsButton onClick={handleQualityOptionsClick} title="화질">
              <QualityIcon />
            </OptionsButton>
            <OptionsList visible={isQualityOptionsVisible}>
              <OptionTop onClick={() => handleOptionQulitySelect("1080p")}>
                1080p
              </OptionTop>
              <Option onClick={() => handleOptionQulitySelect("720p")}>
                720p
              </Option>
              <OptionBottom onClick={() => handleOptionQulitySelect("480p")}>
                480p
              </OptionBottom>
            </OptionsList>
            <OptionsButton onClick={toggleFullScreen} title="전체화면">
              <InFullScreen />
            </OptionsButton>
          </BottomOption>
        </ControlOptionBox>
      </ControlsContainer>
      <Caption>{selectedCaptionLanguage}</Caption>
    </VideoContainer>
  );
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
