// server.js
const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server, {
    path: '/cable',
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['content-type']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    // Listen for user updates from the server
    socket.on('user_update', (data) => {
      // Broadcast the user update to all connected clients
      io.emit('user_update', data);
    });

    // Listen for new user events from the server
    socket.on('new_user', (data) => {
      // Broadcast the new user to all connected clients
      io.emit('new_user', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
