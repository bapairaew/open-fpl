import { NextApiRequest, NextApiResponse } from "next";
import { getFixtures } from "@open-fpl/app/features/Api/fixture";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const event =
        typeof req.query.id === "string" ? req.query.event : req.query.event[0];
      res.status(200).json({ data: await getFixtures(+event) });
    } else {
      res.status(405).json({ error: "Not allowed" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Unexpected error" });
  }
}
