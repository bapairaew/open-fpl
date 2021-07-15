import { makePlaceholderFullChangePlayerFromPosition } from "~/features/TeamPlanner/placeholderPlayer";
import {
  FullChangePlayer,
  GroupedTeam,
} from "~/features/TeamPlanner/teamPlannerTypes";

// NOTE: this function mutate teamObject
const addPlayerToGroup = (
  player: FullChangePlayer,
  teamObject: GroupedTeam
) => {
  const { GKP, DEF, MID, FWD, bench } = teamObject;
  if (player.pick.position <= 11) {
    switch (player.element_type.singular_name_short) {
      case "GKP":
        GKP.push(player);
        break;
      case "DEF":
        DEF.push(player);
        break;
      case "MID":
        MID.push(player);
        break;
      case "FWD":
        FWD.push(player);
        break;
    }
  } else {
    bench.push(player);
  }
};

export const makeTeamGroupObject = (team: FullChangePlayer[]): GroupedTeam => {
  const GKP: FullChangePlayer[] = [];
  const DEF: FullChangePlayer[] = [];
  const MID: FullChangePlayer[] = [];
  const FWD: FullChangePlayer[] = [];
  const bench: FullChangePlayer[] = [];

  for (let i = 1; i <= 15; i++) {
    const player =
      team.find((player) => player.pick.position === i) ??
      makePlaceholderFullChangePlayerFromPosition(i);

    addPlayerToGroup(player, { GKP, DEF, MID, FWD, bench });
  }

  return {
    GKP,
    DEF,
    MID,
    FWD,
    bench,
  };
};
