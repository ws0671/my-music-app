import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { checkAuth } from "../utils/auth";
import useSessionStore from "../stores/session";
import {
  getAccessToken,
  getNewReleases,
  getSpotifyToken,
  searchTrack,
} from "../api/spotify";
import Loading from "../components/loading";
import { ITrack } from "../types/spotify";

export default function Home() {
  const { session, setSession } = useSessionStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [music, setMusic] = useState([]);
  const [countryCode, setContryCode] = useState("KR");
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    checkAuth();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setSession(false);
  };
  const onTest = async () => {
    console.log(await getAccessToken());
  };

  const onSearch = async () => {
    console.log(music);
  };
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

  const onChangeCountryCode = (code) => {
    setContryCode(code);
  };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="">
      {session ? (
        <button onClick={signOut}>logout</button>
      ) : (
        <Link to={"create-account"}>signup</Link>
      )}

      <button onClick={onTest}>TEST</button>
      <button onClick={onSearch}>검색</button>
      <div className="my-5">
        <span className="font-bold text-2xl">새로 발매된 앨범</span>
        <span className="ml-5">
          <span
            onClick={() => onChangeCountryCode("KR")}
            className={
              countryCode === "KR"
                ? "bg-black text-white p-1 rounded cursor-pointer"
                : "cursor-pointer transition duration-1000 p-1 rounded hover:p-1 hover:text-white hover:bg-black hover:rounded"
            }
          >
            한국
          </span>
          <span> | </span>
          <span
            onClick={() => onChangeCountryCode("US")}
            className={
              countryCode === "US"
                ? "bg-black text-white p-1 rounded cursor-pointer"
                : "cursor-pointer transition duration-1000 p-1 rounded hover:p-1 hover:text-white hover:bg-black hover:rounded"
            }
          >
            미국
          </span>
          <span> | </span>
          <span
            onClick={() => onChangeCountryCode("JP")}
            className={
              countryCode === "JP"
                ? "bg-black text-white p-1 rounded cursor-pointer"
                : "cursor-pointer transition duration-1000 p-1 rounded hover:p-1 hover:text-white hover:bg-black hover:rounded"
            }
          >
            일본
          </span>
        </span>
      </div>
      <div className="flex flex-wrap gap-6 ">
        {music.map((item) => {
          const allArtists = item.artists.map((i) => i.name).join(", ");
          return (
            <Link to={`album/${item.id}`} key={item.id}>
              <div className="w-44">
                <img
                  className="rounded-lg w-44 h-44"
                  src={item.images[2].url}
                />
                <div className="truncate font-bold" key={item.id}>
                  {item.name}
                </div>
                <div className="truncate text-sm  text-gray-400">
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
