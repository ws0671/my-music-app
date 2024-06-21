import { useEffect, useState } from "react";
import { getArtist } from "../api/spotify";
import { useParams } from "react-router-dom";
import Loading from "../components/loading";
import { ISpecificArtist } from "../types/spotify";

export default function Artist() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [artist, setArtist] = useState<ISpecificArtist>([]);
  const { id } = useParams();
  useEffect(() => {
    const fetchArtist = async () => {
      setIsLoading(true);
      try {
        const artist = await getArtist(id);
        setArtist(artist);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtist();
  }, []);
  if (isLoading) return <Loading />;
  return (
    <div>
      <div className="flex shadow-2xl gap-10 relative">
        <img className="w-50" src={artist.images[0].url} alt={artist.name} />
        <div className="flex items-center pb-10">
          <div className={"font-bold text-9xl"}>{artist.name}</div>
          <div className="font-bold absolute bottom-20 text-5xl">
            팔로워 {artist.followers.total.toLocaleString()}
          </div>
          <div className="font-bold absolute text-2xl bottom-5">
            {artist.genres.map((item, index) => {
              const isLast = index === artist.genres.length - 1;
              return (
                <>
                  <span>{item}</span>
                  {!isLast && <span className="mx-3">·</span>}
                </>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
