export const getActiveProfileKey = () => "active-profile";
export const getProfilesKey = () => "profiles";
export const getPreferenceKey = (teamId: string | null | undefined) =>
  `${teamId ?? ""}-preference`;
export const getTransferPlanKey = (teamId: string | null | undefined) =>
  `${teamId ?? ""}-transfer-plan`;

export const getTeamIdKey = () => "teamId";
export const getTransferPlannerPinnedBenchKey = () =>
  "transferPlannerPinnedBench";
