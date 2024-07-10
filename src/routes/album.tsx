import { MouseEvent, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ITrack,
  ITracksAllData,
  getAlbumTracks,
  getSpotifyTrackInfo,
} from "../api/spotify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import Loading from "../components/loading";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { searchYouTubeVideo } from "../api/youtube";
import {
  useIsPlayingStore,
  useTrackInfoStore,
  useVideoIdStore,
} from "../stores/video";
export default function Album() {
  const [tracks, setTracks] = useState<ITrack[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { id } = useParams();
  const { videoId, setVideoId } = useVideoIdStore();
  const { setTrackInfo, togglePlay } = useTrackInfoStore();
  console.log(tracks);

  useEffect(() => {
    const fetchAlbumTracks = async () => {
      setIsLoading(true);
      try {
        const tracks = await getAlbumTracks(id);
        setTracks(tracks);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlbumTracks();
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
      videoId: fetchedVideoId,
    };
    setVideoId(fetchedVideoId);
    setTrackInfo(trackInfoOne);
    togglePlay();
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div>
      <div className="flex shadow-2xl gap-10 relative">
        <img
          className="w-52 h-auto"
          src={tracks[0].images}
          alt={tracks[0].album_name}
        />
        <div className="flex space-y-3 flex-col justify-center">
          <div className="">앨범</div>
          <div className={`font-bold ${"text-5xl"}`}>
            {tracks[0].album_name}
          </div>
          <div className="font-bold">
            {tracks[0].artists.map((artist, index) => {
              const isLast = index === tracks[0].artists.length - 1;
              return (
                <span key={artist.id}>
                  <Link to={`/artist/${artist.id}`}>
                    <span className="hover:underline">{artist.name}</span>
                  </Link>
                  {!isLast && <span>, </span>}
                </span>
              );
            })}
            <span className="mx-3">·</span>
            <span>{tracks[0].release_date}</span>
          </div>
        </div>
      </div>
      <div className="mt-10 grid grid-cols-[1fr_20fr_1fr] mr-5 text-sm text-gray-400">
        <div className="flex justify-center items-center">#</div>
        <div>제목</div>
        <div className="flex justify-center items-center">
          <FontAwesomeIcon icon={faClock} />
        </div>
      </div>
      <div className="border border-gray-200 my-3"></div>
      {tracks.map((item) => {
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
              {item.track_number}
            </div>
            <div className="hidden justify-center items-center group-hover:flex">
              <FontAwesomeIcon
                className="hover:cursor-pointer"
                id={item.id}
                name={item.name}
                artists={artists}
                imgUrl={item.images}
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
    </div>
  );
}
