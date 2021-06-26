import { FPLElement } from "~/features/AppData/appDataTypes";
import { Team } from "~/features/AppData/fplTypes";
import { isNullOrUndefined } from "~/features/Common/utils";
import {
  FullTeamFixtures,
  TeamFixture,
  TeamFixtures,
} from "~/features/Fixtures/fixturesDataTypes";

export const makeTeamFixtures = ({
  fplElements,
  fplTeams,
}: {
  fplElements: FPLElement[];
  fplTeams: Team[];
}): TeamFixtures[] => {
  const teamFixtures = [] as TeamFixtures[];

  for (const fplTeam of fplTeams) {
    const fplElement = fplElements.find((f) => f.team === fplTeam.id);
    if (fplElement) {
      const { team, fixtures, history } = fplElement;
      teamFixtures.push({
        id: team,
        history,
        fixtures,
      });
    }
  }

  return teamFixtures;
};

const getDifficulty = (
  strength: number | null | undefined,
  opponentStrength: number | null | undefined
): number | null => {
  if (isNullOrUndefined(strength) || isNullOrUndefined(opponentStrength))
    return null;

  const diff = strength! - opponentStrength!;

  if (diff >= 300) return 1;
  if (diff >= 100) return 2;
  if (diff >= 0) return 3;
  if (diff >= -150) return 4;
  return 5;
};

// Full mapped data for UI usage
export const makeFullFixtures = ({
  teamFixtures,
  fplTeams,
}: {
  teamFixtures: TeamFixtures[];
  fplTeams: Team[];
}): FullTeamFixtures[] => {
  const fullFixtures = [] as FullTeamFixtures[];

  for (const team of teamFixtures) {
    const fplTeam = fplTeams.find((t) => t.id === team.id);
    if (fplTeam) {
      const fullFixture = {
        short_name: fplTeam.short_name || "",
        fixtures: [] as TeamFixture[],
      } as FullTeamFixtures;

      for (const history of team.history) {
        const opponent = fplTeams.find((t) => t.id === history.opponent_team);
        fullFixture.fixtures.push({
          is_finished: true,
          opponent_short_name: opponent?.short_name || "",
          is_home: history.was_home,
          attack_difficulty: history.was_home
            ? getDifficulty(
                fplTeam.strength_attack_home,
                opponent?.strength_defence_away
              )
            : getDifficulty(
                fplTeam.strength_attack_away,
                opponent?.strength_defence_home
              ),
          defence_difficulty: history.was_home
            ? getDifficulty(
                fplTeam.strength_defence_home,
                opponent?.strength_attack_away
              )
            : getDifficulty(
                fplTeam.strength_defence_away,
                opponent?.strength_attack_home
              ),
        });
      }

      for (const fixture of team.fixtures) {
        const opponent = fplTeams.find(
          (t) => t.id === (fixture.is_home ? fixture.team_a : fixture.team_h)
        );
        fullFixture.fixtures.push({
          is_finished: false,
          opponent_short_name: opponent?.short_name || "",
          is_home: fixture.is_home,
          attack_difficulty: fixture.is_home
            ? getDifficulty(
                fplTeam.strength_attack_home,
                opponent?.strength_defence_away
              )
            : getDifficulty(
                fplTeam.strength_attack_away,
                opponent?.strength_defence_home
              ),
          defence_difficulty: fixture.is_home
            ? getDifficulty(
                fplTeam.strength_defence_home,
                opponent?.strength_attack_away
              )
            : getDifficulty(
                fplTeam.strength_defence_away,
                opponent?.strength_attack_home
              ),
        });
      }

      fullFixtures.push(fullFixture);
    }
  }

  return fullFixtures;
};
