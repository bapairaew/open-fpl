import { NextApiRequest, NextApiResponse } from "next";
import { getLiveEvent } from "@open-fpl/app/features/Api/live";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      res.status(200).json({ data: await getLiveEvent(req) });
    } else {
      res.status(405).json({ error: "Not allowed" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Unexpected error" });
  }
}
