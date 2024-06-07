const mongoose = require('mongoose');
const { User, Item } = require('../models');
// import sign token function from auth
const { signToken, AuthenticationError } = require('../utils/auth');
const bcrypt = require('bcrypt');

const resolvers = {
  Query:{
    myProfile: async (parent, _, context) => {
      console.log("context:", context);
      console.log("context user:", context.user)
      if(context.user) {
        const user = await User.findById({ _id: context.user._id }).populate('inventory');
        console.log('this is user', user);
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
      console.log('this is user', user);
      return user;
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
      console.log('userconsolelog', user);
      if (!user) {
        throw AuthenticationError;
      }
  
      const correctPw = await user.isCorrectPassword(password);
  
      if (!correctPw) {
        throw AuthenticationError;
      }
  
      const token = signToken(user);
      console.log('this is token', token);
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
    updateShrooms: async (parent, { shrooms, playerID }, context) => {
      const Player = await User.findOne(
        { _id: playerID }
      );
      const CurrentShrooms = Player.shrooms; 
      console.log('this is player', Player);
        const user = await User.findOneAndUpdate(
          { _id: playerID },
          { shrooms: shrooms + CurrentShrooms},
          { new: true }
        );
                return user; 
      // }
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
