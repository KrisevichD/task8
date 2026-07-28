import { gql } from "@apollo/client";

export const SIGN_IN_QUERY = gql`
  query SignIn($auth: AuthInput!) {
    login(auth: $auth) {
      access_token
      refresh_token
      user {
        id
        email
        role
      }
    }
  }
`;

export const SIGN_UP_MUTATION = gql`
  mutation SignUp($auth: AuthInput!) {
    signup(auth: $auth) {
      access_token
      refresh_token
      user {
        id
        email
      }
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($auth: ForgotPasswordInput!) {
    forgotPassword(auth: $auth)
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refresh_token: $refreshToken) {
      access_token
      refresh_token
    }
  }
`;
