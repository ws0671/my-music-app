import { ITrackInfo } from "../stores/video";
import { supabase } from "./supabaseClient";

export async function addToPlaylist(track: ITrackInfo) {
  try {
    const { data, error } = await supabase.from("playlist").insert([
      {
        userId: track.userId,
        trackId: track.trackId,
        name: track.name,
        artists: track.artists,
        imgUrl: track.imgUrl,
        videoId: track.videoId,
        state: track.state,
      },
    ]);

    if (error) {
      throw error;
    }

    console.log("Track added to playlist:", data);
  } catch (error) {
    console.error("Error adding track to playlist:", error.message);
  }
}

export async function fetchPlaylist(session) {
  try {
    const { data, error } = await supabase
      .from("playlist")
      .select("*")
      .eq("userId", session.user.id);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching playlist:", error.message);
  }
}

export async function deleteTrack(track) {
  try {
    const { error } = await supabase
      .from("playlist")
      .delete()
      .eq("userId", track.userId)
      .eq("trackId", track.trackId);

    if (error) {
      throw error;
    }

    console.log(
      `Track with ID ${trackId} for user ${userId} deleted successfully.`
    );
  } catch (error) {
    console.error("Error deleting track:", error.message);
  }
}

export async function deleteAllTrack(session) {
  try {
    const { error } = await supabase
      .from("playlist")
      .delete()
      .eq("userId", session.user.id);

    if (error) {
      throw error;
    }

    console.log(`All tracks for user ${userId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting track:", error.message);
  }
}
