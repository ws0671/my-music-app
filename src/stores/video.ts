import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useVideoIdStore = create((set) => ({
  videoId: "",
  setVideoId: (id: string) => set({ videoId: id }),
}));
export interface ITrackInfo {
  id: string;
  name: string;
  artists: string;
  imgUrl: string;
  state?: string;
  videoId: string;
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

export const useCurrentTrackIndexStore = create((set) => ({
  currentTrackIndex: 0,
  setCurrentTrackIndex: (index: number) => set({ currentTrackIndex: index }),
}));

export const usePlaylistStore = create(
  persist(
    (set, get) => ({
      playlist: [],
      setPlaylist: (newPlaylist) =>
        set((prev) => ({
          playlist: [...prev.playlist, newPlaylist],
        })),
      removePlaylist: (index) => {
        const updatedPlaylist = get().playlist.filter((_, i) => i !== index);
        set({ playlist: updatedPlaylist });
      },
      resetPlaylist: () => set({ playlist: [] }),
    }),
    {
      name: "playlist",
    }
  )
);

export const useUserPlaylistStore = create((set, get) => ({
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
