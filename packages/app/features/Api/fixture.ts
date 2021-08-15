import { AppFixture } from "@open-fpl/app/features/Api/apiTypes";
import { getFixtures as _getFixtures } from "@open-fpl/data/features/RemoteData/fpl";

export const getFixtures = async (event: number): Promise<AppFixture[]> => {
  const fixtures = await _getFixtures(event);
  return fixtures.map((fixture) => ({
    event: fixture.event,
    finished: fixture.finished,
    finished_provisional: fixture.finished_provisional,
    id: fixture.id,
    kickoff_time: fixture.kickoff_time,
    minutes: fixture.minutes,
    started: fixture.started,
    team_a: fixture.team_a,
    team_a_score: fixture.team_a_score,
    team_h: fixture.team_h,
    team_h_score: fixture.team_h_score,
  }));
};
