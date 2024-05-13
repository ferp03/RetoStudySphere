// server/index.js
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import axios from "axios";
import cors from "cors";

const app = express();
const port = 8000;
const saltRounds = 10;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "RETO",
  password: "Fpg",
  port: 5432,
});
db.connect();


app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.post("/signup", async (req, res) => {
  console.log("Sign Up in process");
  const { name, email, password, isTeacher } = req.body;
  console.log(email);
  try {
    const checkResult = await db.query("SELECT * FROM Usuario WHERE correo = $1", [
      email,
    ]);
    if (checkResult.rows.length > 0) {
      res.status(400).json({ error: "Email already exists. Try logging in." });
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        let tipoUsuario = isTeacher ? 'maestro' : 'alumno';
        const result = await db.query(
          "INSERT INTO Usuario (nombre, correo, contraseña, tipoUsuario) VALUES ($1, $2, $3, $4) RETURNING usuarioId",
          [name, email, hash, tipoUsuario]
        );
        console.log(result.rows[0].usuarioId);
        if (isTeacher) {
          await db.query(
            "INSERT INTO Maestro (usuarioId) VALUES ($1)",
            [result.rows[0].usuarioId]
          );
        } else {
          await db.query(
            "INSERT INTO Alumno (usuarioId) VALUES ($1)",
            [result.rows[0].usuarioId]
          );
        }
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
    const checkResult = await db.query("SELECT * FROM usuario WHERE correo = $1", [
      email,
    ]);
    if (checkResult.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      const hashedPassword = checkResult.rows[0].contraseña; // Cambiar a contraseña
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