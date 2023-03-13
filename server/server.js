const express = require('express');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');

//import Apollo Server
const { ApolloServer } = require('apollo-server-express');

//import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');

const PORT = process.env.PORT || 3001;
const app = express();

//create a new Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//create a new instance of an Apollo Server with the GraphQL Schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  //integrate our Apollo Server with the Express application as middleware
  server.applyMiddleware({ app });
  
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      //log here where we can tests our GQL API
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

//call the async funciton to start the server
startApolloServer(typeDefs, resolvers);
