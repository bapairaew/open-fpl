export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface AppEntry {
  name: string;
  summary_overall_points: number;
  summary_event_points: number;
}
export interface EntryApiResponse extends ApiResponse<AppEntry> {}

export interface AppEntryEventPick {
  element: number;
  multiplier: number;
  position: number;
}
export interface EntryEventPickApiResponse
  extends ApiResponse<AppEntryEventPick[]> {}

export interface AppLive {
  elements: {
    id: number;
    bps: number;
    goals_scored: number;
    assists: number;
    yellow_cards: number;
    red_cards: number;
    bonus: number;
    total_points: number;
    minutes: number;
  }[];
}
export interface LiveApiResponse extends ApiResponse<AppLive> {}

export interface AppFixture {
  event: number;
  finished: boolean;
  finished_provisional: boolean;
  id: number;
  kickoff_time: string;
  minutes: number;
  started: boolean;
  team_a: number;
  team_a_score: number | null;
  team_h: number;
  team_h_score: number | null;
}
export interface FixtureeApiResponse extends ApiResponse<AppFixture[]> {}
