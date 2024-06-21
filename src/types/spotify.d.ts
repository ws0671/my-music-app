export interface IAllData {
  artists: [{ name: string }];
  id: string;
  images: [{ url: string }];
  name: string;
}

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
