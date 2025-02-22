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
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="">
      <div className="my-5">
        <span className="font-bold text-2xl">새로운 앨범</span>
        <span className="ml-5">
          <span
            onClick={() => onChangeCountryCode("KR")}
            className={
              countryCode === "KR"
                ? "bg-orange-400 text-white p-1 rounded cursor-pointer"
                : "cursor-pointer transition duration-1000 p-1 rounded hover:p-1 hover:text-white hover:bg-orange-400 hover:rounded"
            }
          >
            한국
          </span>
          <span> | </span>
          <span
            onClick={() => onChangeCountryCode("US")}
            className={
              countryCode === "US"
                ? "bg-orange-400 text-white p-1 rounded cursor-pointer"
                : "cursor-pointer transition duration-1000 p-1 rounded hover:p-1 hover:text-white hover:bg-orange-400 hover:rounded"
            }
          >
            미국
          </span>
          <span> | </span>
          <span
            onClick={() => onChangeCountryCode("JP")}
            className={
              countryCode === "JP"
                ? "bg-orange-400 text-white p-1 rounded cursor-pointer"
                : "cursor-pointer transition duration-1000 p-1 rounded hover:p-1 hover:text-white hover:bg-orange-400 hover:rounded"
            }
          >
            일본
          </span>
        </span>
      </div>
      <div className="grid grid-cols-6 gap-6 ">
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
                        <Link to={`artist/${artist.id}`}>
                          <span className="hover:underline">{artist.name}</span>
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
    </div>
  );
}
