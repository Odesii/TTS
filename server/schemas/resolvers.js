const { User } = require('../models');
// import sign token function from auth
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers={
  Query:{
      myProfile: async (parent, _,context) => {
        if(context.user){
          const user= await User.findById({_id: context.user._id});
          console.log('this is user',user)
          return user
        }else{
          throw AuthenticationError;
        }
      }
  },
  Mutation:{
      createUser: async (parent,{username,email,password})=>{
          const user=await User.create({username,email,password});
          const token=signToken(user);
          return{ token,user};
      },
      login: async (parent, {email, password }) => {
          const user = await User.findOne( {email} );
          console.log('userconsolelog', user)
          if (!user) {
          throw AuthenticationError;
          }
  
          const correctPw = await user.isCorrectPassword(password);
  
          if (!correctPw) {
              throw AuthenticationError;
          }
  
          const token = signToken(user);
            console.log('this is token',token)
          return { token, user };
      },
    }
  }

module.exports=resolvers;
