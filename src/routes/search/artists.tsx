import { useEffect, useState } from "react";
import { useGetSearchAllAlbums } from "../../api/spotify";
import { useInView } from "react-intersection-observer";
import { Link, useLocation, useParams } from "react-router-dom";
import Loading from "../../components/loading";
import SearchDetailHeader from "../../components/search-detail-header";
function Artists() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const [artists, setArtists] = useState();
  let tab = pathname.split("/");
  tab = tab[tab.length - 1].slice(0, -1);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetSearchAllAlbums(id, tab);

  const { ref, inView } = useInView();
  useEffect(() => {
    if (!data?.pages) return;
    setArtists(data?.pages);
  }, [data?.pages]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="">
      <SearchDetailHeader />
      <div className="m-6 grid max-sm:grid-cols-2 grid-cols-6 gap-6 ">
        {artists &&
          artists.map((page) =>
            page.artists.items.map((artist) => {
              return (
                <Link key={artist.id} to={`/artist/${artist.id}`}>
                  <div className=" ">
                    <img
                      className="w-full aspect-square rounded-full"
                      src={
                        artist.images[0]
                          ? artist.images[0]?.url
                          : "/images/headphone.jpg"
                      }
                      alt={artist.name}
                    />
                    <div className="my-1 truncate font-bold hover:underline">
                      {artist.name}
                    </div>
                    <div className="text-sm text-gray-400">아티스트</div>
                  </div>
                </Link>
              );
            })
          )}
      </div>
      <div ref={ref} className="pt-8 pb-6">
        <Loading />{" "}
      </div>
    </div>
  );
}

export default Artists;
