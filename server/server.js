const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { createServer } = require('http');
const { Server } = require('socket.io');


const PORT = process.env.PORT || 3001;
const app = express();
const httpServer = createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow any origin
  }
});

const players = {}; // Store all connected players

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
        // Send the current players to the new player
        socket.emit('currentPlayers', players);
        
        // Add the new player to the players object
        socket.on('newPlayer', (playerData) => {
          players[socket.id] = playerData;
          // Broadcast new player to other clients
          io.emit('newPlayer', playerData);
          socket.emit('currentPlayers', players);
        });

        // Handle player attack
        socket.on('playerHit', (playerData) => {
          io.emit('playerAttack', playerData);
        });

        // Handle player animation
        socket.on('playerAnimation', (data) => {
          if (players[data.id]) {
            players[data.id].key = data.key;
            io.emit('playerAnimation', data);
          }
        });

        // Handle player movement
        socket.on('playerMovement', (playerData) => {
          if (players[socket.id]) {
            players[socket.id].x = playerData.x;
            players[socket.id].y = playerData.y;
            io.emit('playerMoved', playerData);
          }
        });
      
        // Handle player disconnect
        socket.on('disconnect', () => {
          console.log('user disconnected: ' + socket.id);
          socket.broadcast.emit('playerDisconnected', { id: socket.id });
          delete players[socket.id];
        });
      });

      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};
// Call the async function to start the server
startApolloServer();
