/**
 * This file contains all the functions related to the videos
 * It use the Youtube Data API v3 to extract all the videos off
 * the @TempleTeam channel and return them as a list of objects
 * containing the video id, title, thumbnail and category
 */
import {
  YOUTUBE_CATEGORY,
  type YOUTUBE_V3_SEARCH,
  type YOUTUBE_V3_VIDEOS,
  type VideoProps,
} from "../utils/types";
import { env } from "~/env.mjs";

export async function getVideosList(): Promise<VideoProps[]> {
  try {
    // Get json containing a list with all videos of @TempleTeam
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?channelId=${env.YOUTUBE_CHANNEL_ID}&order=date&type=video&key=${env.YOUTUBE_API_KEY}`
    );

    // Parse data and extract only the video ids
    const data = (await res.json()) as YOUTUBE_V3_SEARCH;
    const videosId = data.items?.map((video) => {
      return video.id.videoId;
    });

    // Get json containing all videos data
    const videoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videosId?.join(
        ","
      )}&order=date&key=${process.env.YOUTUBE_API_KEY}`
    );
    const videoData = (await videoRes.json()) as YOUTUBE_V3_VIDEOS;

    // Return only the data we need
    return videoData.items?.map((video) => {
      return {
        id: video.id,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high.url,
        category: YOUTUBE_CATEGORY[video.snippet.categoryId] ?? "",
      };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}
