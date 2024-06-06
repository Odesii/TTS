const { User, Item } = require('../models');
// import sign token function from auth
const { signToken, AuthenticationError } = require('../utils/auth');
const bcrypt = require('bcrypt');

const resolvers = {
  Query:{
    myProfile: async (parent, _, context) => {
      if(context.user) {
        const user = await User.findById({ _id: context.user._id }).populate('inventory');
        console.log('this is user', user);
        return user;
      } else {
        throw AuthenticationError;
      }
    },
    stockShop: async (parent, _, context) => {
      if(context.user) {
        const items = await Item.find();

        return items;
      } else {
        throw AuthenticationError;
      }
    }
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
    updateShrooms: async (parent, { shrooms }, context) => {
      const user = await User.findOneAndUpdate(
        { _id: context.user._id },
        { shrooms: shrooms },
        { new: true }
      );

      return user;
    },
    addToInventory: async (parent, { item }, context) => {
      const user = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $push: { inventory: item } },
        { new: true }
      );

      return user;
    },
    removeFromInventory: async (parent, { item }, context) => {
      const user = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { inventory: item } },
        { new: true }
      );

      return user;
    },
  }
}

module.exports=resolvers;
