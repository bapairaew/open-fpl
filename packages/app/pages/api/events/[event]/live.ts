import { NextApiRequest, NextApiResponse } from "next";
import { getLiveEvent } from "@open-fpl/app/features/Api/live";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const event =
        typeof req.query.event === "string"
          ? req.query.event
          : req.query.event[0];
      const fixtures = (
        typeof req.query.fixtures === "string"
          ? req.query.fixtures.split(",")
          : req.query.fixtures?.[0].split(",") ?? []
      ).map((f) => +f);
      res.status(200).json({ data: await getLiveEvent(+event, fixtures) });
    } else {
      res.status(405).json({ error: "Not allowed" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Unexpected error" });
  }
}
