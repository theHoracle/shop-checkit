export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
}

export interface SessionUser extends AuthUser {
  accessToken?: string;
  refreshToken?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface AuthResponse extends SessionUser {
  accessToken: string;
  refreshToken: string;
}

export interface LoginActionState {
  error?: string;
}
