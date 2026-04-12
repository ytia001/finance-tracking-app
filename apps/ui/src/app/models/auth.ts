/** Login credentials sent from the frontend to the backend */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** User profile returned in the login response */
export interface UserProfile {
  userId: number;
  email: string;
  roles: string[];
}

/** Full login response from the backend */
export interface LoginResponse {
  accessToken: string;
  user: UserProfile;
}
