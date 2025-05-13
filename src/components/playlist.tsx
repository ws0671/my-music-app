import { useEffect, useRef, useState } from "react";
import {
  usePlaylistStore,
  useTrackInfoStore,
  useUserPlaylistStore,
  useVideoIdStore,
  useYouTubeStore,
} from "../stores/video";
import { getSpotifyTrackInfo } from "../api/spotify";
import { searchYouTubeVideo } from "../api/youtube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleMinus,
  faMinus,
  faPause,
  faPlay,
  faSquareMinus,
} from "@fortawesome/free-solid-svg-icons";
import useSessionStore from "../stores/session";
import { deleteAllTrack, deleteTrack } from "../utils/playlist";
import { Link } from "react-router-dom";

export default function Playlist({ isOpen }) {
  const [showShadow, setShowShadow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { setVideoId } = useVideoIdStore();
  const { isPlaying, trackInfo, setTrackInfo, statePlay, statePause } =
    useTrackInfoStore();
  const [ellipsis, setEllipsis] = useState(false);
  const [selectedId] = useState(0);
  const { playlist, removePlaylist, resetPlaylist } = usePlaylistStore();
  const dropdownRef = useRef<HTMLElement[]>([]);
  const { player, setCurrentTime, play, pause } = useYouTubeStore();
  const {
    userPlaylist,

    removeUserPlaylist,
    resetUserPlaylist,
  } = useUserPlaylistStore();
  const { session } = useSessionStore();
  const currentPlaylist = session ? userPlaylist : playlist;

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.some((ref) => ref.contains(e.target as Node))
    ) {
      setEllipsis(false);
    }
  };

  const handleScroll = () => {
    if (
      scrollContainerRef.current &&
      scrollContainerRef.current.scrollTop > 50
    ) {
      setShowShadow(true);
    } else {
      setShowShadow(false);
    }
  };
  const onPlayClick = async (e: React.MouseEvent) => {
    const trackId = e.currentTarget.getAttribute("data-trackid");
    const name = e.currentTarget.getAttribute("data-name");
    const artists = e.currentTarget.getAttribute("data-artists");
    const artistsId = e.currentTarget.getAttribute("data-artsitsid");
    const imgUrl = e.currentTarget.getAttribute("data-imgurl");

    const trackInfo = await getSpotifyTrackInfo(trackId);

    const searchQuery = `${trackInfo.name} ${trackInfo.artist}`;
    const fetchedVideoId = await searchYouTubeVideo(searchQuery);
    const trackInfoOne = {
      trackId,
      name,
      artists,
      artistsId,
      imgUrl,
      state: "playlist",
      videoId: fetchedVideoId,
    };
    setVideoId(fetchedVideoId);
    setTrackInfo(trackInfoOne);
    statePlay();
    play();
  };
  const pauseVideo = () => {
    statePause();
    pause();
  };
  const removeSong = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (session) {
      removeUserPlaylist(index);

      const track = { userId: session.user.id, trackId: e.currentTarget.id };
      deleteTrack(track);
    } else {
      removePlaylist(index);
    }
    setEllipsis(false);
  };
  const removeAll = () => {
    if (confirm("플레이리스트 전체 삭제하시겠습니까?")) {
      if (session) {
        resetUserPlaylist();
        deleteAllTrack(session);
      } else {
        resetPlaylist();
      }
      pause();
      player?.stopVideo();
      setCurrentTime(0);
    }
  };

  return (
    <>
      <div
        className={` flex-col overflow-hidden bg-purple-700 text-white transition-all duration-300 ${
          isOpen ? "fixed inset-0 sm:static" : "hidden sm:flex sm:"
        }`}
      >
        {" "}
        <div
          className={`${
            showShadow ? "shadow-custom" : ""
          } px-4 py-[18px] transition-shadow duration-300 flex justify-between font-bold`}
        >
          <div>재생목록</div>
          <div>
            <FontAwesomeIcon
              onClick={removeAll}
              className="cursor-pointer"
              icon={faSquareMinus}
            />
          </div>
        </div>
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="pl-4 custom-scrollbar overflow-y-auto "
        >
          {currentPlaylist.map((item, index) => {
            console.log(item);

            const artistsId = item.artistsId?.split(",");
            const artists = item.artists?.split(",");

            return (
              <div key={index} className="group">
                <div
                  data-trackid={item?.trackId}
                  data-name={item?.name}
                  data-artists={artists}
                  data-artistsid={artistsId}
                  data-imgurl={item?.imgUrl}
                  className="p-2 hover:rounded-md relative rounded-xl hover:bg-purple-500  cursor-pointer grid gap-3 grid-cols-[auto_1fr_auto] justify-between group "
                >
                  <div className="w-12 h-12 items-center justify-center relative shrink-0 ">
                    <img
                      className={
                        item
                          ? "w-full h-full rounded group-hover:opacity-50"
                          : ""
                      }
                      src={item?.imgUrl ?? ""}
                      alt={item?.name ?? ""}
                    />
                    <div className="hidden justify-center items-center group-hover:flex">
                      {isPlaying && trackInfo?.trackId === item.trackId ? (
                        <FontAwesomeIcon
                          icon={faPause}
                          className="hover:cursor-pointer absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] text-xl"
                          onClick={pauseVideo}
                        />
                      ) : (
                        <FontAwesomeIcon
                          className="hover:cursor-pointer absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] text-xl"
                          data-trackid={item?.trackId}
                          data-name={item?.name}
                          data-artists={item?.artists}
                          data-imgurl={item?.imgUrl}
                          onClick={onPlayClick}
                          icon={faPlay}
                        />
                      )}
                    </div>
                  </div>

                  <div
                    ref={containerRef}
                    className="flex flex-col gap-1 overflow-hidden grow whitespace-nowrap "
                    id={item?.trackId ?? ""}
                  >
                    <div className={`group-hover:hidden `}>{item?.name}</div>
                    {item.name && item?.name.length > 15 ? (
                      <div className={"group-hover:block  hidden"}>
                        <div className="animate-marquee  inline-block pr-10">
                          {item?.name}
                        </div>
                        <div className="animate-marquee  inline-block pr-10">
                          {item?.name}
                        </div>
                      </div>
                    ) : (
                      <div className={`hidden group-hover:block `}>
                        {item?.name}
                      </div>
                    )}
                    <div>
                      {artistsId?.map((id, index) => {
                        return (
                          <Link key={index} to={"/artist/" + id}>
                            <span className="text-sm text-gray-400 hover:underline">
                              {artists && index !== artists.length - 1
                                ? artists?.[index] + ", "
                                : artists?.[index]}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                  <div className="items-center justify-center hidden group-hover:flex">
                    <FontAwesomeIcon
                      className="cursor-pointer hover:bg-purple-500 rounded-full p-1"
                      onClick={(e) => removeSong(e, index)}
                      icon={faCircleMinus}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
