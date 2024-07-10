import { useEffect, useRef, useState } from "react";
import UpdatePassword from "./../routes/update-password";
import {
  useCurrentTrackIndexStore,
  usePlaylistStore,
  useTrackInfoStore,
  useVideoIdStore,
} from "../stores/video";
import { getSpotifyTrackInfo } from "../api/spotify";
import { searchYouTubeVideo } from "../api/youtube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faMinus,
  faPlus,
  faSquareMinus,
} from "@fortawesome/free-solid-svg-icons";

export default function Playlist() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { videoId, setVideoId } = useVideoIdStore();
  const { setTrackInfo, togglePlay } = useTrackInfoStore();
  const [ellipsis, setEllipsis] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const { playlist, setPlaylist, removePlaylist, resetPlaylist } =
    usePlaylistStore();
  const dropdownRef = useRef([]);

  const handleClickOutside = (e) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.some((ref) => ref.contains(e.target))
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
  const onPlayClick = async (e: MouseEvent<SVGSVGElement>) => {
    const id = e.currentTarget.getAttribute("id");
    const name = e.currentTarget.getAttribute("name");
    const artists = e.currentTarget.getAttribute("artists");
    const imgUrl = e.currentTarget.getAttribute("imgUrl");

    const trackInfo = await getSpotifyTrackInfo(id);
    const searchQuery = `${trackInfo.name} ${trackInfo.artist}`;
    const fetchedVideoId = await searchYouTubeVideo(searchQuery);
    const trackInfoOne = {
      id,
      name,
      artists,
      imgUrl,
      state: "playlist",
      videoId: fetchedVideoId,
    };
    setVideoId(fetchedVideoId);
    setTrackInfo(trackInfoOne);
    togglePlay();
  };
  const onEllipsis = (e, id) => {
    e.stopPropagation();
    setSelectedId(id);
    if (ellipsis) {
      setEllipsis(false);
    } else {
      setEllipsis(true);
    }
  };
  const removeSong = (e, index) => {
    e.stopPropagation();
    removePlaylist(index);
    setEllipsis(false);
  };
  const removeAll = () => {
    if (confirm("플레이리스트 전체 삭제하시겠습니까?")) {
      resetPlaylist();
    }
  };

  return (
    <div className="absolute rounded-xl top-[-450px] w-[250px]   bg-white left-10 shadow-xl p-5  border border-1">
      <div className="flex justify-between font-bold pb-3 border-b-2 border-orange-200">
        <div>Playlist</div>
        <div>
          <FontAwesomeIcon
            onClick={removeAll}
            className="cursor-pointer"
            icon={faSquareMinus}
          />
        </div>
      </div>
      <div className="scrollbar-hide  mt-3 overflow-y-scroll h-[350px]">
        {playlist.map((trackInfo, index) => {
          return (
            <div key={index} className="">
              <div
                id={trackInfo?.id}
                name={trackInfo?.name}
                artists={trackInfo?.artists}
                imgUrl={trackInfo?.imgUrl}
                onClick={onPlayClick}
                className="cursor-pointer gap-3 flex justify-between hover:bg-orange-200 p-2 rounded-xl group "
              >
                <div className="flex w-8 items-center justify-center shrink-0">
                  <img
                    className={trackInfo ? "w-full h-full rounded" : ""}
                    src={trackInfo?.imgUrl}
                    alt={trackInfo?.name}
                  />
                </div>
                <div
                  ref={containerRef}
                  className=" overflow-hidden grow whitespace-nowrap "
                  id={trackInfo?.id}
                >
                  <div className={`group-hover:hidden text-xs`}>
                    {trackInfo?.name}
                  </div>
                  {/* {trackInfo?.name.length > 25 ? (
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
                  )} */}

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
                  ref={(el) => (dropdownRef.current[index] = el)}
                  onClick={(e) => removeSong(e, index)}
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
