import { NextApiRequest } from "next";
import { EntryData } from "@open-fpl/app/features/Api/apiTypes";
import { getEntry as _getEntry } from "@open-fpl/data/features/RemoteData/fpl";

export const getEntry = async (req: NextApiRequest): Promise<EntryData> => {
  const id = typeof req.query.id === "string" ? req.query.id : req.query.id[0];
  const { name } = await _getEntry(+id);
  return { name };
};
