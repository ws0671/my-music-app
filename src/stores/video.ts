import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { YouTubePlayer } from "react-youtube";

interface YouTubeState {
  player: YouTubePlayer | null;
  setPlayer: (player: YouTubePlayer) => void;
  play: () => void;
  pause: () => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
}

export const useYouTubeStore = create<YouTubeState>((set, get) => ({
  player: null,
  setPlayer: (player) => set({ player }),
  play: () => {
    const { player } = get();
    if (player) player.playVideo();
  },
  pause: () => {
    const { player } = get();
    if (player) player.pauseVideo();
  },
  currentTime: 0,
  setCurrentTime: (time) => set({ currentTime: time }),
}));

interface VideoId {
  videoId: string;
  setVideoId: (id: string) => void;
}
export const useVideoIdStore = create<VideoId>((set) => ({
  videoId: "",
  setVideoId: (id: string) => set({ videoId: id }),
}));
export interface ITrackInfo {
  userId?: string;
  trackId: string | null;
  name: string | null;
  artists: string | null;
  artistsId: string | null;
  imgUrl: string | null;
  state?: string;
  videoId: string;
}
interface TrackInfoState {
  trackInfo: ITrackInfo | null;
  isPlaying: boolean;
  setTrackInfo: (trackInfo: ITrackInfo) => void;
  togglePlay: () => void;
  statePlay: () => void;
  statePause: () => void;
  isTrackPlaying: () => boolean;
}
export const useTrackInfoStore = create<TrackInfoState>((set, get) => ({
  trackInfo: null,
  isPlaying: false,
  setTrackInfo: (trackInfo) => set({ trackInfo }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  statePlay: () => set(() => ({ isPlaying: true })),
  statePause: () => set(() => ({ isPlaying: false })),
  isTrackPlaying: () => {
    const { trackInfo } = get();
    return trackInfo !== null;
  },
}));
interface CurrentTackIndexStore {
  currentTrackIndex: number;
  setCurrentTrackIndex: (index: number) => void;
}
export const useCurrentTrackIndexStore = create<CurrentTackIndexStore>(
  (set) => ({
    currentTrackIndex: 0,
    setCurrentTrackIndex: (index: number) => set({ currentTrackIndex: index }),
  })
);

interface PlaylistState {
  playlist: ITrackInfo[];
  setPlaylist: (newPlaylist: ITrackInfo) => void;
  removePlaylist: (index: number) => void;
  resetPlaylist: () => void;
}
export const usePlaylistStore = create(
  persist<PlaylistState>(
    (set, get) => ({
      playlist: [],
      setPlaylist: (newPlaylist: ITrackInfo) =>
        set((prev) => ({
          playlist: [...prev.playlist, newPlaylist],
        })),
      removePlaylist: (index: number) => {
        const updatedPlaylist = get().playlist.filter(
          (_, i: number) => i !== index
        );
        set({ playlist: updatedPlaylist });
      },
      resetPlaylist: () => set({ playlist: [] }),
    }),
    {
      name: "playlist",
    }
  )
);

interface UserPlaylistState {
  userPlaylist: ITrackInfo[];
  replaceUserPlaylist: (newPlaylist: ITrackInfo[]) => void;
  setUserPlaylist: (newPlaylist: ITrackInfo) => void;
  removeUserPlaylist: (index: number) => void;
  resetUserPlaylist: () => void;
}
export const useUserPlaylistStore = create<UserPlaylistState>((set, get) => ({
  userPlaylist: [],
  replaceUserPlaylist: (newPlaylist) => set({ userPlaylist: [...newPlaylist] }),
  setUserPlaylist: (newPlaylist) =>
    set((prev) => ({
      userPlaylist: [...prev.userPlaylist, newPlaylist],
    })),
  removeUserPlaylist: (index) => {
    const updatedPlaylist = get().userPlaylist.filter((_, i) => i !== index);
    set({ userPlaylist: updatedPlaylist });
  },
  resetUserPlaylist: () => set({ userPlaylist: [] }),
}));
