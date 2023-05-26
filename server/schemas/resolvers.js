const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
/*** QUERIES */
  Query: {
    // Get a single user by ID or username
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne(
          { _id: context.user._id },
          { __v: 0, password: 0 }
        );
      } 
      throw new AuthenticationError('You need to log in...');
    },
  },

/*** MUTATIONS */
  Mutation: {
    // Create a new user
    addUser: async (parent, args) => {
        const user = await User.create(args);

        //* console.log(user);
        const token = signToken(user);
        
        //* console.log({input});
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

        const correctPass = await user.isCorrectPassword(password);

        if (!correctPass) {
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
      const { book } = args;
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      ).populate('savedBooks');

        return updatedUser;
    },  

    // Deletes book from a user's `savedBooks`
    removeBook: async (parent, args, context) => {
      // TDO: Implement book removal logic
      const { bookId } = args;
      const { user } = context;
    
      try {
        // Find the logged-in user based on the context
        const foundUser = await User.findById(user._id);
  
        if (!foundUser) {
          throw new AuthenticationError('User not found');
        }
    
        foundUser.savedBooks = foundUser.savedBooks.filter(
          (book) => book.bookId !== bookId
        );
    
        await foundUser.save();
    
        return foundUser;
      } catch (err) {
        throw new ApolloError('Failed to remove book', 'INTERNAL_SERVER_ERROR');
      }
    }


  },
};

module.exports = resolvers;
