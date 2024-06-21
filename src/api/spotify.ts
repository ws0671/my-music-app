import axios, { all } from "axios";
import { IAllData, IArtist, ITracksAllData } from "../types/spotify";

const BASE_URL = "https://accounts.spotify.com/api/token";

export const getAccessToken = async () => {
  const authParam = {
    grant_type: "client_credentials",
    client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    client_secret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
  };

  try {
    const res = await axios.post(
      BASE_URL,
      new URLSearchParams(authParam).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    window.localStorage.setItem("token", res.data.access_token);
    return res.data.access_token;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchTrack = async () => {
  const token = await getAccessToken();
  const query = "hello";
  const response = await axios.get(
    `https://api.spotify.com/v1/search?q=${query}&type=track`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getNewReleases = async (countryCode: string) => {
  let allData: IAllData[] = [];
  const limit = 50;
  let offset = 0;
  let total = 0;
  const token = await getAccessToken();
  do {
    const response = await axios.get(
      `https://api.spotify.com/v1/browse/new-releases?market=${countryCode}&limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data;

    total = data.albums.total;
    allData = allData.concat(data.albums.items);

    offset += limit;
  } while (offset < total);
  return allData;
};

const changeDateFormat = (inputDate: string) => {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};

export const getAlbumTracks = async (id: string) => {
  let allData: ITracksAllData[] = [];
  const limit = 50;
  let offset = 0;
  let total = 0;
  const token = await getAccessToken();
  do {
    const response = await axios.get(
      `https://api.spotify.com/v1/albums/${id}?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data;
    total = data.tracks.total;
    offset += limit;
    console.log(data);
    const release_date = changeDateFormat(data.release_date);
    const album_artists = data.artists
      .map((artist: IArtist) => artist.name)
      .join(", ");
    const img = data.images[0].url;
    const name = data.name;
    const tracksWithAlbumInfo = data.tracks.items.map((track) => {
      return {
        ...track,
        images: img,
        album_name: name,
        release_date,
        album_artists,
      };
    });
    allData = allData.concat(tracksWithAlbumInfo);
  } while (offset < total);

  return allData;
};

export const getArtist = async (id: string) => {
  const token = await getAccessToken();
  const response = await axios.get(`https://api.spotify.com/v1/artists/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);

  return response.data;
};
