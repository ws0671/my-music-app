import { useEffect, useState } from "react";
import Loading from "../components/loading";
import { getFeaturedPlaylist, getSpotifyTrackInfo } from "../api/spotify";
import { Link, useLocation, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { searchYouTubeVideo } from "../api/youtube";
import { useTrackInfoStore, useVideoIdStore } from "../stores/video";
import useSessionStore from "../stores/session";
import EllipsisMenu from "../components/ellipsisMenu";

interface FeaturedPlayLists {
  track: {
    id: string;
    name: string;
    album: {
      images: [{ url: string }];
      name: string;
      id: string;
    };
    artists: [{ name: string; id: string }];
  };
}
export default function FeaturedPlayListsDetail() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [playlist, setPlaylist] = useState<FeaturedPlayLists[]>([]);
  const { id } = useParams();
  const location = useLocation();
  const { setVideoId } = useVideoIdStore();
  const { setTrackInfo, togglePlay } = useTrackInfoStore();
  const { session } = useSessionStore();

  const { imageUrl, name, description } = location.state || {};

  useEffect(() => {
    const fetchFeaturedPlaylists = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const playlist = await getFeaturedPlaylist(id);
          setPlaylist(playlist);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeaturedPlaylists();
  }, []);

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
    <div>
      <div className="flex shadow-2xl gap-10 relative">
        <img className="w-52 h-auto" src={imageUrl} alt={name} />
        <div className="flex space-y-3 flex-col justify-center">
          <div className="">플레이리스트</div>
          <div className={`font-bold ${"text-5xl"}`}>{name}</div>
          <div className="text-sm  ">{description}</div>
          <div className="font-bold">
            <span className="text-sm">{playlist.length}곡</span>
          </div>
        </div>
      </div>
      <div className="mt-10 grid grid-cols-[1fr_10fr_10fr_2fr] text-sm text-gray-400  mr-5">
        <div className="flex justify-center items-center">#</div>
        <div>제목</div>
        <div>앨범</div>
        <div className="flex justify-center items-center"></div>
      </div>
      <div className="border border-gray-200 my-3"></div>
      {playlist.map((item, index) => {
        const artists = item.track.artists.map((i) => i.name).join(", ");
        // const duration_min = Math.floor(item.track.duration_ms / 1000 / 60);
        // let duration_sec: string | number = Math.ceil(
        //   (item.track.duration_ms / 1000) % 60
        // );
        // duration_sec = duration_sec < 10 ? "0" + duration_sec : duration_sec;
        return (
          <div className="grid grid-cols-[1fr_10fr_10fr_2fr] py-1  hover:rounded-md hover:bg-orange-200  group mr-5  relative">
            <div className="group-hover:hidden flex justify-center items-center">
              {index + 1}
            </div>
            <div className="hidden justify-center items-center group-hover:flex">
              <FontAwesomeIcon
                className="hover:cursor-pointer"
                data-trackId={item.track.id}
                data-name={item.track.name}
                data-artists={artists}
                data-imgUrl={item.track.album.images[0].url}
                onClick={onPlayClick}
                icon={faPlay}
              />
            </div>
            <div className="flex items-center">
              <img
                className="w-10 h-10 rounded"
                src={item.track.album.images[0].url}
                alt={item.track.album.name}
              />
              <div className="ml-3">
                <div className="font-bold">{item.track.name}</div>

                <div className="text-sm text-gray-400">
                  {item.track.artists.map((artist, index) => {
                    const isLast = index === item.track.artists.length - 1;
                    return (
                      <>
                        <Link to={`/artist/${artist.id}`}>
                          <span className="hover:underline">{artist.name}</span>
                        </Link>
                        {!isLast && <span>, </span>}
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <Link to={`/album/${item.track.album.id}`}>
                <span className="hover:underline">{item.track.album.name}</span>
              </Link>
            </div>
            <EllipsisMenu
              trackId={item.track.id}
              name={item.track.name}
              artists={artists}
              imgUrl={item.track.album.images[0].url}
            />
          </div>
        );
      })}
    </div>
  );
}
