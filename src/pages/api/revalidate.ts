import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // this should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    if (!req.query.path) return res.status(400).send("No path provided");
    await res.revalidate(req.query.path as string);
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send("Error revalidating");
  }
}
