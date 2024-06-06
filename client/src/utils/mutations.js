import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const CHANGE_EMAIL = gql`
  mutation changeEmail($email: String!) {
    changeEmail(email: $email) {
      _id
      username
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation changePassword($password: String!) {
    changePassword(password: $password) {
      _id
      username
    }
  }
`;
