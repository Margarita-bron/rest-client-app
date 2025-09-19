export type RequestAnalytic = {
  userId?: string;
  method: string;
  url: string;
  headers: Record<string, string | boolean>;
  body?: string;
  requestSize: number;
  responseSize: number;
  duration: number;
  statusCode: number;
  createdAt: number;
  errorMessage: string | null;
};

type RequestAnalyticWithId = Partial<RequestAnalytic> & { id: string };
export type UserRequestHistory = RequestAnalyticWithId[];
