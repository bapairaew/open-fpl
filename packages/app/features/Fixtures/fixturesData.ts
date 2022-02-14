import {
  FullTeamFixtures,
  TeamFixture,
} from "@open-fpl/app/features/Fixtures/fixturesDataTypes";
import {
  TeamInfo,
  TeamStrength,
} from "@open-fpl/app/features/TeamData/teamDataTypes";
import { TeamFixtures } from "@open-fpl/data/features/AppData/fixtureDataTypes";
import { Team } from "@open-fpl/data/features/AppData/teamDataTypes";

const getDifficulty = (strength: number, opponentStrength: number): number => {
  const diff = strength! - opponentStrength!;

  if (diff >= 150) return 1;
  if (diff >= 50) return 2;
  if (diff >= -50) return 3;
  if (diff >= -150) return 4;
  return 5;
};

const makeTeamInfo = (team: Team): TeamInfo => {
  return {
    name: team.name,
    short_name: team.short_name,
    strength_attack_home: team.strength_attack_home,
    strength_attack_away: team.strength_attack_away,
    strength_defence_home: team.strength_defence_home,
    strength_defence_away: team.strength_defence_away,
  };
};

export const adjustTeamsStrength = (
  teams: Team[],
  teamsStrength: TeamStrength[] | null
) => {
  if (teamsStrength && teamsStrength.length > 0) {
    return teams.map((team) => {
      const matched = teamsStrength.find((t) => t.id === team.id);
      if (matched) {
        return {
          ...team,
          ...matched,
        };
      } else {
        return team;
      }
    });
  } else {
    return teams;
  }
};

// Full mapped data for UI usage
export const makeFullFixtures = ({
  teamFixtures,
  teams,
  useCustomFDR,
}: {
  teamFixtures: TeamFixtures[];
  teams: Team[];
  useCustomFDR: boolean | null;
}): FullTeamFixtures[] => {
  const fullFixtures = [] as FullTeamFixtures[];

  for (const team of teamFixtures) {
    const fplTeam = teams.find((t) => t.id === team.id);
    if (fplTeam) {
      const fullFixture = {
        name: fplTeam.name,
        short_name: fplTeam.short_name,
        strength_attack_home: fplTeam.strength_attack_home,
        strength_attack_away: fplTeam.strength_attack_away,
        strength_defence_home: fplTeam.strength_defence_home,
        strength_defence_away: fplTeam.strength_defence_away,
        gameweeks: [] as TeamFixture[][],
      } as FullTeamFixtures;

      for (const fixture of team.fixtures) {
        const opponent = teams.find((t) => t.id === fixture.opponent_team);
        if (opponent) {
          const teamFixture = {
            event: fixture.event,
            is_finished: false,
            is_home: fixture.is_home,
            attack_difficulty: fixture.is_home
              ? useCustomFDR
                ? getDifficulty(
                    fplTeam.strength_attack_home,
                    opponent.strength_defence_away
                  )
                : fixture.team_h_difficulty
              : useCustomFDR
              ? getDifficulty(
                  fplTeam.strength_attack_away,
                  opponent.strength_defence_home
                )
              : fixture.team_a_difficulty,
            defence_difficulty: fixture.is_home
              ? useCustomFDR
                ? getDifficulty(
                    fplTeam.strength_defence_home,
                    opponent.strength_attack_away
                  )
                : fixture.team_h_difficulty
              : useCustomFDR
              ? getDifficulty(
                  fplTeam.strength_defence_away,
                  opponent.strength_attack_home
                )
              : fixture.team_a_difficulty,
            opponent: makeTeamInfo(opponent),
          } as TeamFixture;

          fullFixture.gameweeks[fixture.event] = fullFixture.gameweeks[
            fixture.event
          ]
            ? [...fullFixture.gameweeks[fixture.event], teamFixture]
            : [teamFixture];
        }
      }

      fullFixtures.push(fullFixture);
    }
  }

  return fullFixtures;
};
