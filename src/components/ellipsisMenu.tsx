import { faEllipsis, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import useSessionStore from "../stores/session";
import { getSpotifyTrackInfo } from "../api/spotify";
import { searchYouTubeVideo } from "../api/youtube";
import { addToPlaylist } from "../utils/playlist";
import { usePlaylistStore, useUserPlaylistStore } from "../stores/video";

interface IEllipsisMenuProps {
  trackId: string;
  name: string;
  artists: string;
  imgUrl: string;
}

export default function EllipsisMenu({
  trackId,
  name,
  artists,
  imgUrl,
  onClick,
}: IEllipsisMenuProps) {
  const [selectedId, setSelectedId] = useState("");
  const [ellipsis, setEllipsis] = useState(false);
  const { setPlaylist } = usePlaylistStore();
  const { session } = useSessionStore();
  const { setUserPlaylist } = useUserPlaylistStore();
  const onEllipsis = (id: string) => {
    setSelectedId(id);
    setEllipsis((prev) => !prev);
  };
  const addTrack = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setEllipsis(false);
    const trackId = e.currentTarget.getAttribute("data-trackid");
    const name = e.currentTarget.getAttribute("data-name");
    const artists = e.currentTarget.getAttribute("data-artists");
    const imgUrl = e.currentTarget.getAttribute("data-imgurl");
    const trackInfo = await getSpotifyTrackInfo(trackId);
    const searchQuery = `${trackInfo.name} ${trackInfo.artist}`;
    const fetchedVideoId = await searchYouTubeVideo(searchQuery);
    const trackInfoOne = {
      userId: session?.user.id,
      trackId,
      name,
      artists,
      imgUrl,
      videoId: fetchedVideoId,
    };
    if (session) {
      addToPlaylist(trackInfoOne);
      setUserPlaylist(trackInfoOne);
    } else {
      setPlaylist(trackInfoOne);
    }
  };
  return (
    <div className="flex justify-center items-center ">
      <div className=" ">
        <FontAwesomeIcon
          onClick={() => onEllipsis(trackId)}
          className="cursor-pointer"
          id={trackId}
          icon={faEllipsis}
        />
      </div>
      <div
        onClick={(e) => addTrack(e)}
        data-name={name}
        data-trackid={trackId}
        data-artists={artists}
        data-imgurl={imgUrl}
        className={
          ellipsis && selectedId === trackId
            ? " absolute top-10 cursor-pointer  hover:bg-orange-100 bg-white border shadow-md px-3 py-2 rounded-md z-[1000] right-0"
            : "hidden"
        }
      >
        <span className="text-sm">
          <FontAwesomeIcon className="mr-2" icon={faPlus} />
          플레이리스트에 추가하기
        </span>
      </div>
    </div>
  );
}
