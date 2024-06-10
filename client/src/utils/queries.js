import { gql } from '@apollo/client';

export const GET_USER = gql`
  query myProfile {
    myProfile {
      _id
      username
      email
      shrooms
      inventory {
        _id
      }
    }
  }
`;

export const GET_ITEMS = gql`
  {
    stockShop {
      _id
      name
      cost
      effect
      image
    }
  }
`;

export const GET_PLAYER = gql`
  query getPlayer($playerId: ID!) {
    getPlayer(playerId: $playerId) {
      _id
      username
      email
      shrooms
      inventory {
        _id
      }
    }
  }
`;

export const GET_ALL_PLAYERS = gql`
  {
    getAllPlayers {
      _id
      username
      email
      shrooms
      totalShrooms
    }
  }
`;

export const GET_USER_SHROOMS = gql`
  query getUserShrooms($userId: ID!) {
    getUserShrooms(userId: $userId)
  }
`;
