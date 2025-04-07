import React from "react";
import { ISpecificArtist, ITracksAllData } from "../types/spotify";
import { useTrackInfoStore, useVideoIdStore } from "../stores/video";
import useSessionStore from "../stores/session";
import { getSpotifyTrackInfo } from "../api/spotify";
import { Link, useParams } from "react-router-dom";
import { searchYouTubeVideo } from "../api/youtube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

interface IPageProps {
  isArtist?: boolean;
  isAlbum?: boolean;
  tracks: ITracksAllData[];
}
export default function Songlist({ isArtist, isAlbum, tracks }: IPageProps) {
  const { setVideoId } = useVideoIdStore();
  const { isPlaying, trackInfo, setTrackInfo, playing, pause } =
    useTrackInfoStore();
  const { session } = useSessionStore();

  const onPlayClick = async (e: React.MouseEvent<SVGSVGElement>) => {
    const trackId = e.currentTarget.getAttribute("data-trackid");
    const name = e.currentTarget.getAttribute("data-name");
    const artists = e.currentTarget.getAttribute("data-artists");
    const artistsId = e.currentTarget.getAttribute("data-artistsid");
    const imgUrl = e.currentTarget.getAttribute("data-imgurl");
    const trackInfo = await getSpotifyTrackInfo(trackId);
    const searchQuery = `${trackInfo.name} ${trackInfo.artist}`;
    const fetchedVideoId = await searchYouTubeVideo(searchQuery);
    const trackInfoOne = {
      userId: session?.user.id,
      trackId,
      name,
      artists,
      artistsId,
      imgUrl,
      videoId: fetchedVideoId,
    };

    setVideoId(fetchedVideoId);
    setTrackInfo(trackInfoOne);
    playing();
  };
  const pauseVideo = () => {
    pause();
  };
  const addToPlaylist = async (e: React.MouseEvent<SVGSVGElement>) => {
    const trackId = e.currentTarget.getAttribute("data-trackid");
    const name = e.currentTarget.getAttribute("data-name");
    const artists = e.currentTarget.getAttribute("data-artists");
    const artistsId = e.currentTarget.getAttribute("data-artistsid");
    const imgUrl = e.currentTarget.getAttribute("data-imgurl");
    const trackInfo = await getSpotifyTrackInfo(trackId);
    const searchQuery = `${trackInfo.name} ${trackInfo.artist}`;
    const fetchedVideoId = await searchYouTubeVideo(searchQuery);
    const trackInfoOne = {
      userId: session?.user.id,
      trackId,
      name,
      artists,
      artistsId,
      imgUrl,
      videoId: fetchedVideoId,
    };
    setTrackInfo(trackInfoOne);
  };

  return (
    <>
      {tracks.map((item, index) => {
        const artists = item.artists.map((i) => i.name).join(",");
        const artistsId = item.artists.map((i) => i.id).join(",");
        let image = "";
        if (isArtist) {
          image = item.album.images[0].url;
        } else if (isAlbum) {
          image = item.images;
        }

        return (
          <div
            key={item.id}
            className="relative gap-4 py-2 px-4 hover:bg-purple-500 hover:rounded-md grid grid-cols-[1fr_20fr_1fr] group"
          >
            <div className="group-hover:hidden flex justify-center items-center">
              {index + 1}
            </div>
            <div className="hidden justify-center items-center group-hover:flex">
              {isPlaying && trackInfo?.trackId === item.id ? (
                <FontAwesomeIcon
                  icon={faPause}
                  className="cursor-pointer"
                  onClick={pauseVideo}
                />
              ) : (
                <FontAwesomeIcon
                  className="hover:cursor-pointer"
                  data-trackid={item.id}
                  data-name={item.name}
                  data-artists={artists}
                  data-artistsid={artistsId}
                  data-imgurl={image}
                  onClick={onPlayClick}
                  icon={faPlay}
                />
              )}
            </div>
            <div>
              <div className="font-bold">{item.name}</div>
              <div className="text-sm text-gray-400">
                {item.artists.map((artist, index) => {
                  const isLast = index === item.artists.length - 1;
                  return (
                    <span key={artist.id}>
                      <Link to={`/artist/${artist.id}`}>
                        <span className="hover:underline">{artist.name}</span>
                      </Link>
                      {!isLast && <span>, </span>}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center items-center">
              <FontAwesomeIcon
                className="hover:cursor-pointer"
                data-trackid={item.id}
                data-name={item.name}
                data-artists={artists}
                data-artistsid={artistsId}
                data-imgurl={image}
                icon={faCirclePlus}
                onClick={addToPlaylist}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}
