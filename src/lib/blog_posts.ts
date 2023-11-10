import { api } from "~/utils/api";

// TODO: implement getSortedPostsDataByType function with api.blog
export function getSortedPostsDataByType(type: string) {
  return api.blog.getSortedPostsDataByType.useQuery({ type });
}

// TODO: implement getPostData function with api.blog


// TODO: implement getAllPostsId function with api.blog
export function getAllPostsId() {
  return api.blog.getAllPostsId.useQuery();
}