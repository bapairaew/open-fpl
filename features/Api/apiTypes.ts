export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface TeamData {
  name: string;
}

export interface TeamApiResponse extends ApiResponse<TeamData> {}
