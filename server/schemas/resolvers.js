const {AutheticationError} = require('apollo-server-express');
// throw new AutheticationError('Please login') --> use when add logic for 
// adding badges/finding parks 
const {User} = require('../models');
const {signToken} = require('../utils/auth'); 

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('transactions')
                return userData;
            }
            throw new AuthenticationError("You are not logged in!");
        
        },
        users: async ()=>{
            return User.find()
            .select('-__v -password')
            .select('email')
            .select('username');
        },
    },
    Mutation: {
        addUser: async (parent, args) => {
            // Check if the email or username already exist
            const emailExist = await User.findOne({ email: args.email });
            if (emailExist) {
                throw new Error('Email already exists');
            }
            const usernameExist = await User.findOne({ username: args.username });
            if (usernameExist) {
                throw new Error('Username already exists');
            }
        
            // Create the new user object with the provided arguments
            const user = await User.create(args);
            // Sign a token
            const token = signToken(user);
            return { token, user };
        },
        addUser: async(partent, args)=>{
            const user=await User.create(args);
            const token = signToken(user);
            return {token, user};
        },
        login: async (parent, {email, password})=>{
            const user =await User.findOne({email});
            // check if user exist
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }
            // check password
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
              }
        
            const token = signToken(user);
            return { token, user };
        },
    }
}

module.exports = resolvers; 