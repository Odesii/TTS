const typeDefs =`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    shrooms: Int
    inventory: [Item]
  }

  type Item {
    _id: ID!
    name: String!
    effect: String!
    image: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    myProfile: User
    stockShop: [Item]
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    changeEmail(email: String!): User
    changePassword(password: String!): User
    deleteAccount(_id: ID!): User
    updateShrooms(shrooms: Int!): User
    addToInventory(itemId: ID!): User
    removeFromInventory(itemId: ID!): User
  }
`;

module.exports = typeDefs;
