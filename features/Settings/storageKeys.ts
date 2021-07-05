export const getActiveProfileKey = () => "active-profile";
export const getProfilesKey = () => "profiles";
export const getPreferenceKey = (teamId: string | null) =>
  `${teamId ?? ""}-preference`;
export const getTransferPlansKey = (teamId: string | null) =>
  `${teamId ?? ""}-transfer-plans`;
export const getTransferPlanKey = (
  teamId: string | null,
  planName: string | null
) => `${teamId ?? ""}-transfer-plan-${planName ?? ""}`;
export const getFixturesTeamsOrderKey = () => "fixtures-teams-order";
