export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface EntryData {
  name: string;
}

export interface TeamApiResponse extends ApiResponse<EntryData> {}
