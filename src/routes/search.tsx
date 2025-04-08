import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSpotifyTrackInfo, searchTracks } from "../api/spotify";
import Loading from "../components/loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  usePlaylistStore,
  useTrackInfoStore,
  useVideoIdStore,
  useYouTubeStore,
} from "../stores/video";
import { searchYouTubeVideo } from "../api/youtube";
import {
  faCirclePlus,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import useSessionStore from "../stores/session";

import {
  IPlaylists,
  ISpecificArtist,
  ITrack,
  ITracksAllData,
} from "../types/spotify";

export default function Search() {
  const { id } = useParams();
  const [tracks, setTracks] = useState<ITracksAllData[]>([]);
  const [artists, setArtists] = useState<ISpecificArtist[]>([]);
  const [albums, setAlbums] = useState<ITrack[]>([]);
  const [_playlists, setPlaylists] = useState<IPlaylists[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setVideoId } = useVideoIdStore();
  const { isPlaying, trackInfo, setTrackInfo, statePlay, statePause } =
    useTrackInfoStore();
  const { session } = useSessionStore();
  const { setPlaylist } = usePlaylistStore();
  const { play, pause } = useYouTubeStore();

  useEffect(() => {
    const fetchSearchedData = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const searchedData = await searchTracks(id);

          setTracks(searchedData.tracks.items);
          setArtists(searchedData.artists.items);
          setPlaylists(searchedData.playlists.items);
          setAlbums(searchedData.albums.items);
        }
      } catch (error) {
        console.error("Error: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSearchedData();
  }, [id]);
  const onPlayClick = async (e: React.MouseEvent<SVGSVGElement>) => {
    const trackId = e.currentTarget.getAttribute("data-trackid");
    const name = e.currentTarget.getAttribute("data-name");
    const artists = e.currentTarget.getAttribute("data-artists");
    const artistsId = e.currentTarget.getAttribute("data-artistsid");
    const imgUrl = e.currentTarget.getAttribute("data-imgurl");

    const trackInfo = await getSpotifyTrackInfo(trackId);
    const searchQuery = `${trackInfo.name} ${trackInfo.artist}`;
    const fetchedVideoId = await searchYouTubeVideo(searchQuery);
    const trackInfoOne = {
      userId: session?.user.id,
      trackId,
      name,
      artists,
      artistsId,
      imgUrl,
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
  const addToPlaylist = async (e: React.MouseEvent<SVGSVGElement>) => {
    const trackId = e.currentTarget.getAttribute("data-trackid");
    const name = e.currentTarget.getAttribute("data-name");
    const artists = e.currentTarget.getAttribute("data-artists");
    const artistsId = e.currentTarget.getAttribute("data-artistsid");
    const imgUrl = e.currentTarget.getAttribute("data-imgurl");
    const trackInfo = await getSpotifyTrackInfo(trackId);
    const searchQuery = `${trackInfo.name} ${trackInfo.artist}`;
    const fetchedVideoId = await searchYouTubeVideo(searchQuery);
    const trackInfoOne = {
      userId: session?.user.id,
      trackId,
      name,
      artists,
      artistsId,
      imgUrl,
      videoId: fetchedVideoId,
    };
    setPlaylist(trackInfoOne);
  };
  if (isLoading) return <Loading />;
  return (
    <div className="m-6">
      <h3 className="mt-10 mb-5 text-2xl font-bold">곡</h3>
      {tracks &&
        tracks.map((item) => {
          const artists = item.artists.map((i) => i.name).join(",");
          const artistsId = item.artists.map((i) => i.id).join(",");
          const image = item.album.images[0]
            ? item.album.images[0].url
            : "/images/headphone.jpg";
          // const duration_min = Math.floor(item.duration_ms / 1000 / 60);
          // let duration_sec: string | number = Math.ceil(
          //   (item.duration_ms / 1000) % 60
          // );
          // duration_sec = duration_sec < 10 ? "0" + duration_sec : duration_sec;
          return (
            <div
              key={item.id}
              className="p-2 grid grid-cols-[10fr_10fr_1fr]  gap-3 hover:rounded-md hover:bg-purple-500  group relative "
            >
              {/* <div className="group-hover:hidden flex justify-center items-center">
                {index + 1}
              </div> */}

              <div className="flex flex-grow w-full items-center truncate">
                <div className="relative w-10 h-10 shrink-0">
                  <img
                    className="w-full h-full rounded group-hover:opacity-50"
                    src={image}
                    alt={item.album.name}
                  />
                  <div className="absolute z-10 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
                    {isPlaying && trackInfo?.trackId === item.id ? (
                      <FontAwesomeIcon
                        icon={faPause}
                        className="cursor-pointer"
                        onClick={pauseVideo}
                      />
                    ) : (
                      <FontAwesomeIcon
                        className="hover:cursor-pointer bg-purple"
                        data-trackid={item.id}
                        data-name={item.name}
                        data-artists={artists}
                        data-artistsid={artistsId}
                        data-imgurl={image}
                        onClick={onPlayClick}
                        icon={faPlay}
                      />
                    )}
                  </div>
                </div>
                <div className="ml-3 truncate">
                  <div aria-label="곡 제목" className="font-bold truncate">
                    {item.name}
                  </div>

                  <div className="text-sm text-gray-400">
                    {item.artists.map((artist, index) => {
                      const isLast = index === item.artists.length - 1;
                      return (
                        <div className="inline-block" key={index}>
                          <Link to={`/artist/${artist.id}`}>
                            <span className="hover:underline">
                              {artist.name}
                            </span>
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
              <div className="flex justify-center items-center">
                <FontAwesomeIcon
                  className="hover:cursor-pointer"
                  data-trackid={item.id}
                  data-name={item.name}
                  data-artists={artists}
                  data-artistsid={artistsId}
                  data-imgurl={image}
                  icon={faCirclePlus}
                  onClick={addToPlaylist}
                />
              </div>
            </div>
          );
        })}
      <h3 className="mt-10 mb-5 text-2xl font-bold">아티스트</h3>
      <div className="grid max-sm:grid-cols-2 grid-cols-5 gap-6 ">
        {artists &&
          artists.slice(0, 5).map((artist) => {
            console.log(artist);

            return (
              <Link key={artist.id} to={`/artist/${artist.id}`}>
                <div className=" ">
                  <img
                    className="w-full aspect-square rounded-full"
                    src={
                      artist.images[0]
                        ? artist.images[0]?.url
                        : "/images/headphone.jpg"
                    }
                    alt={artist.name}
                  />
                  <div className="my-1 truncate font-bold">{artist.name}</div>
                  <div className="text-sm text-gray-400">아티스트</div>
                </div>
              </Link>
            );
          })}
      </div>
      <h3 className="mt-10 mb-5 text-2xl font-bold">앨범</h3>
      <div className="grid max-sm:grid-cols-2 grid-cols-5 gap-6 ">
        {albums &&
          albums.slice(0, 5).map((item) => {
            return (
              <Link to={`/album/${item.id}`} key={item.id}>
                <div className="">
                  <img className="rounded-lg w-full" src={item.images[0].url} />
                  <div className="my-1 truncate font-bold" key={item.id}>
                    {item.name}
                  </div>
                  <div className="truncate text-sm  text-gray-400">
                    {item.artists.map((artist, index) => {
                      const isLast = index === item.artists.length - 1;
                      return (
                        <div className="inline-block" key={index}>
                          <Link to={`/artist/${artist.id}`}>
                            <span className="hover:underline">
                              {artist.name}
                            </span>
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
    </div>
  );
}
