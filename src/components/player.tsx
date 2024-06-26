import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ITrackInfo,
  useIsPlayingStore,
  useTrackInfoStore,
} from "../stores/video";
import { useEffect, useRef, useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import { useVideoIdStore } from "../stores/video";

export default function Player() {
  const { videoId } = useVideoIdStore();
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const { isPlaying, setIsPlaying } = useIsPlayingStore();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const { trackInfo } = useTrackInfoStore();

  const onReady = (e) => {
    setPlayer(e.target);
    console.log(e.target);
    setDuration(e.target.getDuration());
  };

  const playVideo = () => {
    player?.playVideo();
    setIsPlaying(true);
  };

  const pauseVideo = () => {
    player?.pauseVideo();
    setIsPlaying(false);
  };
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && player) {
      interval = setInterval(() => {
        setCurrentTime(player.getCurrentTime());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, player]);
  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
    },
  };
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };
  const progressBarWidth = duration
    ? `${(currentTime / duration) * 100}%`
    : "0%";

  const handleProgressBarClick = (
    e: MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (progressBarRef.current && player) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const clickTime = (clickPosition / rect.width) * duration;
      player.seekTo(clickTime, true);
      setCurrentTime(clickTime);
    }
  };
  return (
    <>
      {videoId && (
        <div className="grid grid-cols-[1fr_1fr_1fr] bg-white sticky bottom-0 border border-t">
          <div className="flex  text-sm items-center justify-center py-5">
            <img className="w-10" src={trackInfo.imgUrl} alt={trackInfo.name} />
            <div className="ml-3">
              <div>{trackInfo.name}</div>
              <div className="text-xs text-gray-300">{trackInfo.artists}</div>
            </div>
          </div>
          <div className="flex text-xs gap-10 items-center justify-center">
            <span>{formatTime(currentTime)}</span>
            <div
              className="relative w-[200px] h-1 bg-gray-300"
              onClick={handleProgressBarClick}
              ref={progressBarRef}
            >
              <div
                className="absolute left-0 top-0 h-1 bg-black"
                style={{ width: progressBarWidth }}
              ></div>
            </div>
            <span>{formatTime(duration)}</span>
          </div>
          <div className=" flex justify-center items-center">
            <div className="w-2">
              <YouTube videoId={videoId} opts={opts} onReady={onReady} />
              {isPlaying ? (
                <FontAwesomeIcon icon={faPause} onClick={pauseVideo} />
              ) : (
                <FontAwesomeIcon icon={faPlay} onClick={playVideo} />
              )}
            </div>
            <div></div>
          </div>
        </div>
      )}
    </>
  );
}
