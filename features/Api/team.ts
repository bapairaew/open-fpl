import { NextApiRequest } from "next";
import { getTeam as _getTeam } from "~/features/AppData/fpl";
import { TeamData } from "~/features/Api/apiTypes";

export const getTeam = async (req: NextApiRequest): Promise<TeamData> => {
  const id = typeof req.query.id === "string" ? req.query.id : req.query.id[0];
  const { name } = await _getTeam(+id);
  return { name };
};
