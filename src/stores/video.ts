import { create } from "zustand";
import { persist } from "zustand/middleware";
interface VideoId {
  videoId: string | null;
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
  imgUrl: string | null;
  state?: string;
  videoId: string | null;
}
interface TrackInfoState {
  trackInfo: ITrackInfo | null;
  isPlaying: boolean;
  setTrackInfo: (trackInfo: ITrackInfo) => void;
  togglePlay: () => void;
}
export const useTrackInfoStore = create<TrackInfoState>((set) => ({
  trackInfo: null,
  isPlaying: false,
  setTrackInfo: (trackInfo) => set({ trackInfo }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));
// export const useIsPlayingStore = create((set) => ({
//   isPlaying: false,
//   setIsPlaying: (state: boolean) => set({ isPlaying: state }),
// }));
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
