import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import initializeGoogleAuth from "./googleAuth.js";

const app = express();
const port = 8000;
const saltRounds = 10;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "maple",
  port: 5432,
});

const CLIENT_ID = "120763213730-p0qvtnteh64pb38qmf56381hh46utne8.apps.googleusercontent.com";
const CLIENT_SECRET = "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";

db.connect();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.use(
  session({
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

initializeGoogleAuth(db, CLIENT_ID, CLIENT_SECRET, saltRounds, app);

app.post("/signup", async (req, res) => {
  console.log("Sign Up in process");
  const { name, email, password, isTeacher } = req.body;
  console.log(email);
  try {
    const checkResult = await db.query("SELECT * FROM Usuario WHERE correo = $1", [email]);
    if (checkResult.rows.length > 0) {
      res.status(400).json({ error: "Email already exists. Try logging in." });
    } else {
      const hash = await bcrypt.hash(password, saltRounds);
      let tipoUsuario = isTeacher ? 'maestro' : 'alumno';
      const result = await db.query(
        "INSERT INTO Usuario (nombre, correo, contraseña, tipoUsuario) VALUES ($1, $2, $3, $4) RETURNING usuarioId",
        [name, email, hash, tipoUsuario]
      );
      console.log(result.rows[0].usuarioId);
      if (isTeacher) {
        await db.query("INSERT INTO Maestro (usuarioId) VALUES ($1)", [result.rows[0].usuarioId]);
      } else {
        await db.query("INSERT INTO Alumno (usuarioId) VALUES ($1)", [result.rows[0].usuarioId]);
      }
      res.status(201).json({ message: "User registered successfully.", authenticated: true });
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
    const checkResult = await db.query("SELECT * FROM usuario WHERE correo = $1", [email]);
    if (checkResult.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      const hashedPassword = checkResult.rows[0].contraseña;
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

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("An error occurred");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});