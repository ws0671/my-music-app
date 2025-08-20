import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getNewReleases } from "../api/spotify";
import Loading from "../components/loading";
import { IAllData } from "../types/spotify";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const startTime = useRef(performance.now());
  const [renderTime, setRenderTime] = useState<number | null>(null);

  const {
    data: music,
    isLoading,
    isError,
  } = useQuery<IAllData[]>({
    queryKey: ["newReleases"],
    queryFn: () => getNewReleases(),
  });
  useEffect(() => {
    if (!isLoading && music && music.length > 0 && renderTime === null) {
      const endTime = performance.now();
      const duration = endTime - startTime.current;

      // ✅ 값이 바뀔 때만 상태 변경
      if (renderTime === null) {
        setRenderTime(duration);
        // console.log(`🕒 첫 렌더링까지 걸린 시간: ${duration.toFixed(2)}ms`);
      }
    }
  }, [isLoading, music, renderTime]);

  if (isError) return <div>오류가 발생했습니다.</div>;
  return (
    <div className="h-full flex sm:flex flex-col p-6 bg-piur">
      <div className="flex flex-col mb-7 ">
        <span className="font-bold text-xl">새로나온 앨범</span>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-6 ">
          {music?.map((item) => {
            return (
              <Link className="" to={`album/${item.id}`} key={item.id}>
                <div className="">
                  <img className="rounded-lg w-full" src={item.images[0].url} />
                  <div className="my-1 truncate font-bold">{item.name}</div>
                  <div className="truncate text-sm font-bold text-gray-400">
                    {item.artists.map((artist, index) => {
                      const isLast = index === item.artists.length - 1;
                      return (
                        <Fragment key={artist.id}>
                          <Link to={`artist/${artist.id}`}>
                            <span className="hover:underline">
                              {artist.name}
                            </span>
                          </Link>
                          {!isLast && <span>, </span>}
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
