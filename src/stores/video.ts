import { create } from "zustand";

export const useVideoIdStore = create((set) => ({
  videoId: "",
  setVideoId: (id: string) => set({ videoId: id }),
}));
export interface ITrackInfo {
  id: string;
  name: string;
  artists: string;
  imgurl: string;
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
