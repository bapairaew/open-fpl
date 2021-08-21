export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface ApiEntry {
  name: string;
  summary_overall_points: number;
  summary_event_points: number;
  summary_overall_rank: number;
}
export interface EntryApiResponse extends ApiResponse<ApiEntry> {}

// NOTE: this saves very little space, should just use EntryEventPick?
export interface ApiEntryEventPick {
  element: number;
  multiplier: number;
  position: number;
}
export interface EntryEventPickApiResponse
  extends ApiResponse<ApiEntryEventPick[]> {}

export interface ApiEntryHistory {
  current: {
    overall_rank: number;
    total_points: number;
  }[];
}
export interface EntryHistoryApiResponse extends ApiResponse<ApiEntryHistory> {}
