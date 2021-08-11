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
}
export interface AppEntryEventPickApiResponse
  extends ApiResponse<AppEntryEventPick> {}

export interface AppLive {
  elements: {
    id: number;
    bps: number;
    goals_scored: number;
    assists: number;
    yellow_cards: number;
    red_cards: number;
    bonus: number;
  }[];
}
export interface LiveApiResponse extends ApiResponse<AppEntry> {}
