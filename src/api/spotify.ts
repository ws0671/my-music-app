import axios, { all } from "axios";

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
interface IAllData {
  artists: [{ name: string }];
  id: string;
  images: [{ url: string }];
  name: string;
}

export const getNewReleases = async () => {
  let allData: IAllData[] = [];
  const limit = 50;
  let offset = 0;
  let total = 0;
  const token = await getAccessToken();
  do {
    const response = await axios.get(
      `https://api.spotify.com/v1/browse/new-releases?limit=${limit}&offset=${offset}`,
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

export interface ITrack {
  id: string;
  name: string;
  track_number: number;
  artists: [{ name: string }];
  images: string;
  album_name: string;
  album_artists: string;
  release_date: string;
}
export interface ITracksAllData {
  artists: [{ name: string }];
  id: string;
  images: [{ url: string }];
  name: string;
  tracks: [
    {
      id: string;
      name: string;
      track_number: number;
      artists: [{ name: string }];
      images: string;
      album_name: string;
      album_artists: string;
      release_date: string;
    }
  ];
}

const changeDateFormat = (inputDate) => {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};
export const getAlbumTracks = async (id) => {
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
    const album_artists = data.artists.map((artist) => artist.name).join(", ");
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
