require("dotenv").config();

const express = require("express");
const { json } = require("body-parser");
const massive = require("massive");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const app = express();

app.use(json());

app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
  })
);

app.use(express.static(__dirname + "/../build"));

massive(process.env.CONNECTION_STRING).then(db => {
  app.set("db", db);
});

app.post("/auth/signup", async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    await req.app
      .get("db")
      .users.insert({ username: req.body.username, password: hash });
    req.session.user = { username: req.body.username };
    res.json(req.session.user);
  } catch (e) {
    console.log(e);
    res.status(500).json("Error");
  }
});

app.post("/auth/login", async (req, res) => {
  console.log(req.body);
  const user = await req.app.get("db").find_user(req.body.username);
  console.log(user);
  if (!user.length) {
    res.status(401).json({ error: "No user found." });
  } else {
    if (!(await bcrypt.compare(req.body.password, user[0].password))) {
      res.status(401).json({ error: "Incorrect password" });
    } else {
      req.session.user = { username: user[0].username };
      res.json({ username: user[0].username });
    }
  }
});

app.get("/auth/me", (req, res, next) => {
  console.log(req.session);
  if (!req.session.user) {
    return res.status(401).send("Log in required");
  } else {
    return res.status(200).send(req.session.user);
  }
});

app.post("/auth/logout", (req, res) => {
  req.session.destroy();
  res.json("logged out");
});

let PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
