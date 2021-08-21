import { getEntry } from "@open-fpl/app/features/Api/entry";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const id =
        typeof req.query.id === "string" ? req.query.id : req.query.id[0];

      const response = await getEntry(+id);
      if (typeof response === "string") {
        res.status(500).json(response);
      } else {
        res.status(200).json({ data: response });
      }
    } else {
      res.status(405).json({ error: "Not allowed" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Unexpected error" });
  }
}
