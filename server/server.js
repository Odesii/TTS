const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3001;
const app = express();
const httpServer = createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
app.use(cors(
  {origin: '*'}
));
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow any origin
  }
});



// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }
  db.once('open', () => {
    httpServer.listen(PORT, () => {

      io.on('connection', (socket) => {
  console.log('a user connected: ' + socket.id);

  socket.on('newPlayer', (playerData) => {
    console.log('New player connected', playerData);
    // Broadcast new player to other clients
    socket.broadcast.emit('newPlayer', playerData);
  });

  socket.on('playerMovement', (playerData) => {
    // Broadcast player movement to other clients
    socket.broadcast.emit('playerMoved', playerData);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected: ' + socket.id);
    // Handle player disconnection logic
    // socket.broadcast.emit('disconnect', socket.id);
    socket.disconnect();
  });
});
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};
// Call the async function to start the server
startApolloServer();
