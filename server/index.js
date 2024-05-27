import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import connectPgSimple from 'connect-pg-simple';
import bcrypt from "bcrypt";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import initializeGoogleAuth from "./googleAuth.js";
import { handleChatRequest } from "./chatbot.js";
import { config } from 'dotenv';

config();
const app = express();
const port = 8000;
const saltRounds = 10;

const { Pool } = pg;

const db = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

db.connect().catch(err => {
  console.error('Error connecting to the database:', err);
});

app.use(cors({
  origin: "https://studysphere-fernandos-projects-88891e4a.vercel.app",
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

const pgSession = connectPgSimple(session);

app.use(
  session({
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
      pool: db, // Connection pool
      tableName: 'sessioncookies' // Use another table-name than the default "session" one
    }),
    cookie: { 
      secure: false,  // Use secure cookies in production
      httpOnly: true,
      sameSite: 'none'
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log('Session:', req.session);
  console.log("Session id:", req.sessionID);
  next();
});

initializeGoogleAuth(db, CLIENT_ID, CLIENT_SECRET, saltRounds, app);

app.post("/chat", handleChatRequest);

app.get("/checkSession", (req, res) => {
  console.log('Checking session...');
  if (req.session.userId) {
    console.log('Auth true');
    res.status(200).json({ authenticated: true });
  } else {
    console.log('Auth false');
    res.status(200).json({ authenticated: false });
  }
});

app.post("/signup", async (req, res) => {
  console.log("Sign Up in process");
  const { name, email, password, isTeacher } = req.body;
  try {
    const checkResult = await db.query("SELECT * FROM Usuario WHERE correo = $1", [email]);
    if (checkResult.rows.length > 0) {
      res.status(400).json({ error: "Email already exists. Try logging in." });
    } else {
      const hash = await bcrypt.hash(password, saltRounds);
      if (isTeacher) {
        console.log("Inserting maestro");
        let _newMaestroId;
        await db.query(
          "CALL insert_maestro($1, $2, $3, $4)",
          [name, email, hash, _newMaestroId]
        );
        const queryId = await db.query("SELECT * FROM Usuario WHERE correo = $1", [email]);
        const userId = queryId.rows[0].usuarioid;
        req.session.userId = userId;
        req.session.userType = 'maestro';
      } else {
        console.log("Inserting alumno");
        let _newAlumnoId;
        await db.query(
          "CALL insert_alumno($1, $2, $3, $4)",
          [name, email, hash, _newAlumnoId]
        );
        const queryId = await db.query("SELECT * FROM Usuario WHERE correo = $1", [email]);
        const userId = queryId.rows[0].usuarioid;
        req.session.userId = userId;
        req.session.userType = 'alumno';
      }
      console.log("User registered successfully.");
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
        const userId = checkResult.rows[0].usuarioid;
        const userType = checkResult.rows[0].tipousuario;
        req.session.userId = userId;
        req.session.userType = userType;
        console.log('Login Session:', req.session);
        console.log("Session id", req.sessionID);
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

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo hacer log out' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Log out correctly' });
    console.log("logout correctly");
  });
});

app.get("/getUserInfo", async (req, res) => {
  const userId = req.session.userId;
  const userType = req.session.userType;
  console.log('Session:', req.session);
  console.log("Session id", req.sessionID);
  console.log("userId", userId);
  console.log("userType", userType);

  if (!userId || !userType) {
    console.log("error 401 aqui");
    return res.status(401).json({ error: "User not logged in" });
  }

  try {
    let userInfo;
    if (userType === 'maestro') {
      const result = await db.query("CALL detalle_maestro_clases($1, $2)", [userId, userInfo]);
      userInfo = result.rows[0]._detallemaestroclases;
    } else if (userType === 'alumno') {
      const result = await db.query("CALL detalle_alumno_clases($1, $2)", [userId, userInfo]);
      userInfo = result.rows[0]._detallealumnoclases;
    }
    res.status(200).json({ userInfo });
    console.log({ userInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while retrieving user information." });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("An error occurred");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
