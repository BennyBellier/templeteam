import * as z from "zod";

export const BlogPostsModel = z.object({
  id: z.string().uuid(),
  title: z
    .string()
    .max(100, { message: "The title must be shorter than 100 characters" }),
  /**
   * Thumbnail of the blog ticket
   */
  thumbnail: z.string(),
  /**
   * Type of the post
   * @default {Article}
   */
  type: z.string().nullish(),
  /**
   * Date when the post has to be published or been published
   * @default {time when the database entry is created}
   */
  published: z.date().nullish(),
  /**
   * Short description of the blog ticket
   */
  description: z
    .string()
    .max(255, {
      message: "The description must be shorter than 256 characters",
    })
    .nullish(),
  /**
   * Time to take to read all the blog ticket
   */
  readTime: z.number().int().nullish(),
  /**
   * If the content of the blog ticket is on another website
   */
  extraLink: z.string().nullish(),
});
