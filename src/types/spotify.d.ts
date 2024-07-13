export interface IAllData {
  artists: [{ name: string; id: string }];
  id: string;
  images: [{ url: string }];
  name: string;
}

export interface ITrack {
  id: string;
  name: string;
  track_number: number;
  artists: [{ name: string; id: string }];
  images: [{ url: string }];
  album_name: string;
  album_artists: string;
  release_date: string;
}
export interface ITracksAllData {
  album: { images: [{ url: string }]; name: string; id: string };
  artists: [{ name: string; id: string }];
  id: string;
  images: string;
  name: string;
  track_number: number;
  release_date: string;
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
export interface IArtist {
  name: string;
}

export interface ISpecificArtist {
  followers: { total: number };
  genres: [string];
  images: [{ url: string }];
  name: string;
  id: string;
}

export interface IPlaylists {
  description: string;
  id: string;
  images: [{ url: string }];
  name: string;
}
