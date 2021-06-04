import { getTeam } from "~/libs/fpl";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const team = await getTeam(req.query.id);
      res.status(200).json({ name: team.name });
    } else {
      res.status(405).json({ error: "Not allowed" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Unexpected error" });
  }
}
