export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface AppEntry {
  name: string;
}
export interface EntryApiResponse extends ApiResponse<AppEntry> {}

export interface AppLive {
  elements: {
    id: number;
    stats: {
      bps: number;
    };
  }[];
}
export interface LiveApiResponse extends ApiResponse<AppEntry> {}
