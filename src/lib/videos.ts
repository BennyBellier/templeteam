import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import {
  type YOUTUBE_V3_VIDEOS,
  type YOUTUBE_V3_SEARCH,
  type VideoProps,
  YOUTUBE_CATEGORY,
} from "~/utils/types";

async function apiVideosQuery(videosId: string[]): Promise<VideoProps[]> {
  const responseVideos = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videosId.join(
      ","
    )}&key=${process.env.YOUTUBE_API_KEY}`
  );

  if (!responseVideos.ok) {
    const errorData = (await responseVideos.json()) as {
      error?: { message?: string };
    };
    const errorMessage = errorData?.error?.message ?? "Unknown error";
    console.error(
      `[YOUTUBE VIDEO QUERY] Error fetching data: ${responseVideos.status} ${responseVideos.statusText} : ${errorMessage}`
    );
  }

  const data = (await responseVideos.json()) as YOUTUBE_V3_VIDEOS;

  return data.items.map((item) => {
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      category: YOUTUBE_CATEGORY[item.snippet.categoryId] ?? "Inconnue",
      publishedAt: item.snippet.publishedAt,
    };
  });
}

async function checkNewVideos() {
  // Get the latest videos from the YouTube API Search
  const searchQuery = await fetch(
    `https://www.googleapis.com/youtube/v3/search?channelId=${env.YOUTUBE_CHANNEL_ID}&maxResults=50&order=date&type=video&key=${env.YOUTUBE_API_KEY}`
  );

  // Check if the request was successful
  if (!searchQuery.ok) {
    const errorData = (await searchQuery.json()) as {
      error?: { message?: string };
    };
    const errorMessage = errorData?.error?.message ?? "Unknown error";
    throw new Error(
      `[YOUTUBE SEARCH QUERY] Error fetching data: ${searchQuery.status} ${searchQuery.statusText} : ${errorMessage}`
    );
  }

  // Parse the data of Youtube API
  const searchData = (await searchQuery.json()) as YOUTUBE_V3_SEARCH;

  // Check if there are any videos on the Youtube channel
  if (searchData.items.length === 0) {
    console.log("[SEARCH] There are no videos on the channel");
    return;
  }

  // Get the most recent video from the Prisma database
  const lastVideoDB = await prisma.youtubeVideos.findFirst({
    orderBy: {
      publishedAt: "desc",
    },
  });

  console.log("[PRISMA]", lastVideoDB);

  // Check if there are any videos in the database
  const lastVideoDBDate = lastVideoDB?.publishedAt ? new Date(lastVideoDB?.publishedAt) : new Date("1970-01-01T00:00:00.000Z");

  console.log(
    new Date(
      searchData.items[0]?.snippet.publishedAt ?? "1970-01-01T00:00:00.000Z"
    )
  );

  if (
    new Date(
      searchData.items[0]?.snippet.publishedAt ?? "1970-01-01T00:00:00.000Z"
    ) <= lastVideoDBDate
  ) {
    console.log("There are no new videos");
    return;
  }

  // Get only the id of the most recent video from the Youtube API Search
  const videosId = searchData.items.map((item: { id: { videoId: string } }) => {
    return item.id.videoId;
  });

  // Get the data of the most recent video from the Youtube
  const videosQuery = await apiVideosQuery(videosId);

  console.log("[VIDEOS] ", videosQuery);

  videosQuery.forEach((video) => {
    if (new Date(video.publishedAt) <= lastVideoDBDate) {
      return;
    }

    prisma.youtubeVideos
      .create({
        data: {
          id: video.id,
          title: video.title,
          thumbnail: video.thumbnail,
          category: video.category,
          publishedAt: video.publishedAt,
        },
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

export async function getSortedYoutubeVideos() {
  try {
    await checkNewVideos();

    return await prisma.youtubeVideos.findMany({
      orderBy: {
        publishedAt: "desc",
      },
      take: 20,
    });
  } catch (error) {
    console.log(error);
    return [];
  }
}
