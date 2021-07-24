export type AnalyticsPlayerStatisticsExplorer = {
  "players-query": {
    query: string;
  };
  "players-display": {
    display: string;
  };
  "players-sort": {
    sort: string;
  };
  "players-columns-sort": {
    columns: string[];
  };
  "players-starred-players-add": never;
  "players-starred-players-remove": never;
  "players-compare-players": {
    count: number;
  };
};

export type AnalyticsTeamPlanner = {
  "team-planner-plans-add": never;
  "team-planner-plans-duplicate": never;
  "team-planner-plans-rename": never;
  "team-planner-plans-remove": never;
  "team-planner-plans-rearrange": never;
  "team-planner-toolbar-navigate": {
    gameweek: number;
  };
  "team-planner-use-chip": {
    chip: string;
  };
  "team-planner-set-captain": never;
  "team-planner-set-vice-captain": never;
  "team-planner-changelog-navigate": {
    gameweek: number;
  };
  "team-planner-changelog-remove": never;
  "team-planner-changelog-open-summary": never;
  "team-planner-pinned-bench": {
    pinned: boolean;
  };
};

export type AnalyticsCustomPlayer = {
  "custom-players-add": never;
  "custom-players-remove": never;
  "custom-players-update": never;
};

export type AnalyticsSettings = {
  "settings-profile-add": never;
  "settings-profile-remove": never;
  "settings-profile-select": never;
};

export type AnalyticsFixtureDifficultyRating = {
  "fixtures-adjust-team-strengths": never;
  "fixtures-mode-change": {
    mode: string;
  };
  "fixtures-rearrange": never;
  "fixtures-column-sort": never;
  "fixtures-multi-columns-sort": {
    length: number;
  };
};
