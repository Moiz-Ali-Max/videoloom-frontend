export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface SignupMessageResponse {
  message: string;
}

/** POST /auth/signup returns tokens immediately if Supabase email confirmation is off,
 *  otherwise a { message } telling the user to check their inbox. */
export type SignupResponse = TokenResponse | SignupMessageResponse;

export interface UserInfo {
  id: string;
  email: string;
}

export function isTokenResponse(res: SignupResponse): res is TokenResponse {
  return "access_token" in res;
}
