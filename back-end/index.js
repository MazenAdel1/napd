require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const cors = require("cors");
const cookiesParser = require("cookie-parser");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookiesParser());

const PORT = 3000;

const { httpStatus } = require("./utils/consts");
const { registerClient } = require("./controllers/users.controller");

const usersRouter = require("./routes/users.route");
const timeSlotsRouter = require("./routes/timeSlots.route");

app.use("/api/users", usersRouter);
app.use("/api/timeSlots", timeSlotsRouter);

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatus.SERVER_ERROR.message,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("add client", async (data) => {
    try {
      const newClient = await registerClient(data);
      socket.emit("client add success");
      io.emit("client added", newClient);
    } catch (error) {
      console.log("client NOT added");
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
