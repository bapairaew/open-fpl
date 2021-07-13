import { NextApiRequest } from "next";
import { TeamData } from "~/features/Api/apiTypes";
import { getTeam as _getTeam } from "~/features/RemoteData/fpl";

export const getTeam = async (req: NextApiRequest): Promise<TeamData> => {
  const id = typeof req.query.id === "string" ? req.query.id : req.query.id[0];
  const { name } = await _getTeam(+id);
  return { name };
};
