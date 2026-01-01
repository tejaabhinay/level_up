require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { createServer } = require("http");
const { Server } = require("socket.io");

connectDB();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    // Dynamically handle the origin from env or fallback to local dev
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Map to store userId -> socketId for private notifications
const userSockets = new Map();

// Expose io and userSockets via app so controllers can access them for global notifications
app.set("io", io);
app.set("userSockets", userSockets);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Associate the socket with a specific logged-in user for notifications
  socket.on("identify", (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} identified with socket ${socket.id}`);
  });

  // Join a specific conversation room for real-time chat sync
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation room: ${conversationId}`);
  });

  // Handle sending messages real-time within a room
  socket.on("sendMessage", (data) => {
    const { conversationId, message } = data;
    // Broadcast message to everyone in the room EXCEPT the sender
    socket.to(conversationId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    // Clean up mapping on disconnect
    for (let [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});