import {
  FullTeamFixtures,
  TeamFixture,
} from "@open-fpl/app/features/Fixtures/fixturesDataTypes";
import {
  TeamInfo,
  TeamStrength,
} from "@open-fpl/app/features/TeamData/teamDataTypes";
import { TeamFixtures } from "@open-fpl/data/features/AppData/appDataTypes";
import { Team } from "@open-fpl/data/features/RemoteData/fplTypes";

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
  fplTeams: Team[],
  teamsStrength: TeamStrength[] | null
) => {
  if (teamsStrength && teamsStrength.length > 0) {
    return fplTeams.map((team) => {
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
    return fplTeams;
  }
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
        name: fplTeam.name,
        short_name: fplTeam.short_name,
        strength_attack_home: fplTeam.strength_attack_home,
        strength_attack_away: fplTeam.strength_attack_away,
        strength_defence_home: fplTeam.strength_defence_home,
        strength_defence_away: fplTeam.strength_defence_away,
        gameweeks: [] as TeamFixture[][],
      } as FullTeamFixtures;

      for (const history of team.history) {
        const opponent = fplTeams.find((t) => t.id === history.opponent_team);
        if (opponent) {
          const teamFixture = {
            id: history.fixture,
            event: history.round,
            is_finished: true,
            is_home: history.was_home,
            attack_difficulty: history.was_home
              ? getDifficulty(
                  fplTeam.strength_attack_home,
                  opponent.strength_defence_away
                )
              : getDifficulty(
                  fplTeam.strength_attack_away,
                  opponent.strength_defence_home
                ),
            defence_difficulty: history.was_home
              ? getDifficulty(
                  fplTeam.strength_defence_home,
                  opponent.strength_attack_away
                )
              : getDifficulty(
                  fplTeam.strength_defence_away,
                  opponent.strength_attack_home
                ),
            opponent: makeTeamInfo(opponent),
          } as TeamFixture;

          fullFixture.gameweeks[history.round] = fullFixture.gameweeks[
            history.round
          ]
            ? [...fullFixture.gameweeks[history.round], teamFixture]
            : [teamFixture];
        }
      }

      for (const fixture of team.fixtures) {
        const opponent = fplTeams.find(
          (t) => t.id === (fixture.is_home ? fixture.team_a : fixture.team_h)
        );
        if (opponent) {
          const teamFixture = {
            id: fixture.id,
            event: fixture.event,
            is_finished: false,
            is_home: fixture.is_home,
            attack_difficulty: fixture.is_home
              ? getDifficulty(
                  fplTeam.strength_attack_home,
                  opponent.strength_defence_away
                )
              : getDifficulty(
                  fplTeam.strength_attack_away,
                  opponent.strength_defence_home
                ),
            defence_difficulty: fixture.is_home
              ? getDifficulty(
                  fplTeam.strength_defence_home,
                  opponent.strength_attack_away
                )
              : getDifficulty(
                  fplTeam.strength_defence_away,
                  opponent.strength_attack_home
                ),
            opponent: makeTeamInfo(opponent),
          } as TeamFixture;

          if (
            !fullFixture.gameweeks[fixture.event]?.some(
              (f) => f.id === teamFixture.id
            )
          ) {
            fullFixture.gameweeks[fixture.event] = fullFixture.gameweeks[
              fixture.event
            ]
              ? [...fullFixture.gameweeks[fixture.event], teamFixture]
              : [teamFixture];
          }
        }
      }

      fullFixtures.push(fullFixture);
    }
  }

  return fullFixtures;
};
