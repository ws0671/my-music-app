import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSpotifyTrackInfo, searchTracks } from "../api/spotify";
import Loading from "../components/loading";
import TruncatedText from "../components/truncated-text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTrackInfoStore, useVideoIdStore } from "../stores/video";
import { searchYouTubeVideo } from "../api/youtube";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import useSessionStore from "../stores/session";
import EllipsisMenu from "../components/ellipsisMenu";
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
  const [playlists, setPlaylists] = useState<IPlaylists[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setVideoId } = useVideoIdStore();
  const { setTrackInfo, togglePlay } = useTrackInfoStore();
  const { session } = useSessionStore();
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
  console.log(artists);
  const onPlayClick = async (e: React.MouseEvent<SVGSVGElement>) => {
    const trackId = e.currentTarget.getAttribute("data-trackId");
    const name = e.currentTarget.getAttribute("data-name");
    const artists = e.currentTarget.getAttribute("data-artists");
    const imgUrl = e.currentTarget.getAttribute("data-imgUrl");

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
    setVideoId(fetchedVideoId);
    setTrackInfo(trackInfoOne);
    togglePlay();
  };

  if (isLoading) return <Loading />;
  return (
    <div className="m-6">
      <h3 className="mt-10 mb-5 text-2xl font-bold">곡</h3>
      {tracks &&
        tracks.map((item, index) => {
          const artists = item.artists.map((i) => i.name).join(", ");

          // const duration_min = Math.floor(item.duration_ms / 1000 / 60);
          // let duration_sec: string | number = Math.ceil(
          //   (item.duration_ms / 1000) % 60
          // );
          // duration_sec = duration_sec < 10 ? "0" + duration_sec : duration_sec;
          return (
            <div
              key={index}
              className="p-2 grid grid-cols-[10fr_10fr_1fr]  gap-3 hover:rounded-md hover:bg-purple-500  group relative "
            >
              {/* <div className="group-hover:hidden flex justify-center items-center">
                {index + 1}
              </div> */}

              <div className="flex items-center">
                <div className="relative">
                  <div className="absolute z-10 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
                    <FontAwesomeIcon
                      className="hover:cursor-pointer text-white"
                      data-trackId={item.id}
                      data-name={item.name}
                      data-artists={artists}
                      data-imgUrl={item.album.images[0].url}
                      onClick={onPlayClick}
                      icon={faPlay}
                    />
                  </div>
                  <img
                    className="w-10 h-10 rounded group-hover:opacity-50"
                    src={item.album.images[0].url}
                    alt={item.album.name}
                  />
                </div>
                <div className="ml-3">
                  <div className="font-bold">{item.name}</div>

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
              <EllipsisMenu
                trackId={item.id}
                name={item.name}
                artists={artists}
                imgUrl={item.album.images[0].url}
              />
            </div>
          );
        })}
      <h3 className="mt-10 mb-5 text-2xl font-bold">아티스트</h3>
      <div className="grid grid-cols-5 gap-6 ">
        {artists &&
          artists.slice(0, 5).map((artist) => {
            return (
              <Link key={artist.id} to={`/artist/${artist.id}`}>
                <div className=" ">
                  <img
                    className="w-full aspect-square rounded-full"
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
      <div className="grid grid-cols-5 gap-6 ">
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
                          <Link to={`artist/${artist.id}`}>
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
      {/* <h3 className="mt-10 mb-5 text-2xl font-bold">플레이리스트</h3> */}
      {/* <div className="flex flex-wrap gap-6 ">
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
      </div> */}
    </div>
  );
}
