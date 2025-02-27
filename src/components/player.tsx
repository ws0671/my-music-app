import {
  faCirclePause,
  faCirclePlay,
  faList,
  faPause,
  faPlay,
  faRepeat,
  faShuffle,
  faStepBackward,
  faStepForward,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useCurrentTrackIndexStore,
  usePlaylistStore,
  useTrackInfoStore,
  useUserPlaylistStore,
} from "../stores/video";
import { useEffect, useRef, useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import { useVideoIdStore } from "../stores/video";
import Playlist from "./playlist";
import useSessionStore from "../stores/session";
import { addToPlaylist, fetchPlaylist } from "../utils/playlist";

interface OnReady {
  target: {
    getDuration: () => number;
  };
}
export default function Player() {
  const { videoId, setVideoId } = useVideoIdStore();
  const { playlist, setPlaylist } = usePlaylistStore();
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [onPlaylist, setOnPlaylist] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const { trackInfo, isPlaying, togglePlay, setTrackInfo } =
    useTrackInfoStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isShort, setIsShort] = useState(false);
  const { currentTrackIndex, setCurrentTrackIndex } =
    useCurrentTrackIndexStore();
  const { session } = useSessionStore();
  const { userPlaylist, setUserPlaylist, replaceUserPlaylist } =
    useUserPlaylistStore();
  const ignoreTrackInfoEffect = useRef(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const onReady = (e: OnReady) => {
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

  useEffect(() => {
    const handleUserPlaylist = async () => {
      if (session) {
        const data = await fetchPlaylist(session);
        if (data) replaceUserPlaylist(data);
      }
    };
    handleUserPlaylist();
  }, [session, replaceUserPlaylist]);
  useEffect(() => {
    const handleUpdatedPlaylist = () => {
      if (trackInfo) {
        if (trackInfo?.state === "playlist") return;

        if (session) {
          addToPlaylist(trackInfo);
          setUserPlaylist(trackInfo);
        } else {
          setPlaylist(trackInfo);
        }
      }
    };
    if (!ignoreTrackInfoEffect.current) {
      handleUpdatedPlaylist();
    } else {
      ignoreTrackInfoEffect.current = false;
    }
  }, [trackInfo, setPlaylist, setUserPlaylist, session]);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      let textWidth = 0;
      const childNode: ChildNode = containerRef.current.childNodes[0];
      if (childNode instanceof HTMLElement) {
        textWidth = childNode.scrollWidth;
      }

      if (textWidth <= containerWidth) {
        setIsShort(true);
      } else {
        setIsShort(false);
      }
    }
  }, [trackInfo?.name]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
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
    if (session) {
      if (player && currentTrackIndex < userPlaylist.length) {
        setVideoId(userPlaylist[currentTrackIndex].videoId);
        setTrackInfo(userPlaylist[currentTrackIndex]);
      }
    } else {
      if (player && currentTrackIndex < playlist.length) {
        setVideoId(playlist[currentTrackIndex].videoId);
        setTrackInfo(playlist[currentTrackIndex]);
      }
    }
  }, [currentTrackIndex]);

  const onEnd = () => {
    ignoreTrackInfoEffect.current = true;

    if (session) {
      if (shuffle) {
        const randomIndex = Math.floor(
          Math.random() * (userPlaylist.length - 1)
        );

        setCurrentTrackIndex(randomIndex);
        return;
      }
      if (currentTrackIndex < userPlaylist.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
      } else {
        if (repeat) setCurrentTrackIndex(0);
        else player.pauseVideo();
      }
    } else {
      if (shuffle) {
        const randomIndex = Math.floor(Math.random() * (playlist.length - 1));

        setCurrentTrackIndex(randomIndex);
        return;
      }
      if (currentTrackIndex < playlist.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
      } else {
        if (repeat) setCurrentTrackIndex(0);
        else player.pauseVideo();
      }
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
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
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
    ignoreTrackInfoEffect.current = true;

    if (session) {
      if (currentTrackIndex > 0) {
        setCurrentTrackIndex(currentTrackIndex - 1);
      } else {
        setCurrentTrackIndex(userPlaylist.length - 1);
      }
    } else {
      if (currentTrackIndex > 0) {
        setCurrentTrackIndex(currentTrackIndex - 1);
      } else {
        setCurrentTrackIndex(playlist.length - 1);
      }
    }
  };

  const handleNextTrack = () => {
    ignoreTrackInfoEffect.current = true;

    if (session) {
      if (currentTrackIndex < userPlaylist.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
      } else {
        setCurrentTrackIndex(0);
      }
    } else {
      if (currentTrackIndex < playlist.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
      } else {
        setCurrentTrackIndex(0);
      }
    }
  };
  const handleShuffle = () => {
    setShuffle((prev) => !prev);
  };
  const handleRepeat = () => {
    setRepeat((prev) => !prev);
  };

  // 로그인 & 비로그인시 플레이리스트가 비어있을 때
  const isPlaylistEmpty = session
    ? userPlaylist.length === 0
    : playlist.length === 0;
  return (
    <>
      <div className=" text-white ">
        {/* <div className="basis-1/3 flex gap-10 text-sm items-center justify-center ">
          <div
            onClick={() => {
              if (!isPlaylistEmpty) {
                setOnPlaylist((prev) => !prev);
              }
            }}
            className={`text-xl w-10 transition-all h-10 flex justify-center items-center ${
              isPlaylistEmpty
                ? ""
                : "hover:cursor-pointer hover:rounded-full hover:bg-orange-200"
            }`}
          >
            <FontAwesomeIcon icon={faList} />
          </div>
          <div className="flex justify-center w-[300px]">
            <img
              className={trackInfo ? "w-10 rounded " : ""}
              src={trackInfo?.imgUrl ?? ""}
              alt={trackInfo?.name ?? ""}
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
        </div> */}
        <div
          aria-label="플레이어 컨트롤"
          className={`${
            isPlaylistEmpty ? "" : "opacity-50 cursor-not-allowed "
          }`}
        >
          <div
            aria-label="재생부"
            className={`basis-1/3 flex justify-center items-center ${
              isPlaylistEmpty ? "" : "pointer-events-none"
            }`}
          >
            <div className="flex justify-center items-center gap-3">
              <div>
                <YouTube
                  videoId={videoId}
                  opts={opts}
                  onReady={onReady}
                  onEnd={onEnd}
                />
                <FontAwesomeIcon
                  icon={faShuffle}
                  onClick={handleShuffle}
                  className={
                    shuffle
                      ? "cursor-pointer text-orange-400"
                      : "cursor-pointer"
                  }
                />
              </div>
              <FontAwesomeIcon
                icon={faStepBackward}
                onClick={handlePreviousTrack}
                className="cursor-pointer"
              />
              <div className=" w-10 h-10 rounded-full flex justify-center items-center">
                {isPlaying ? (
                  <FontAwesomeIcon
                    icon={faCirclePause}
                    className="cursor-pointer text-white text-3xl"
                    onClick={pauseVideo}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faCirclePlay}
                    className="cursor-pointer text-white text-3xl "
                    onClick={playVideo}
                  />
                )}
              </div>
              <FontAwesomeIcon
                icon={faStepForward}
                onClick={handleNextTrack}
                className="cursor-pointer"
              />
              <FontAwesomeIcon
                onClick={handleRepeat}
                icon={faRepeat}
                className={
                  repeat ? "cursor-pointer text-orange-400" : "cursor-pointer"
                }
              />
            </div>
            <div></div>
          </div>
          <div className="flex basis-1/3  text-xs gap-2 items-center justify-center">
            <span>{formatTime(currentTime)}</span>
            <div
              className="relative w-[600px] rounded-sm h-1 bg-gray-300"
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
        </div>
      </div>
    </>
  );
}
