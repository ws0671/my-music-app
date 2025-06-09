import { useEffect, useState } from "react";
import { getArtist, getArtistTopTracks } from "../api/spotify";
import { useParams } from "react-router-dom";
import Loading from "../components/loading";
import { ISpecificArtist, ITracksAllData } from "../types/spotify";
import Songlist from "../components/songlist";
import { useQuery } from "@tanstack/react-query";

export default function Artist() {
  const { id } = useParams();
  // useEffect(() => {
  //   const fetchAlbumTracks = async () => {
  //     setIsLoading(true);
  //     try {
  //       if (id) {
  //         const artist = await getArtist(id);
  //         const tracks = await getArtistTopTracks(id);
  //         setArtist(artist);
  //         setTracks(tracks);
  //         setRelatedArtists(relatedArtists);
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchAlbumTracks();
  // }, [id]);
  const { data: artist, isLoading } = useQuery({
    queryKey: ["artitst", id],
    queryFn: () => getArtist(id ?? ""),
  });
  const { data: tracks } = useQuery({
    queryKey: ["artistTopTracks", id],
    queryFn: () => getArtistTopTracks(id ?? ""),
  });
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div>
      <div className="shadow-2xl gap-10 relative h-[300px] font-rowdies box-border overflow-hidden">
        <div className="flex justify-center items-center max-sm:py-5">
          <img
            className="max-sm:rounded-full max-sm:w-[150px] max-sm:h-[150px] opacity-80 object-[0%_10%] w-full object-cover h-full"
            src={artist?.images[0].url}
            alt={artist?.name}
          />
        </div>
        <div className="absolute bottom-5 left-5 break-all justify-center flex flex-col gap-4">
          <div className="">아티스트</div>
          <div className="font-[1000] text-responsive tracking-tighter">
            {artist?.name}
          </div>
          <div className="font-bold">
            팔로워 {artist?.followers.total.toLocaleString()}명
          </div>
          {/* <span className="font-bold text-sm">
            {artist?.genres.map((item, index) => {
              return (
                <span
                  className=" border-2 border-black rounded-xl p-1 mr-2"
                  key={index}
                >
                  {item}
                </span>
              );
            })}
          </span> */}
        </div>
      </div>
      <div className="m-6">
        <div className="mt-10 text-2xl font-bold">인기</div>
        <div className="border border-gray-200 my-3"></div>
        <Songlist isArtist={true} tracks={tracks} />
      </div>
    </div>
  );
}
