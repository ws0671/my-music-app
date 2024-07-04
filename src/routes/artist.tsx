import { useEffect, useState } from "react";
import {
  getArtist,
  getArtistTopTracks,
  getRelatedArtist,
  getSpotifyTrackInfo,
} from "../api/spotify";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/loading";
import { ISpecificArtist, ITrack } from "../types/spotify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import {
  useIsPlayingStore,
  useTrackInfoStore,
  useVideoIdStore,
} from "../stores/video";
import { searchYouTubeVideo } from "../api/youtube";

export default function Artist() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [artist, setArtist] = useState<ISpecificArtist>([]);
  const [tracks, setTracks] = useState<ITrack[]>([]);
  const [relatedArtists, setRelatedArtists] = useState<ISpecificArtist[]>([]);
  const { id } = useParams();
  const { videoId, setVideoId } = useVideoIdStore();
  const { setTrackInfo, togglePlay } = useTrackInfoStore();
  useEffect(() => {
    const fetchArtist = async () => {
      setIsLoading(true);
      try {
        const artist = await getArtist(id);
        const tracks = await getArtistTopTracks(id);
        const relatedArtists = await getRelatedArtist(id);
        setArtist(artist);
        setTracks(tracks);
        setRelatedArtists(relatedArtists);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtist();
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

  if (isLoading) return <Loading />;
  return (
    <div>
      <div className="flex shadow-2xl gap-10 relative box-border">
        <img className="" src={artist.images[0].url} alt={artist.name} />
        <div className="pb-10 flex flex-col break-all justify-center space-y-10">
          <div className=" text-xl">아티스트</div>
          <div className="font-bold text-8xl ">{artist.name}</div>
          <div className="font-bold text-5xl ">
            팔로워 {artist.followers.total.toLocaleString()}
          </div>
          <span className="font-bold text-sm">
            {artist.genres.map((item, index) => {
              return (
                <span
                  className=" border-2 border-black rounded-xl p-1 mr-2"
                  key={index}
                >
                  {item}
                </span>
              );
            })}
          </span>
        </div>
      </div>
      <div className="mt-10 text-2xl font-bold">인기</div>
      <div className="border border-gray-200 my-3"></div>
      {tracks.map((item, index) => {
        const artists = item.artists.map((i) => i.name).join(", ");
        const duration_min = Math.floor(item.duration_ms / 1000 / 60);
        let duration_sec: string | number = Math.ceil(
          (item.duration_ms / 1000) % 60
        );
        duration_sec = duration_sec < 10 ? "0" + duration_sec : duration_sec;
        return (
          <div
            key={item.id}
            className="py-1 hover:bg-orange-200 hover:rounded-md grid grid-cols-[1fr_20fr_1fr] group mr-5"
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
            <div>
              <div className="font-bold">{item.name}</div>
              <div className="text-sm text-gray-400">
                {item.artists.map((artist, index) => {
                  const isLast = index === item.artists.length - 1;
                  return (
                    <span key={artist.id}>
                      <Link to={`/artist/${artist.id}`}>
                        <span className="hover:underline">{artist.name}</span>
                      </Link>
                      {!isLast && <span>, </span>}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-center items-center">
              {duration_min}:{duration_sec}
            </div>
          </div>
        );
      })}
      <h3 className="mt-10 mb-5 text-2xl font-bold">연관된 아티스트</h3>
      <div className="flex gap-10 flex-wrap ">
        {relatedArtists.map((artist) => {
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
    </div>
  );
}
