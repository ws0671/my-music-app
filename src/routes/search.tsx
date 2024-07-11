import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSpotifyTrackInfo, searchTracks } from "../api/spotify";
import Loading from "../components/loading";
import TruncatedText from "../components/truncated-text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  usePlaylistStore,
  useTrackInfoStore,
  useUserPlaylistStore,
  useVideoIdStore,
} from "../stores/video";
import { searchYouTubeVideo } from "../api/youtube";
import { faEllipsis, faPlay, faPlus } from "@fortawesome/free-solid-svg-icons";
import useSessionStore from "../stores/session";
import { addToPlaylist } from "../utils/playlist";
import EllipsisMenu from "../components/ellipsisMenu";

export default function Search() {
  const { id } = useParams();
  const [tracks, setTracks] = useState();
  const [artists, setArtists] = useState();
  const [playlists, setPlaylists] = useState();
  const [albums, setAlbums] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [ellipsis, setEllipsis] = useState(false);
  const { videoId, setVideoId } = useVideoIdStore();
  const { setTrackInfo, togglePlay } = useTrackInfoStore();
  const [selectedId, setSelectedId] = useState();
  const { playlist, setPlaylist } = usePlaylistStore();
  const { session } = useSessionStore();
  const { userPlaylist, setUserPlaylist } = useUserPlaylistStore();
  useEffect(() => {
    const fetchSearchedData = async () => {
      try {
        setIsLoading(true);
        const searchedData = await searchTracks(id);
        setTracks(searchedData.tracks.items);
        setArtists(searchedData.artists.items);
        setPlaylists(searchedData.playlists.items);
        setAlbums(searchedData.albums.items);
      } catch (error) {
        console.error("Error: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSearchedData();
  }, [id]);
  const onPlayClick = async (e: MouseEvent<SVGSVGElement>) => {
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
    setVideoId(fetchedVideoId);
    setTrackInfo(trackInfoOne);
    togglePlay();
  };
  const onEllipsis = (e, id) => {
    setSelectedId(id);
    setEllipsis((prev) => !prev);
  };

  if (isLoading) return <Loading />;
  return (
    <div>
      <h3 className="mt-10 mb-5 text-2xl font-bold">곡</h3>
      {tracks.map((item, index) => {
        const artists = item.artists.map((i) => i.name).join(", ");
        const duration_min = Math.floor(item.duration_ms / 1000 / 60);
        let duration_sec: string | number = Math.ceil(
          (item.duration_ms / 1000) % 60
        );
        duration_sec = duration_sec < 10 ? "0" + duration_sec : duration_sec;
        return (
          <div
            key={index}
            className="grid grid-cols-[1fr_10fr_10fr_2fr] py-1  hover:rounded-md hover:bg-orange-200  group mr-5 relative"
          >
            <div className="group-hover:hidden flex justify-center items-center">
              {index + 1}
            </div>
            <div className="hidden justify-center items-center group-hover:flex">
              <FontAwesomeIcon
                className="hover:cursor-pointer"
                id={item.id}
                name={item.name}
                artists={artists}
                imgUrl={item.album.images[0].url}
                onClick={onPlayClick}
                icon={faPlay}
              />
            </div>
            <div className="flex items-center">
              <img
                className="w-10 h-10 rounded"
                src={item.album.images[2].url}
                alt={item.album.name}
              />
              <div className="ml-3">
                <div className="font-bold">{item.name}</div>

                <div className="text-sm text-gray-400">
                  {item.artists.map((artist, index) => {
                    const isLast = index === item.artists.length - 1;
                    return (
                      <div className="inline-block" key={index}>
                        <Link to={`/artist/${artist.id}`}>
                          <span className="hover:underline">{artist.name}</span>
                        </Link>
                        {!isLast && <span>,&nbsp;</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <Link to={`/album/${item.album.id}`}>
                <span className="hover:underline">{item.album.name}</span>
              </Link>
            </div>
            <EllipsisMenu
              id={item.id}
              name={item.name}
              artists={artists}
              imgUrl={item.album.images[0].url}
            />
          </div>
        );
      })}
      <h3 className="mt-10 mb-5 text-2xl font-bold">아티스트</h3>
      <div className="flex gap-10 flex-wrap ">
        {artists.map((artist) => {
          return (
            <Link key={artist.id} to={`/artist/${artist.id}`}>
              <div className=" w-40">
                <img
                  className="w-40 h-40 rounded-full"
                  src={artist.images[0].url}
                  alt={artist.name}
                />
                <div className="truncate font-bold">{artist.name}</div>
                <div className="text-sm text-gray-400">아티스트</div>
              </div>
            </Link>
          );
        })}
      </div>
      <h3 className="mt-10 mb-5 text-2xl font-bold">앨범</h3>
      <div className="flex flex-wrap gap-6 ">
        {albums.map((item) => {
          return (
            <Link to={`/album/${item.id}`} key={item.id}>
              <div className="w-44">
                <img
                  className="rounded-lg w-44 h-44"
                  src={item.images[0].url}
                />
                <div className="my-1 truncate font-bold" key={item.id}>
                  {item.name}
                </div>
                <div className="truncate text-sm  text-gray-400">
                  {item.artists.map((artist, index) => {
                    const isLast = index === item.artists.length - 1;
                    return (
                      <div className="inline-block" key={index}>
                        <Link to={`artist/${artist.id}`}>
                          <span className="hover:underline">{artist.name}</span>
                        </Link>
                        {!isLast && <span>,&nbsp;</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <h3 className="mt-10 mb-5 text-2xl font-bold">플레이리스트</h3>
      <div className="flex flex-wrap gap-6 ">
        {playlists.map((item) => {
          return (
            <Link
              to={`/playlist/${item.id}`}
              state={{
                imageUrl: item.images[0].url,
                name: item.name,
                description: item.description,
              }}
              key={item.id}
            >
              <div className="w-44">
                <img
                  className="rounded-lg w-44 h-44"
                  src={item.images[0].url}
                />
                <div className="my-1 truncate font-bold">{item.name}</div>
                <TruncatedText text={item.description} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
