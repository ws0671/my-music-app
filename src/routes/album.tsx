import { MouseEvent, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAlbumTracks, getSpotifyTrackInfo } from "../api/spotify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "../components/loading";
import { faEllipsis, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { searchYouTubeVideo } from "../api/youtube";
import { useTrackInfoStore, useVideoIdStore } from "../stores/video";
import useSessionStore from "../stores/session";
import EllipsisMenu from "../components/ellipsisMenu";
import { ITracksAllData } from "../types/spotify";

export default function Album() {
  const [tracks, setTracks] = useState<ITracksAllData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTrackId, setSelectedTrackId] = useState("");
  const { id } = useParams();
  const { setVideoId } = useVideoIdStore();
  const { isPlaying, trackInfo, setTrackInfo, playing, pause } =
    useTrackInfoStore();
  const { session } = useSessionStore();

  useEffect(() => {
    const fetchAlbumTracks = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const tracks = await getAlbumTracks(id);

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
    playing();
  };
  const pauseVideo = () => {
    pause();
  };
  const handleMenu = (id) => {
    setSelectedTrackId(id);
  };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="relative">
      <div className="flex shadow-2xl gap-6 relative h-[250px]">
        <img
          className="h-auto shadow-[rgba(0,0,0,0.35)_0px_5px_15px]"
          src={tracks[0].images ?? ""}
          alt={tracks[0].name}
        />
        <div className="flex font-rowdies flex-col justify-end items-start gap-4 pb-5">
          <div className="">앨범</div>
          <div className="text-6xl ">{tracks[0].name}</div>
          <div className="">
            {tracks[0].artists.map((artist, index) => {
              const isLast = index === tracks[0].artists.length - 1;
              return (
                <span className="font-bold" key={artist.id}>
                  <Link to={`/artist/${artist.id}`}>
                    <span className="hover:underline">{artist.name}</span>
                  </Link>
                  {!isLast && <span>, </span>}
                </span>
              );
            })}
            <span className="mx-1">·</span>
            <span className=" opacity-70">{tracks[0].release_date}</span>
          </div>
        </div>
      </div>
      <div className="m-6">
        <div className="mt-10 grid grid-cols-[1fr_20fr_1fr] mr-5 text-sm text-gray-400">
          <div className="flex justify-center items-center">#</div>
          <div>제목</div>
          <div className="flex justify-center items-center"></div>
        </div>
        <div className="border border-gray-200 my-3"></div>
        <div className="">
          {tracks.map((item) => {
            const artists = item.artists.map((i) => i.name).join(",");
            const artistsId = item.artists.map((i) => i.id).join(",");

            return (
              <div
                key={item.id}
                className="relative gap-4 py-2 px-4 hover:bg-purple-500 hover:rounded-md grid grid-cols-[1fr_20fr_1fr] group"
              >
                <div className="group-hover:hidden flex justify-center items-center">
                  {item.track_number}
                </div>
                <div className="hidden justify-center items-center group-hover:flex">
                  {isPlaying && trackInfo?.trackId === item.id ? (
                    <FontAwesomeIcon
                      icon={faPause}
                      className="cursor-pointer"
                      onClick={pauseVideo}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className="hover:cursor-pointer"
                      data-trackid={item.id}
                      data-name={item.name}
                      data-artists={artists}
                      data-artistsid={artistsId}
                      data-imgurl={item.images}
                      onClick={onPlayClick}
                      icon={faPlay}
                    />
                  )}
                </div>
                <div>
                  <div className="font-bold">{item.name}</div>
                  <div className="text-sm text-gray-400">
                    {item.artists.map((artist, index) => {
                      const isLast = index === item.artists.length - 1;
                      return (
                        <span key={artist.id}>
                          <Link to={`/artist/${artist.id}`}>
                            <span className="hover:underline">
                              {artist.name}
                            </span>
                          </Link>
                          {!isLast && <span>, </span>}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-center items-center">
                  <FontAwesomeIcon icon={faEllipsis} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
