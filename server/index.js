// server/index.js
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import axios from "axios";
import cors from "cors";

const app = express();
const port = 5000;
const saltRounds = 12;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "maple",
  port: 5432,
});
db.connect();


app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());


app.post("/signup", async (req, res) => {
  console.log("Sign Up in process");
  const email = req.body.email;
  const password = req.body.password;
  console.log(email);
  try {
    const checkResult = await db.query("SELECT * FROM prueba WHERE email = $1", [
      email,
    ]);
    if (checkResult.rows.length > 0) {
      res.status(400).json({ error: "Email already exists. Try logging in." });
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        const result = await db.query(
          "INSERT INTO prueba (email, password) VALUES ($1, $2)",
          [email, hash]
        );
        console.log(result);
        res.status(201).json({ message: "User registered successfully.", authenticated: true });
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM prueba WHERE email = $1", [
      email,
    ]);
    if (checkResult.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      const hashedPassword = checkResult.rows[0].password;
      const isPasswordValid = await bcrypt.compare(password, hashedPassword);
      if (isPasswordValid) {
        res.status(200).json({ message: "Login successful", authenticated: true });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});