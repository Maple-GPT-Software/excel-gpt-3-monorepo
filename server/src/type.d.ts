// Authenticated request type
export interface AuthenticatedRequest extends Request {
    headers: {
      authorization?: string;
    }
    authToken?: string | null;
    userId?: string | null;
  }