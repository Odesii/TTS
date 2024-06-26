const typeDefs =`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    shrooms: Int
    totalShrooms: Int
    inventory: [Item]
  }
  
  type Item {
    _id: ID!
    name: String!
    cost: Int!
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
    getPlayer(playerId: ID!): User
    getAllPlayers: [User]
    getUserShrooms(userId: ID!): Int
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    changeEmail(email: String!): User
    changePassword(password: String!): User
    deleteAccount(_id: ID!): User
    updateShrooms(shrooms: Int!, playerId: ID): User
    calculateTotalShrooms(shrooms: Int!, playerId: ID): User
    addToInventory(itemId: ID!): User
    removeFromInventory(itemId: ID!, playerId: ID): User
  }
`;

module.exports = typeDefs;
