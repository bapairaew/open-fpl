export const getActiveProfileKey = () => "active-profile";
export const getProfilesKey = () => "profiles";
export const getPreferenceKey = (teamId: string | null) =>
  `${teamId ?? ""}-preference`;
export const getTeamPlansKey = (teamId: string | null) =>
  `${teamId ?? ""}-team-plans`;
export const getStarredPlayersKey = (teamId: string | null) =>
  `${teamId ?? ""}-starred-players`;
export const getTeamPlanKey = (
  teamId: string | null,
  planName: string | null
) => `${teamId ?? ""}-team-plan-${planName ?? ""}`;
export const getFixturesTeamsOrderKey = () => "fixtures-teams-order";
export const getCustomPlayersKey = () => "custom-players";
