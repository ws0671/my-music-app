import { useEffect, useRef, useState } from "react";
import { useGetSearchAllAlbums } from "../../api/spotify";
import { useInView } from "react-intersection-observer";
import { Link, useLocation, useParams } from "react-router-dom";
import Loading from "../../components/loading";
function Albums() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const [albums, setAlbums] = useState();
  const { ref, inView } = useInView();
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

  useEffect(() => {
    if (!data?.pages) return;
    setAlbums(data?.pages);

    console.log("앨범 데이터", data);
  }, [data?.pages]);

  useEffect(() => {
    console.log("인부", inView);
    console.log("해넥페", hasNextPage);
    console.log("이패넥페", isFetchingNextPage);

    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log("감지");

      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="m-6  h-full ">
      <h3 className="mt-10 mb-5 text-2xl font-bold">전체 앨범</h3>
      <div className="grid max-sm:grid-cols-2 grid-cols-6 gap-6 ">
        {albums &&
          albums.map((page) =>
            page.albums.items.map((item) => {
              return (
                <Link to={`/album/${item.id}`} key={item.id}>
                  <div className="">
                    <img
                      className="rounded-lg w-full"
                      src={item.images[0].url}
                    />
                    <div className="my-1 truncate font-bold" key={item.id}>
                      {item.name}
                    </div>
                    <div className="truncate text-sm  text-gray-400">
                      {item.artists.map((artist, index) => {
                        const isLast = index === item.artists.length - 1;
                        return (
                          <div className="inline-block" key={index}>
                            <Link to={`/artist/${artist.id}`}>
                              <span className="hover:underline">
                                {artist.name}
                              </span>
                            </Link>
                            {!isLast && <span>,&nbsp;</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
      </div>
      <div ref={ref} className="h-px" />
      LOAD MORE
      {isFetchingNextPage && (
        <div className="pt-8 pb-6">
          <Loading />
        </div>
      )}
    </div>
  );
}

export default Albums;
