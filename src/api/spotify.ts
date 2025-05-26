import axios from "axios";
import { IAllData, IArtist, ITrack, ITracksAllData } from "../types/spotify";

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
    const release_date = changeDateFormat(data.release_date);
    const album_artists = data.artists
      .map((artist: IArtist) => artist.name)
      .join(", ");
    const img = data.images[0].url;
    const name = data.name;
    const tracksWithAlbumInfo = data.tracks.items.map((track: ITrack) => {
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
  console.log(id);
  const apiUrl = `https://api.spotify.com/artists/${id}`;

  const token = await getAccessToken();
  console.log("Token:", token);

  const response = await axios.get(`https://api.spotify.com/v1/artists/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("Requesting:", apiUrl);

  return response.data;
};

export const getArtistTopTracks = async (id: string) => {
  const token = await getAccessToken();
  const response = await axios.get(
    `https://api.spotify.com/v1/artists/${id}/top-tracks`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.tracks;
};

// export const getRelatedArtist = async (id: string) => {
//   const token = await getAccessToken();
//   const response = await axios.get(
//     `https://api.spotify.com/v1/artists/${id}/related-artists`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   return response.data.artists;
// };

export const getFeaturedPlaylists = async () => {
  const token = await getAccessToken();

  const response = await axios.get(
    `https://api.spotify.com/v1/tracks
`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response);
};

export const getFeaturedPlaylist = async (id: string) => {
  const token = await getAccessToken();
  const response = await axios.get(
    `
https://api.spotify.com/v1/playlists/${id}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response);

  return response.data.items;
};

export const getSpotifyTrackInfo = async (trackId: string | null) => {
  const token = await getAccessToken();
  const response = await axios.get(
    `
https://api.spotify.com/v1/tracks/${trackId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = response.data;

  return { name: data.name, artist: data.artists[0].name };
};

export const searchTracks = async (query: string) => {
  const token = await getAccessToken();

  if (!token) {
    console.error("Access token is not available");
    return;
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query,
        type: "track,artist,playlist,album",
        limit: 10,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching tracks", error);
  }
};
