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
export const useTrackInfoStore = create((set) => ({
  trackInfo: null,
  setTrackInfo: (trackInfo: ITrackInfo) => set({ trackInfo }),
}));
export const useIsPlayingStore = create((set) => ({
  isPlaying: false,
  setIsPlaying: (state: boolean) => set({ isPlaying: state }),
}));
