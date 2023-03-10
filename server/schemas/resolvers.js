const { User, Thought } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async(_arent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({_id: context.user._id})
                    .select('-__v -password')
                    .populate('thoughts')
                    .populate('friends')

                return userData;
            }
            throw new AuthenticationError('Not logged in');
        },
        thoughts: async (parent, { username }) => {
            const params = username ? { username } : {};
            return await Thought.find(params).sort({ createdAt: -1 });
        },
        thought: async(parent, { _id }) => {
            return await Thought.findById({_id});
        },
        users: async () => {
            return await User.find()
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts')
                .sort({username: 1});
        },
        user: async(parent, { username }) => {
            return await User.findOne({ username })
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts');
        },
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return {token, user};
        },
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return {token, user};
        },
        addThought: async (parent, args, context) => {
            if (context.user) {
                const thought = await Thought.create({ ...args, username: context.user.username});
                await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$push: { thoughts: thought._id }},
                    {new: true},
                );
                return thought;
            }
            throw new AuthenticationError('Not logged in');
        },
        addReaction: async (parent, {thoughtId, reactionBody}, context) => {
            if (context.user) {
                const updatedThought = await Thought.findOneAndUpdate(
                  {_id: thoughtId},
                  {$push: { reactions: {reactionBody: reactionBody, username: context.user.username}}},
                  {new: true, runValidators: true},  
                );

                return updatedThought;
            }
            throw new AuthenticationError('Not logged in');   
        },
        addFriends: async (parent, {friendId}, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: {friends: friendId}},
                    {new: true}
                ).populate('friends');

                return updatedUser;
            }
            throw new AuthenticationError('Not logged in');   
        },
    },
};

module.exports = resolvers;