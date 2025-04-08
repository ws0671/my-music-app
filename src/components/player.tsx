import {
  faCirclePause,
  faCirclePlay,
  faRepeat,
  faShuffle,
  faStepBackward,
  faStepForward,
  faVolumeLow,
  faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useCurrentTrackIndexStore,
  usePlaylistStore,
  useTrackInfoStore,
  useUserPlaylistStore,
  useYouTubeStore,
} from "../stores/video";
import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import { useVideoIdStore } from "../stores/video";
import useSessionStore from "../stores/session";
import { addToPlaylist, fetchPlaylist } from "../utils/playlist";

interface OnReady {
  target: {
    getDuration: () => number;
  };
}
export default function Player() {
  const { videoId } = useVideoIdStore();
  const { playlist, setPlaylist } = usePlaylistStore();
  const [player, setPlayer] = useYouTubeStore((state) => [
    state.player,
    state.setPlayer,
  ]);
  const { currentTime, setCurrentTime, play, pause } = useYouTubeStore();
  const [duration, setDuration] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const { trackInfo, isPlaying, statePlay, statePause } = useTrackInfoStore();
  // const containerRef = useRef<HTMLDivElement>(null);
  // const [setIsShort] = useState(false);
  const { currentTrackIndex, setCurrentTrackIndex } =
    useCurrentTrackIndexStore();
  const { session } = useSessionStore();
  const { userPlaylist, setUserPlaylist, replaceUserPlaylist } =
    useUserPlaylistStore();
  const ignoreTrackInfoEffect = useRef(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);

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
        if (playlist.some((track) => track.trackId === trackInfo.trackId))
          return;

        if (session) {
          //supabase에 추가
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

  // useEffect(() => {
  //   if (containerRef.current) {
  //     const containerWidth = containerRef.current.offsetWidth;
  //     let textWidth = 0;
  //     const childNode: ChildNode = containerRef.current.childNodes[0];
  //     if (childNode instanceof HTMLElement) {
  //       textWidth = childNode.scrollWidth;
  //     }
  //     if (textWidth <= containerWidth) {
  //       setIsShort(true);
  //     } else {
  //       setIsShort(false);
  //     }
  //   }
  // }, [trackInfo?.name]);

  // useEffect(() => {
  //   if (playlist.length > 0) {
  //     const handleKeyDown = (e: KeyboardEvent) => {
  //       if (e.code === "Space") {
  //         console.log("asd");

  //         if (!isPlaying) {
  //           player?.playVideo();
  //           playing();
  //         } else {
  //           player?.pauseVideo();
  //           pause();
  //         }
  //       }
  //     };
  //     document.addEventListener("keydown", handleKeyDown);
  //     return () => {
  //       document.removeEventListener("keydown", handleKeyDown);
  //     };
  //   }
  // }, [playlist.length, isPlaying]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && player) {
      interval = setInterval(() => {
        setCurrentTime(player.getCurrentTime());
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, player]);

  // useEffect(() => {
  //   if (session) {
  //     if (player && currentTrackIndex < userPlaylist.length) {
  //       setVideoId(userPlaylist[currentTrackIndex].videoId);
  //       setTrackInfo(userPlaylist[currentTrackIndex]);
  //     }
  //   } else {
  //     if (player && currentTrackIndex < playlist.length) {
  //       setVideoId(playlist[currentTrackIndex].videoId);
  //       setTrackInfo(playlist[currentTrackIndex]);
  //     }
  //   }
  // }, [currentTrackIndex]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setVolume(value);
    player?.setVolume(value);
  };
  const handleMute = () => {
    if (player.isMuted()) {
      player.unMute();
      setVolume(50);
      setIsMuted(false);
    } else {
      player.mute();
      setVolume(0);
      setIsMuted(true);
    }
  };
  const onReady = (e: OnReady) => {
    setPlayer(e.target);
    setDuration(e.target.getDuration());
  };

  const handlePlay = () => {
    statePlay();
    play();
  };

  const handlePause = () => {
    statePause();
    pause();
  };

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
    return `${String(minutes)}:${String(secs).padStart(2, "0")}`;
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
    <div className="col-span-3 flex justify-between gap-10">
      <div className="w-[30%]"></div>
      <div className=" text-white w-[40%] ">
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
            isPlaylistEmpty ? "opacity-50 cursor-not-allowed" : " "
          }`}
        >
          <div
            aria-label="재생부"
            className={`basis-1/3 flex justify-center items-center ${
              isPlaylistEmpty ? "pointer-events-none" : ""
            }`}
          >
            <div className="flex justify-center items-center gap-6">
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
                      ? "cursor-pointer text-orange-400 text-xl"
                      : "cursor-pointer text-xl"
                  }
                />
              </div>
              <FontAwesomeIcon
                icon={faStepBackward}
                onClick={handlePreviousTrack}
                className="cursor-pointer text-xl"
              />
              <div className=" my-2">
                {isPlaying ? (
                  <FontAwesomeIcon
                    icon={faCirclePause}
                    className="cursor-pointer text-white text-4xl"
                    onClick={handlePause}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faCirclePlay}
                    className="cursor-pointer text-white text-4xl "
                    onClick={handlePlay}
                  />
                )}
              </div>
              <FontAwesomeIcon
                icon={faStepForward}
                onClick={handleNextTrack}
                className="cursor-pointer text-xl"
              />
              <FontAwesomeIcon
                onClick={handleRepeat}
                icon={faRepeat}
                className={
                  repeat
                    ? "cursor-pointer text-orange-400 text-xl"
                    : "text-xl cursor-pointer"
                }
              />
            </div>
            <div></div>
          </div>
          <div className="flex basis-1/3  text-xs gap-2 items-center justify-center mb-1">
            <span>{formatTime(currentTime)}</span>
            <div
              className="relative w-full rounded-xl h-1 bg-purple-500"
              onClick={handleProgressBarClick}
              ref={progressBarRef}
            >
              <div
                className=" absolute left-0 top-0 h-1 rounded-xl bg-white"
                style={{ width: progressBarWidth }}
              ></div>
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      <div className="w-[30%] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            className="text-purple-300 w-6 cursor-pointer hover:text-white"
            icon={isMuted ? faVolumeXmark : faVolumeLow}
            onClick={handleMute}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-2 appearance-none cursor-pointer
              bg-purple-500 rounded-lg outline-none
                 [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                 "
            style={{
              background: `linear-gradient(to right, #fff ${volume}%, #a855f7 ${volume}%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
