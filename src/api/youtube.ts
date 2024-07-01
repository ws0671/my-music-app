import axios from "axios";
export const searchYouTubeVideo = async (query: string) => {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const response = await axios.get(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query
    )}&key=${apiKey}&type=video&maxResults=1`
  );

  if (response.data.items.length) {
    return response.data.items[0].id.videoId;
  } else {
    throw new Error("No video found on YouTube");
  }
};
