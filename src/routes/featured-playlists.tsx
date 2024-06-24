import { useEffect, useState, useRef } from "react";
import { getFeaturedPlaylists } from "../api/spotify";
import Loading from "../components/loading";
import { Link } from "react-router-dom";
import { IPlaylists } from "../types/spotify";
import TruncatedText from "../components/truncated-text";

export default function FeaturedPlayLists() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [playlists, setPlaylists] = useState<IPlaylists[]>([]);
  useEffect(() => {
    const fetchFeaturedPlaylists = async () => {
      setIsLoading(true);
      try {
        const playlists = await getFeaturedPlaylists();
        setPlaylists(playlists);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeaturedPlaylists();
  }, []);
  if (isLoading) return <Loading />;
  return (
    <div>
      <div className="my-5">
        <span className="font-bold text-2xl">MMA 플레이리스트</span>
      </div>
      <div className="flex flex-wrap gap-6 ">
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
      </div>
    </div>
  );
}
