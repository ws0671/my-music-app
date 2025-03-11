import { useEffect, useState } from "react";
import {
  getArtist,
  getArtistTopTracks,
  getSpotifyTrackInfo,
} from "../api/spotify";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/loading";
import { ISpecificArtist, ITracksAllData } from "../types/spotify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useTrackInfoStore, useVideoIdStore } from "../stores/video";
import { searchYouTubeVideo } from "../api/youtube";
import useSessionStore from "../stores/session";
import EllipsisMenu from "../components/ellipsisMenu";

export default function Artist() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [artist, setArtist] = useState<ISpecificArtist>();
  const [tracks, setTracks] = useState<ITracksAllData[]>([]);
  const [relatedArtists, setRelatedArtists] = useState<ISpecificArtist[]>([]);
  const { id } = useParams();
  const { setVideoId } = useVideoIdStore();
  const { setTrackInfo, togglePlay } = useTrackInfoStore();
  const { session } = useSessionStore();
  useEffect(() => {
    const fetchArtist = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const artist = await getArtist(id);
          const tracks = await getArtistTopTracks(id);
          setArtist(artist);
          setTracks(tracks);
          setRelatedArtists(relatedArtists);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtist();
  }, [id]);
  console.log(tracks);
  const onPlayClick = async (e: React.MouseEvent<SVGSVGElement>) => {
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
    setVideoId(fetchedVideoId);
    setTrackInfo(trackInfoOne);
    togglePlay();
  };

  if (isLoading) return <Loading />;
  return (
    <div>
      <div className="shadow-2xl gap-10 relative h-[300px] font-rowdies box-border overflow-hidden">
        <img
          className="opacity-80 object-[0%_10%] w-full object-cover h-full"
          src={artist?.images[0].url}
          alt={artist?.name}
        />
        <div className="absolute bottom-5 left-5 break-all justify-center flex flex-col gap-4">
          <div className="">아티스트</div>
          <div className="font-[1000] text-responsive tracking-tighter">
            {artist?.name}
          </div>
          <div className="font-bold">
            팔로워 {artist?.followers.total.toLocaleString()}명
          </div>
          {/* <span className="font-bold text-sm">
            {artist?.genres.map((item, index) => {
              return (
                <span
                  className=" border-2 border-black rounded-xl p-1 mr-2"
                  key={index}
                >
                  {item}
                </span>
              );
            })}
          </span> */}
        </div>
      </div>
      <div className="m-6">
        <div className="mt-10 text-2xl font-bold">인기</div>
        <div className="border border-gray-200 my-3"></div>
        {tracks.map((item, index) => {
          const artists = item.artists.map((i) => i.name).join(", ");
          // const duration_min = Math.floor(item.duration_ms / 1000 / 60);
          // let duration_sec: string | number = Math.ceil(
          //   (item.duration_ms / 1000) % 60
          // );
          // duration_sec = duration_sec < 10 ? "0" + duration_sec : duration_sec;
          return (
            <div
              key={item.id}
              className="relative gap-4 py-2 px-4 hover:bg-purple-500 hover:rounded-md grid grid-cols-[1fr_20fr_1fr] group"
            >
              <div className="group-hover:hidden flex justify-center items-center">
                {index + 1}
              </div>
              <div className="hidden justify-center items-center group-hover:flex">
                <FontAwesomeIcon
                  className="hover:cursor-pointer"
                  data-trackid={item.id}
                  data-name={item.name}
                  data-artists={artists}
                  data-imgurl={item.album.images[0].url}
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
                imgUrl={item.album.images[0].url}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
