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

export const DELETE_ACCOUNT = gql`
  mutation deleteAccount($_id: ID!) {
    deleteAccount(_id: $_id) {
      _id
      username
    }
  }
`;

export const UPDATE_SHROOMS = gql`
  mutation updateShrooms($shrooms: Int!, $playerId: ID) {
    updateShrooms(shrooms: $shrooms, playerId: $playerId) {
      _id
      shrooms
    }
  }
`;

export const CALCULATE_TOTAL_SHROOMS = gql`
  mutation calculateTotalShrooms($shrooms: Int!, $playerId: ID) {
    calculateTotalShrooms(shrooms: $shrooms, playerId: $playerId) {
      _id
      totalShrooms
    }
  }
`;

export const ADD_TO_INVENTORY = gql`
  mutation addToInventory($itemId: ID!) {
    addToInventory(itemId: $itemId) {
      inventory {
        _id
      }
    }
  }
`;

export const REMOVE_FROM_INVENTORY = gql`
  mutation removeFromInventory($itemId: ID!, $playerId: ID) {
    removeFromInventory(itemId: $itemId, playerId: $playerId) {
      inventory {
        _id
      }
    }
  }
`;
