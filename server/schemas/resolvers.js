const mongoose = require('mongoose');
const { User, Item } = require('../models');
// import sign token function from auth
const { signToken, AuthenticationError } = require('../utils/auth');
const bcrypt = require('bcrypt');

const resolvers = {
  Query:{
    myProfile: async (parent, _, context) => {
      if(context.user) {
        const user = await User.findById({ _id: context.user._id }).populate('inventory');
        return user;
      } else {
        throw AuthenticationError;
      }
    },
    stockShop: async (parent, _, context) => {
      const items = await Item.find();
      return items;
    },
    getPlayer: async (parent, { playerId }, context) => {
      const user = await User.findById({ _id: playerId }).populate('inventory');
      return user;
    },
    getAllPlayers: async (parent, _, context) => {
      const users = await User.find().sort({ totalShrooms: -1, username: 1 });
      return users;
    },
    getUserShrooms: async (parent, { userId }) => {
      const user = await User.findById(userId);
      return user ? user.shrooms : 0;
    },
  },
  Mutation:{
    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }
  
      const correctPw = await user.isCorrectPassword(password);
  
      if (!correctPw) {
        throw AuthenticationError;
      }
  
      const token = signToken(user);
      return { token, user };
    },
    changeEmail: async (parent, { email }, context) => {
      if(context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { email: email },
          { new: true }
        );

        return user;
      }

      throw AuthenticationError;
    },
    changePassword: async (parent, { password }, context) => {
      const saltRounds = 10;
      const user = await User.findOneAndUpdate(
        { _id: context.user._id },
        { password: await bcrypt.hash(password, saltRounds) },
        { new: true }
      );

      return user;
    },
    deleteAccount: async (parent, { _id }, context) => {
      const user = await User.findOneAndDelete({ _id: context.user._id });

      return user;
    },
    updateShrooms: async (parent, { shrooms, playerId }, context) => {
      const player = await User.findOne(
        { _id: playerId }
      );

      const currentShrooms = player.shrooms; 
      
      const user = await User.findOneAndUpdate(
        { _id: playerId },
        { shrooms: shrooms + currentShrooms},
        { new: true }
      );
      return user; 
    },
    calculateTotalShrooms: async (parent, { shrooms, playerId }, context) => {
      const player = await User.findOne(
        { _id: playerId }
      );

      const currentShrooms = player.totalShrooms; 
      
      const user = await User.findOneAndUpdate(
        { _id: playerId },
        { totalShrooms: shrooms + currentShrooms},
        { new: true }
      );
      return user; 
    },
    addToInventory: async (parent, { itemId }, context) => {
      const item = await Item.findById(itemId);
      
      const user = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $push: { inventory: item } },
        { new: true }
      );

      return user;
    },
    removeFromInventory: async (parent, { itemId, playerId }, context) => {
      // const item = await Item.findById(itemId);
      // console.log(item);
      let index = 0;

      const user = await User.findOne({ _id: playerId });

      for (let i = 0; i < user.inventory.length; i++) {
        if (user.inventory[i]._id.toString() === itemId) {
          index = i;
        }
      }

      const inventoryData = user.inventory.filter((item, i) => i !== index);

      const userData = await User.findOneAndUpdate(
        { _id: playerId },
        { inventory: inventoryData },
        { new: true }
      );

      return user;
    },
  }
}

module.exports=resolvers;
