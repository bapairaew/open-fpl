export const getActiveProfileKey = () => "active-profile";
export const getProfilesKey = () => "profiles";
export const getPreferenceKey = (teamId: string) => `${teamId}-preference`;
export const getTeamPlanKey = (teamId: string, planName: string) =>
  `${teamId}-team-plan-${planName}`;
export const getFixturesTeamsOrderKey = () => "fixtures-teams-order";
export const getCustomPlayersKey = () => "custom-players";
export const getTeamsStrengthKey = () => "teams-strength";
export const getTeamPlannerPinnedBenchKey = () => "team-planner-pinned-bench";
export const getPlayersExplorerDisplayOptionKey = () =>
  "players-explorer-display-option";
export const getPlayersExplorerSortOptionKey = () =>
  "players-explorer-sort-option";
export const getPlayersExplorerTableSortColumnsKey = () =>
  "players-explorer-table-sort-columns";

/**
 * @deprecated This key is no longer used. Team plans are moved to perference.
 */
export const getTeamPlansKey = (teamId: string) => `${teamId ?? ""}-team-plans`;
/**
 * @deprecated This key is no longer used. Team plans are moved to perference.
 */
export const getStarredPlayersKey = (teamId: string) =>
  `${teamId ?? ""}-starred-players`;
