// Structure for auth tokens returned from backend
export interface IAuthTokens {
  access_token: string;
  refresh_token: string;
}

// Strictly types the response for the Login query
export interface ILoginResponse {
  login: IAuthTokens;
}

// Strictly types the response for the Signup mutation
export interface ISignupResponse {
  signup: IAuthTokens;
}
