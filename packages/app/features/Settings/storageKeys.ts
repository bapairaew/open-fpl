export const getActiveProfileKey = () => "active-profile";
export const getProfilesKey = () => "profiles";
export const getPreferenceKey = (profile: string) => `${profile}-preference`;
export const getTeamPlanKey = (profile: string, planName: string) =>
  `${profile}-team-plan-${planName}`;
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
export const getIsAppDomainMigratedKey = () => "is-app-domain-migrated";

/**
 * @deprecated This key is no longer used. Team plans are moved to perference.
 */
export const getTeamPlansKey = (profile: string) =>
  `${profile ?? ""}-team-plans`;
/**
 * @deprecated This key is no longer used. Team plans are moved to perference.
 */
export const getStarredPlayersKey = (profile: string) =>
  `${profile ?? ""}-starred-players`;
