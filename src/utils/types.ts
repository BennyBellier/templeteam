export interface ReferenceProps {
  name: string;
  href: string;
  logo: string;
  alt: string;
}

export interface PhotoProps {
  img: string;
  title: string;
  width: number;
  height: number;
}

export interface AlbumsData {
  albumName: string;
  link: string;
  date: number;
  thumbnail: { file: string; width: number; height: number };
}

export interface AlbumProps {
  albumName: string;
  date: number;
  description: string;
  data: { id: string; src: string; width: number; height: number }[];
}

export interface YOUTUBE_V3_SEARCH {
  kind: string;
  etag: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: {
    kind: string;
    etag: string;
    id: {
      kind: string;
      videoId: string;
    };
    snippet: {
      publishedAt: string;
    };
  }[];
}

export interface YOUTUBE_V3_VIDEOS {
  kind: string;
  etag: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: {
    kind: string;
    etag: string;
    id: string;
    snippet: {
      publishedAt: string;
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        default: {
          url: string;
          width: number;
          height: number;
        };
        medium: {
          url: string;
          width: number;
          height: number;
        };
        high: {
          url: string;
          width: number;
          height: number;
        };
        standard: {
          url: string;
          width: number;
          height: number;
        };
      };
      channelTitle: string;
      tags: string[];
      categoryId: number;
      liveBroadcastContent: string;
      localized: {
        title: string;
        description: string;
      };
    };
  }[];
}

export interface YOUTUBE_V3_PROPS {
  videos: VideoProps[];
  nextPublishedBefore: string;
  nextTotalResults: number;
}

export const YOUTUBE_CATEGORY: Record<number, string> = {
  1: "Films",
  2: "Auto/Moto",
  10: "Musique",
  15: "Animaux",
  17: "Sport",
  18: "Courts métrages",
  19: "Voyages et événements",
  20: "Jeux vidéo",
  21: "Vlogs",
  22: "Personnes et blogs",
  23: "Humour",
  24: "Divertissement",
  25: "Actualités",
  26: "Mode et beauté",
  27: "Éducation",
  28: "Science et technologie",
  29: "Associatif",
  30: "Cinéma",
  31: "Animations",
  32: "Action/aventure",
  33: "Classiques",
  34: "Comédie",
  35: "Documentaire",
  36: "Drame",
  37: "Famille",
  38: "Étranger",
  39: "Horreur",
  40: "Sci-Fi/Fantasy",
  41: "Thriller",
  42: "Courts métrages",
  43: "Émissions",
  44: "Bandes-annonces",
};

export interface VideoProps {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  publishedAt: string;
}

export interface BlogPostProps {
  id: string;
  title: string;
  thumbnail: string;
  type?: string;
  publishedAt?: Date | string;
  description?: string;
  readTime?: number;
  extraLink?: string;
}
