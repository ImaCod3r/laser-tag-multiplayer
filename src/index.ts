import express from "express";
import session from "express-session";
import passport from "passport";
import http from "http";
import path from "path";
import { Server } from "socket.io";

import { sequelize } from "./db/sequelize";
import "./auth/googleStrategy"; 
import { Game } from "./game/Game";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "dev_secret",
  resave: false,
  saveUninitialized: false,
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "../public")));

console.log(process.env.GOOGLE_CLIENT_SECRET);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login.html",
    successRedirect: "/game.html",
  })
);

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/login.html");
  });
});


const io = new Server(server);

// compartilhar sessão HTTP com Socket.IO
io.use((socket, next) => {
  sessionMiddleware(socket.request as any, {} as any, next as any);
});

io.use((socket, next) => {
  const req = socket.request as any;

  if (req.session?.passport?.user) {
    return next();
  }

  next(new Error("Not authenticated"));
});

const game = new Game(io);

io.on("connection", (socket) => {
  const req = socket.request as any;
  const userId = req.session.passport.user;

  console.log("user connected:", socket.id, "userId:", userId);

  game.addPlayer(socket, userId);

  socket.on("pingCheck", (cb) => cb());

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
    game.removePlayer(socket.id);
  });
});

server.listen(port, async () => {
  await sequelize.sync();
  console.log(`Server running on *:${port}`);
});