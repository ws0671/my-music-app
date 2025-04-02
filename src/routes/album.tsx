import { MouseEvent, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAlbumTracks, getSpotifyTrackInfo } from "../api/spotify";
import Loading from "../components/loading";
import { ITracksAllData } from "../types/spotify";
import Songlist from "../components/songlist";

export default function Album() {
  const [tracks, setTracks] = useState<ITracksAllData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { id } = useParams();

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

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="relative">
      <div className="sm:flex shadow-2xl gap-6 relative sm:h-[250px]">
        <div className="max-sm:py-5  flex-shrink-0">
          <img
            className="max-sm:w-40 h-full shadow-[rgba(0,0,0,0.35)_0px_5px_15px]"
            src={tracks[0].images ?? ""}
            alt={tracks[0].name}
          />
        </div>
        <div className="m-3 sm:m-0 flex font-rowdies flex-col justify-end  gap-4 pb-5">
          <div className="">앨범</div>
          <div className="max-sm:text-3xl text-5xl ">{tracks[0].name}</div>
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
          <Songlist isAlbum={true} tracks={tracks} />
        </div>
      </div>
    </div>
  );
}
