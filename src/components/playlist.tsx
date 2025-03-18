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
  faEllipsis,
  faMinus,
  faPause,
  faPlay,
  faSquareMinus,
} from "@fortawesome/free-solid-svg-icons";
import useSessionStore from "../stores/session";
import { deleteAllTrack, deleteTrack } from "../utils/playlist";
import { Link } from "react-router-dom";

export default function Playlist() {
  const [showShadow, setShowShadow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

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

  const containerRef = useRef<HTMLDivElement>(null);
  const { setVideoId } = useVideoIdStore();
  const { isPlaying, trackInfo, setTrackInfo, togglePlay, playing, pause } =
    useTrackInfoStore();
  const [ellipsis, setEllipsis] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const { playlist, removePlaylist, resetPlaylist } = usePlaylistStore();
  const dropdownRef = useRef<HTMLElement[]>([]);
  const { player, setCurrentTime } = useYouTubeStore();

  const {
    userPlaylist,

    removeUserPlaylist,
    resetUserPlaylist,
  } = useUserPlaylistStore();
  const { session } = useSessionStore();

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.some((ref) => ref.contains(e.target as Node))
    ) {
      setEllipsis(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onPlayClick = async (e: React.MouseEvent) => {
    const trackId = e.currentTarget.getAttribute("data-trackid");
    const name = e.currentTarget.getAttribute("data-name");
    const artists = e.currentTarget.getAttribute("data-artists");
    const imgUrl = e.currentTarget.getAttribute("data-imgurl");

    const trackInfo = await getSpotifyTrackInfo(trackId);

    const searchQuery = `${trackInfo.name} ${trackInfo.artist}`;
    const fetchedVideoId = await searchYouTubeVideo(searchQuery);
    const trackInfoOne = {
      trackId,
      name,
      artists,
      imgUrl,
      state: "playlist",
      videoId: fetchedVideoId,
    };
    setVideoId(fetchedVideoId);
    setTrackInfo(trackInfoOne);
    playing();
  };
  const pauseVideo = () => {
    pause();
  };
  const onEllipsis = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    id: number
  ) => {
    e.stopPropagation();

    setSelectedId(id);
    if (ellipsis) {
      setEllipsis(false);
    } else {
      setEllipsis(true);
    }
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
    <div className="flex flex-col overflow-hidden  bg-purple-600 text-white">
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
        className="p-4 -ml-2 custom-scrollbar overflow-y-auto "
      >
        {session
          ? userPlaylist.map((trackInfo, index) => {
              return (
                <div key={index} className="">
                  <div
                    data-trackid={trackInfo?.trackId}
                    data-name={trackInfo?.name}
                    data-artists={trackInfo?.artists}
                    data-imgurl={trackInfo?.imgUrl}
                    onClick={onPlayClick}
                    className="cursor-pointer gap-3 flex justify-between hover:bg-orange-200 rounded-xl group "
                  >
                    <div className="flex w-8 items-center justify-center shrink-0 ">
                      <img
                        className={trackInfo ? "w-full h-full rounded" : ""}
                        src={trackInfo?.imgUrl ?? ""}
                        alt={trackInfo?.name ?? ""}
                      />
                    </div>
                    <div
                      ref={containerRef}
                      className=" overflow-hidden grow whitespace-nowrap "
                      id={trackInfo?.trackId ?? ""}
                    >
                      <div className={`group-hover:hidden text-xs`}>
                        {trackInfo?.name}
                      </div>
                      {trackInfo.name && trackInfo.name.length > 25 ? (
                        <div className={"group-hover:block  text-xs hidden"}>
                          <div className="animate-marquee  inline-block pr-10">
                            {trackInfo?.name}
                          </div>
                          <div className="animate-marquee  inline-block pr-10">
                            {trackInfo?.name}
                          </div>
                        </div>
                      ) : (
                        <div className={`hidden group-hover:block text-xs`}>
                          {trackInfo?.name}
                        </div>
                      )}
                      <div className="text-[11px] text-gray-300">
                        {trackInfo?.artists}
                      </div>
                    </div>
                    <div className="">
                      <FontAwesomeIcon
                        className="cursor-pointer hover:bg-orange-300 rounded-full p-1"
                        onClick={(e) => onEllipsis(e, index)}
                        icon={faEllipsis}
                      />
                    </div>
                    <div
                      ref={(el) =>
                        el ? (dropdownRef.current[index] = el) : null
                      }
                      onClick={(e) => removeSong(e, index)}
                      id={trackInfo?.trackId ?? ""}
                      className={
                        ellipsis && selectedId === index
                          ? "z-30 absolute right-[-70px]  hover:bg-orange-100 bg-white border shadow-md px-3 py-2 rounded-md "
                          : "hidden"
                      }
                    >
                      <span className="text-xs">
                        <FontAwesomeIcon className="mr-2" icon={faMinus} />
                        제거하기
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          : playlist.map((item, index) => {
              console.log(item.artists);
              console.log(item);
              console.log(item.artistsId);
              const artistsId = item.artistsId?.split(",");
              const artists = item.artists?.split(",");
              console.log(artistsId);

              return (
                <div key={index} className="group">
                  <div
                    data-trackid={item?.trackId}
                    data-name={item?.name}
                    data-artists={item?.artists}
                    data-imgurl={item?.imgUrl}
                    className="p-2 hover:rounded-md relative rounded-xl hover:bg-purple-500  cursor-pointer grid gap-3 grid-cols-[auto_1fr_auto] justify-between group "
                  >
                    <div className="w-12 items-center justify-center relative shrink-0 ">
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
                      {item.name && item?.name.length > 25 ? (
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
                            <Link to={"/artist/" + id}>
                              <span
                                key={index}
                                className="text-sm text-gray-300 hover:underline"
                              >
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
                        onClick={(e) => onEllipsis(e, index)}
                        icon={faEllipsis}
                      />
                    </div>
                    <div
                      ref={(el) =>
                        el ? (dropdownRef.current[index] = el) : null
                      }
                      onClick={(e) => removeSong(e, index)}
                      id={trackInfo?.trackId ?? ""}
                      className={
                        ellipsis && selectedId === index
                          ? "z-30 absolute right-[-70px]  hover:bg-orange-100 bg-white border shadow-md px-3 py-2 rounded-md "
                          : "hidden"
                      }
                    >
                      <span className="text-xs">
                        <FontAwesomeIcon className="mr-2" icon={faMinus} />
                        제거하기
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
