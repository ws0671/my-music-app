import {
  faList,
  faPause,
  faPlay,
  faStepBackward,
  faStepForward,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ITrackInfo,
  usePlaylistStore,
  useTrackInfoStore,
} from "../stores/video";
import { useEffect, useRef, useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import { useVideoIdStore } from "../stores/video";
import Playlist from "./playlist";

export default function Player() {
  const { videoId, setVideoId } = useVideoIdStore();
  const [playlist, setPlaylist] = useState([]);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [onPlaylist, setOnPlaylist] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const { trackInfo, isPlaying, togglePlay, setTrackInfo } =
    useTrackInfoStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isShort, setIsShort] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  console.log(playlist);

  const onReady = (e) => {
    setPlayer(e.target);
    setDuration(e.target.getDuration());
  };

  const playVideo = () => {
    player?.playVideo();
    togglePlay();
  };

  const pauseVideo = () => {
    player?.pauseVideo();
    togglePlay();
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault();
      togglePlay();
    }
  };
  useEffect(() => {
    const savedPlaylist = localStorage.getItem("playlist");
    if (savedPlaylist) {
      setPlaylist(JSON.parse(savedPlaylist));
    }
  }, []);
  useEffect(() => {
    const handleUpdatedPlaylist = () => {
      if (
        trackInfo &&
        !playlist.some((track) => track.videoId === trackInfo.videoId)
      ) {
        if (trackInfo.state === "playlist") return;
        setPlaylist((prev) => {
          const updatedPlaylist = [...prev, trackInfo];
          localStorage.setItem("playlist", JSON.stringify(updatedPlaylist));

          return updatedPlaylist;
        });
      }
    };
    handleUpdatedPlaylist();
  }, [trackInfo]);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const textWidth = containerRef.current.childNodes[0].scrollWidth;

      if (textWidth <= containerWidth) {
        setIsShort(true);
      } else {
        setIsShort(false);
      }
    }
  }, [trackInfo?.name]);
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });
  useEffect(() => {
    if (player) {
      if (isPlaying) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
    }
  }, [isPlaying]);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && player) {
      interval = setInterval(() => {
        setCurrentTime(player.getCurrentTime());
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, player]);

  useEffect(() => {
    if (player && currentTrackIndex < playlist.length) {
      setVideoId(playlist[currentTrackIndex].videoId);
      setTrackInfo(playlist[currentTrackIndex]);
    }
  }, [currentTrackIndex]);

  const onEnd = () => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      setCurrentTrackIndex(0);
    }
  };
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

  const handlePreviousTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    } else {
      setCurrentTrackIndex(playlist.length - 1);
    }
  };

  const handleNextTrack = () => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      setCurrentTrackIndex(0);
    }
  };
  return (
    <>
      <div className="flex bg-white sticky bottom-0 border border-t">
        {onPlaylist && <Playlist tracks={playlist} setPlaylist={setPlaylist} />}
        <div className="basis-1/3 flex gap-10 text-sm items-center justify-center py-5">
          <div
            onClick={() => {
              setOnPlaylist((prev) => !prev);
            }}
            className="text-xl w-10 transition-all h-10 flex justify-center items-center hover:cursor-pointer hover:rounded-full hover:bg-orange-200"
          >
            <FontAwesomeIcon icon={faList} />
          </div>
          <div className="flex justify-center w-[300px]">
            <img
              className={trackInfo ? "w-10 rounded " : ""}
              src={trackInfo?.imgUrl}
              alt={trackInfo?.name}
            />
            <div
              ref={containerRef}
              className="ml-3 relative overflow-hidden whitespace-nowrap "
            >
              <div
                className={`${
                  isShort ? "" : "animate-marquee"
                } inline-block pr-10`}
              >
                {trackInfo?.name}
              </div>
              {!isShort && (
                <>
                  <div className="animate-marquee inline-block pr-10">
                    {trackInfo?.name}
                  </div>
                  <div className="animate-marquee inline-block pr-10">
                    {trackInfo?.name}
                  </div>
                </>
              )}
              <div className="text-xs text-gray-300">{trackInfo?.artists}</div>
            </div>
          </div>
        </div>
        <div className="flex basis-1/3  text-xs gap-10 items-center justify-center">
          <span>{formatTime(currentTime)}</span>
          <div
            className="relative w-[200px] h-1 bg-gray-300"
            onClick={handleProgressBarClick}
            ref={progressBarRef}
          >
            <div
              className=" absolute left-0 top-0 h-1 bg-black"
              style={{ width: progressBarWidth }}
            ></div>
          </div>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="basis-1/3  flex justify-center items-center">
          <div className="flex justify-center items-center gap-5">
            <YouTube
              videoId={videoId}
              opts={opts}
              onReady={onReady}
              onEnd={onEnd}
            />
            <FontAwesomeIcon
              icon={faStepBackward}
              onClick={handlePreviousTrack}
              className="cursor-pointer"
            />

            {isPlaying ? (
              <FontAwesomeIcon
                icon={faPause}
                className="cursor-pointer text-lg"
                onClick={pauseVideo}
              />
            ) : (
              <FontAwesomeIcon
                icon={faPlay}
                className="cursor-pointer text-lg"
                onClick={playVideo}
              />
            )}
            <FontAwesomeIcon
              icon={faStepForward}
              onClick={handleNextTrack}
              className="cursor-pointer"
            />
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
}
