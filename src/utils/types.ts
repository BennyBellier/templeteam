export interface ReferenceProps {
  name: string;
  href: string;
  logo: string;
  alt: string;
}

export interface VideoProps {
  link: string;
  thumbnail: string;
  title: string;
  type: string;
  width: number;
  height: number;
}

export interface PhotoProps {
  img: string;
  title: string;
  width: number;
  height: number;
}

export interface AlbumsData {
  albumName: string;
  link: string
  date: number;
  thumbnail: { file: string; width: number; height: number };
}

export interface AlbumProps {
  albumName: string;
  date: number;
  description: string;
  data: { id: string; src: string; width: number; height: number }[];
}