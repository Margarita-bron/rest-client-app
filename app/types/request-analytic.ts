export type RequestAnalytic = {
  method: string;
  url: string;
  headers: Record<string, string | boolean>;
  body?: string;
  duration: number;
  statusCode: number;
  createdAt: number;
  errorMessage?: string;
};
