const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');

const db = require('./config/connection');
const routes = require('./routes');
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer(
  {
  typeDefs,
  resolvers,
  context: authMiddleware
  }
);

// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serves client/build as static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// app.use(routes);

/*** Use Apollo Server instead*/
// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });

// Apollo starts, applies middleware, and waits for the db 
const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

// Call the async function to start the server
startApolloServer();