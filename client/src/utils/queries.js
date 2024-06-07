import { gql } from '@apollo/client';

export const GET_USER = gql`
  query myProfile {
    myProfile {
      _id
      username
      email
    }
  }
`;

export const GET_ITEMS = gql`
  {
    stockShop {
      _id
      name
      effect
      image
    }
  }
`;
