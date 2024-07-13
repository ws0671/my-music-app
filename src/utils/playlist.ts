import { Session } from "@supabase/supabase-js";
import { ITrackInfo } from "../stores/video";
import { supabase } from "./supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";

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
    const postgrestError = error as PostgrestError;
    console.error("Error adding track to playlist:", postgrestError.message);
  }
}

export async function fetchPlaylist(session: Session) {
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
    const postgrestError = error as PostgrestError;
    console.error("Error fetching playlist:", postgrestError.message);
  }
}
interface DeleteTrack {
  userId: string;
  trackId: string;
}
export async function deleteTrack(track: DeleteTrack) {
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
      `Track with ID ${track.trackId} for user ${track.userId} deleted successfully.`
    );
  } catch (error) {
    const postgrestError = error as PostgrestError;

    console.error("Error deleting track:", postgrestError.message);
  }
}

export async function deleteAllTrack(session: Session) {
  try {
    const { error } = await supabase
      .from("playlist")
      .delete()
      .eq("userId", session.user.id);

    if (error) {
      throw error;
    }

    console.log(`All tracks for user ${session.user.id} deleted successfully.`);
  } catch (error) {
    const postgrestError = error as PostgrestError;

    console.error("Error deleting track:", postgrestError.message);
  }
}
