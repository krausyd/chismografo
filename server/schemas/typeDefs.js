// import the gql tagged template function
const {gql} = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`
  type Thought {
    _id: ID,
    thoughtText: String,
    createdAt: String,
    username: String,
    reactionCount: Int,
  }

  type Query {
    thoughts: [Thought]
  }
`;

// export our typeDefs
module.exports = typeDefs;