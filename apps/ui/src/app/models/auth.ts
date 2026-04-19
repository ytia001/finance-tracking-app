/** Login credentials sent from the frontend to the backend */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Registration credentials sent from the frontend to the backend */
export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/** User profile returned in the login response */
export interface UserProfile {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

/** Full login response from the backend */
export interface LoginResponse {
  accessToken: string;
  user: UserProfile;
}

/** Registration response from the backend */
export interface RegisterResponse {
  id: number;
  email: string;
}
