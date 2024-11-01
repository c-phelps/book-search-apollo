const { User, Book } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    // replace get singleuser from user-controllers
    me: async (parent, args, { user }) => {
      if (user) {
        return User.findOne({ _id: user._id });
      }
      throw AuthenticationError;
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }
      const passwordMatch = await user.isCorrectPassword(password);
      if (!passwordMatch) {
        throw AuthenticationError;
      }
      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { input }, { user }) => {
      // console.log("client side user", user);
      if (user) {
        return User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );
      }
      throw AuthenticationError;
    },
    removeBook: async (parent, { bookId }, { user }) => {
      if (user) {
        return User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true, runValidators: true }
        );
      }
      throw AuthenticationError;
    },
  },
};

module.exports = resolvers;
