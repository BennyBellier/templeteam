import type { NextApiRequest, NextApiResponse } from "next";
import { api } from "~/utils/api";

export function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = api.blog.getSortedPostsDataByType.useQuery({ type: req.query.type![0] ?? "All" });
  res.status(200).json(data);
}
