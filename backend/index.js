require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { createServer } = require("http");
const { Server } = require("socket.io");

connectDB();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Map to store userId -> socketId
const userSockets = new Map();

// expose io and userSockets via app so controllers can access them
app.set("io", io);
app.set("userSockets", userSockets);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // New event to associate the socket with a logged-in user
  socket.on("identify", (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} identified with socket ${socket.id}`);
  });

  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation: ${conversationId}`);
  });

  socket.on("sendMessage", async (data) => {
    const { conversationId, message } = data;
    socket.to(conversationId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    // Remove user from mapping on disconnect
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