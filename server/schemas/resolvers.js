const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
/*** QUERIES */
  Query: {
    // Get a single user by ID or username
    me: async (parent, args, context) => {
      
        if (context.user) {
          const user = await User.findOne({
            _id: context.user._id,
          })
          .select('-__v -password');

          return user
        } 
        throw new AuthenticationError('You need to be logged in!');
    },
  },

/*** MUTATIONS */
  Mutation: {
    // Create a new user
    addUser: async (parent, args) => {
        const user = await User.create(args);

        const token = signToken(user);

        return { token, user };
    },
    // Logs in a user
    login: async (parent, args) => {
      try {
        const { username, email, password } = args;
        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (!user) {
          throw new Error("User not found");
        }

        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
          throw new Error('Incorrect password');
        }

        const token = signToken(user);

        return { token, user };
      } catch (err) {
        throw new Error(err.message);
      }
    },
    // Saves book to a user's `savedBooks`
    saveBook: async (parent, args, context) => {
      
    },

    // Deletes book from a user's `savedBooks`
    removeBook: async (parent, args, context) => {
      
    }
  },
};

module.exports = resolvers;
