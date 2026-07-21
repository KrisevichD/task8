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
