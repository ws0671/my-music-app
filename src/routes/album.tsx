import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ITrack, ITracksAllData, getAlbumTracks } from "../api/spotify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import Loading from "../components/loading";

export default function Album() {
  const [tracks, setTracks] = useState<ITrack[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { id } = useParams();
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

  const onClick = () => {
    console.log(tracks);
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
            <span className="">{tracks[0].album_artists}</span>
            <span className="mx-3">·</span>
            <span>{tracks[0].release_date}</span>
          </div>
        </div>
      </div>
      <button
        className="w-10 h-10 bg-slate-400 text-white border border-black"
        onClick={onClick}
      >
        btn
      </button>
      <div className="grid grid-cols-[1fr_20fr_2fr] text-sm text-gray-400">
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
          <div className="grid grid-cols-[1fr_20fr_2fr]">
            <div className="flex justify-center items-center">
              {item.track_number}
            </div>
            <div>
              <div className="font-bold">{item.name}</div>
              <div className="text-sm text-gray-400">
                {item.artists.map((artist, index) => {
                  const isLast = index === item.artists.length - 1;
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
            <div className="flex justify-center items-center">
              {duration_min}:{duration_sec}
            </div>
          </div>
        );
      })}
    </div>
  );
}
