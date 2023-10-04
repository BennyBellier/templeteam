/**
 * This file contains functions to get the data of the albums.
 * The data is stored in the folder "public/img/portfolio/photos".
 *
 * @description
 * structure of an album is :
  ```
 *  public
 * └── img
 *    └── portfolio
 *       └── photos
 *          └── albumName1
 *             ├── album.json
 *             ├── photo1.jpg
 *             ├── photo2.jpg
 *             └── ...
 *          └── albumName2
 *             ├── album.json
 *             ├── photo1.jpg
 *             ├── photo2.jpg
 *             └── ...
 *          └── ...
 * ```
 *
 * @description
 * structure of album.json is :
 * ```json
 * {
 *   "name": "Album Name",
 *   "date": "Thu, 1 Jan 1970 00:00:00 GMT",
 *   "thumbnail": "photo1.jpg",
 *   "description": "This is a description of the album."
 * }
 * ```
 */
import fs from "fs";
import path from "path";
import sizeOf from "image-size";
import { type AlbumsData } from "~/utils/types";

const photosDir = path.join(
  process.cwd(),
  "public",
  "img",
  "portfolio",
  "photos"
);

function readJsonAlbum(folderPath: string) {
  // Get the contents of album.json of the folder
  const json = fs.readFileSync(path.join(folderPath, "album.json"), "utf8");

  return JSON.parse(json) as {
    name: string;
    date: string;
    thumbnail: string;
    description: string;
  };
}

export function getSortedAlbumData(): AlbumsData[] {
  // Get files names under img/portfolio/photos/*
  const fileNames = fs
    .readdirSync(photosDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  const allAlbumData = fileNames
    .map((fileName) => {
      const albumJson = readJsonAlbum(path.join(photosDir, fileName));

      // Get informations about the thumbnail
      const img = sizeOf(path.join(photosDir, fileName, albumJson.thumbnail));

      return {
        albumName: albumJson.name,
        link: fileName,
        date: new Date(albumJson.date),
        thumbnail: {
          file: `/img/portfolio/photos/${fileName}/${albumJson.thumbnail}`,
          width: img.width!,
          height: img.height!,
        },
      };
    })
    .filter((albumData) => albumData.date <= new Date());

  return allAlbumData
    .sort((a, b) => {
      if (a.date && b.date) {
        if (a.date < b.date) return 1;
        else return -1;
      } else {
        return 0;
      }
    })
    .map((albumData) => {
      return {
        albumName: albumData.albumName,
        link: albumData.link,
        date: albumData.date.getFullYear(),
        thumbnail: albumData.thumbnail,
      };
    });
}

export function getAllAlbumNames() {
  // Get files names under img/portfolio/photos/*
  const albumNames = fs
    .readdirSync(photosDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  // Get the paths we want to pre-render based on posts
  return albumNames.map((albumName) => {
    return {
      params: {
        id: albumName,
      },
    };
  });
}

export function getAlbumData(albumName: string) {
  // Get files names under img/portfolio/photos/*
  const fullPath = path.join(photosDir, albumName);
  const fileNames = fs
    .readdirSync(fullPath)
    .filter((fileName) => fileName !== "album.json");
  const data = fileNames.map((fileName) => {
    // Get the dimensions of the image
    const img = sizeOf(path.join(photosDir, albumName, fileName));

    return {
      id: fileName.replace(/\.jpg$/, ""),
      src: `/img/portfolio/photos/${albumName}/${fileName}`,
      width: img.width!,
      height: img.height!,
    };
  });

  // Get the contents of album.json of albumName
  const albumJson = readJsonAlbum(fullPath);

  return {
    albumName: albumJson.name,
    date: new Date(albumJson.date).getFullYear(),
    description: albumJson.description,
    data,
  };
}
