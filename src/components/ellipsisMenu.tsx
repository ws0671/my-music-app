import { faEllipsis, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import useSessionStore from "../stores/session";
import { getSpotifyTrackInfo } from "../api/spotify";
import { searchYouTubeVideo } from "../api/youtube";
import { addToPlaylist } from "../utils/playlist";
import { usePlaylistStore, useUserPlaylistStore } from "../stores/video";

export default function EllipsisMenu({ id, name, artists, imgUrl }) {
  const [selectedId, setSelectedId] = useState();
  const [ellipsis, setEllipsis] = useState(false);
  const { playlist, setPlaylist } = usePlaylistStore();
  const { session } = useSessionStore();
  const { userPlaylist, setUserPlaylist } = useUserPlaylistStore();
  const onEllipsis = (e, id) => {
    console.log(id);
    console.log(ellipsis);

    setSelectedId(id);
    setEllipsis((prev) => !prev);
  };
  const addTrack = async (e) => {
    setEllipsis(false);
    const id = e.currentTarget.getAttribute("id");
    const name = e.currentTarget.getAttribute("name");
    const artists = e.currentTarget.getAttribute("artists");
    const imgUrl = e.currentTarget.getAttribute("imgUrl");
    const trackInfo = await getSpotifyTrackInfo(id);
    const searchQuery = `${trackInfo.name} ${trackInfo.artist}`;
    const fetchedVideoId = await searchYouTubeVideo(searchQuery);
    const trackInfoOne = {
      userId: session?.user.id,
      id,
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
    <>
      <div className="flex justify-center items-center ">
        <FontAwesomeIcon
          onClick={(e) => onEllipsis(e, id)}
          className="cursor-pointer"
          id={id}
          icon={faEllipsis}
        />
      </div>
      <div
        onClick={addTrack}
        id={id}
        name={name}
        artists={artists}
        imgUrl={imgUrl}
        className={
          ellipsis && selectedId === id
            ? " absolute top-10 cursor-pointer  hover:bg-orange-100 bg-white border shadow-md px-3 py-2 rounded-md z-[1000] right-0"
            : "hidden"
        }
      >
        <span className="text-sm">
          <FontAwesomeIcon className="mr-2" icon={faPlus} />
          플레이리스트에 추가하기
        </span>
      </div>
    </>
  );
}
