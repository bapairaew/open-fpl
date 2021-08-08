import { NextApiRequest, NextApiResponse } from "next";
import { getEntry } from "@open-fpl/app/features/Api/entry";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      res.status(200).json({ data: await getEntry(req) });
    } else {
      res.status(405).json({ error: "Not allowed" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Unexpected error" });
  }
}
