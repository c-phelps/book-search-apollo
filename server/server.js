const express = require("express");
// import apolloserver and expressmiddleware
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
// import custom authentication middleware
const { authMiddleware } = require("./utils/auth");
// import typedefs and resolvers for apolloserver
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
// const { startupSnapshot } = require("v8");

// setup express middleware and define port
const app = express();
const PORT = process.env.PORT || 3001;
// create apollosever with custom typedef and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloSever = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'))
    })
  }

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`)
    });
  });
};

startApolloSever();