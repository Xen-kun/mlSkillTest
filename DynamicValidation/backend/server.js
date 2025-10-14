const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, "users.json");

const getUsers = () => JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));

app.get("/check-username", (req, res) => {
  const { username } = req.query;
  const users = getUsers();
  const takenUsernames = users.map((u) => u.username.toLowerCase());
  const available = !takenUsernames.includes(username?.toLowerCase());
  res.json({ available });
});

app.post("/register", (req, res) => {
  const users = getUsers();
  const newUser = req.body;
  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.json({ message: "User registered successfully" });
});

app.listen(3001, () => {
  console.log("✅ Backend running at http://localhost:3001");
});
