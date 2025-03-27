import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNewReleases } from "../api/spotify";
import Loading from "../components/loading";
import { IAllData } from "../types/spotify";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [music, setMusic] = useState<IAllData[]>([]);
  const [countryCode, setContryCode] = useState("KR");

  useEffect(() => {
    const fetchNewReleases = async () => {
      setIsLoading(true);
      try {
        const music = await getNewReleases(countryCode);
        setMusic(music);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNewReleases();
  }, [countryCode]);

  const onChangeCountryCode = (code: string) => {
    setContryCode(code);
  };

  return (
    <div className="h-full flex sm:flex flex-col p-6 bg-piur">
      <div className="flex items-center flex-col mb-7 ">
        <span className="font-bold text-4xl mb-4">새로나온 앨범</span>
        <span className="space-x-3 text-base">
          <span
            onClick={() => onChangeCountryCode("KR")}
            className={
              countryCode === "KR"
                ? "bg-purple-400 text-white px-2 py-1 rounded cursor-pointer"
                : "cursor-pointer transition duration-500 px-2 py-1 rounded hover:px-2 hover:py-1 hover:text-white hover:bg-purple-400 hover:rounded"
            }
          >
            한국
          </span>
          <span> | </span>
          <span
            onClick={() => onChangeCountryCode("US")}
            className={
              countryCode === "US"
                ? "bg-purple-400 text-white px-2 py-1 rounded cursor-pointer"
                : "cursor-pointer transition duration-500 px-2 py-1 rounded hover:px-2 hover:py-1 hover:text-white hover:bg-purple-400 hover:rounded"
            }
          >
            미국
          </span>
          <span> | </span> 
          <span
            onClick={() => onChangeCountryCode("JP")}
            className={
              countryCode === "JP"
                ? "bg-purple-400 text-white px-2 py-1 rounded cursor-pointer"
                : "cursor-pointer transition duration-500 px-2 py-1 rounded hover:px-2 hover:py-1 hover:text-white hover:bg-purple-400 hover:rounded"
            }
          >
            일본
          </span>
        </span>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 ">
          {music.map((item) => {
            return (
              <Link className="" to={`album/${item.id}`} key={item.id}>
                <div className="">
                  <img className="rounded-lg w-full" src={item.images[0].url} />
                  <div className="my-1 truncate font-bold" key={item.id}>
                    {item.name}
                  </div>
                  <div className="truncate text-sm font-bold text-gray-400">
                    {item.artists.map((artist, index) => {
                      const isLast = index === item.artists.length - 1;
                      return (
                        <>
                          <Link to={`artist/${artist.id}`} key={artist.id}>
                            <span className="hover:underline">
                              {artist.name}
                            </span>
                          </Link>
                          {!isLast && <span>, </span>}
                        </>
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
