import { MouseEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAlbumTracks, getSpotifyTrackInfo } from "../api/spotify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "../components/loading";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { searchYouTubeVideo } from "../api/youtube";
import { useTrackInfoStore, useVideoIdStore } from "../stores/video";
import useSessionStore from "../stores/session";
import EllipsisMenu from "../components/ellipsisMenu";
import { ITracksAllData } from "../types/spotify";
export default function Album() {
  const [tracks, setTracks] = useState<ITracksAllData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { id } = useParams();
  const { setVideoId } = useVideoIdStore();
  const { setTrackInfo, togglePlay } = useTrackInfoStore();
  const { session } = useSessionStore();
  useEffect(() => {
    const fetchAlbumTracks = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const tracks = await getAlbumTracks(id);
          console.log(tracks);

          setTracks(tracks);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlbumTracks();
  }, [id]);

  const onPlayClick = async (e: MouseEvent<SVGSVGElement>) => {
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

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div>
      <div className="flex shadow-2xl gap-10 relative">
        <img
          className="w-52 h-auto"
          src={tracks[0].images ?? ""}
          alt={tracks[0].name}
        />
        <div className="flex space-y-3 flex-col justify-center">
          <div className="">앨범</div>
          <div className={`font-bold ${"text-5xl"}`}>{tracks[0].name}</div>
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
        <div className="flex justify-center items-center"></div>
      </div>
      <div className="border border-gray-200 my-3"></div>
      {tracks.map((item) => {
        const artists = item.artists.map((i) => i.name).join(", ");
        // const duration_min = Math.floor(item.duration_ms / 1000 / 60);
        // let duration_sec: string | number = Math.ceil(
        //   (item.duration_ms / 1000) % 60
        // );
        // duration_sec = duration_sec < 10 ? "0" + duration_sec : duration_sec;
        return (
          <div
            key={item.id}
            className="relative py-1 hover:bg-orange-200 hover:rounded-md grid grid-cols-[1fr_20fr_1fr] group mr-5"
          >
            <div className="group-hover:hidden flex justify-center items-center">
              {item.track_number}
            </div>
            <div className="hidden justify-center items-center group-hover:flex">
              <FontAwesomeIcon
                className="hover:cursor-pointer"
                data-trackId={item.id}
                data-name={item.name}
                data-artists={artists}
                data-imgUrl={item.images}
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
            <EllipsisMenu
              trackId={item.id}
              name={item.name}
              artists={artists}
              imgUrl={item.images}
            />
          </div>
        );
      })}
    </div>
  );
}
