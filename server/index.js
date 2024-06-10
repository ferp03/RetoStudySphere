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
  origin: ["https://studysphere-chi.vercel.app", "http://localhost:3000"],

  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.json());

app.set('trust proxy', 1); //para confiar en vercel

const pgSession = connectPgSimple(session);

app.use(
  session({
    store: new pgSession({
      pool: db,
      tableName: 'sessioncookies'
    }),
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',  // Usa secure: true solo en producción con HTTPS
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // Asegúrate de que las cookies se envían con solicitudes cross-origin
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//   console.log('Session:', req.session);
//   console.log("Session id:", req.sessionID);
//   next();
// });

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
  console.log(email);
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
  const { email, password } = req.body;

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
        req.session.save((err) => {
          if (err) {
            console.error('Error saving session:', err);
            return res.status(500).json({ error: "Error saving session" });
          } else {
            console.log('Login Session:', req.session);
            console.log("Session id", req.sessionID);
            return res.status(200).json({ message: "Login successful", authenticated: true });
          }
        });
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
    res.status(200).json({ message: 'Log out correctamente' });
    console.log("logout correctamente");
  });
});

app.get("/getUserInfo", async (req, res) => {
  const userId = req.session.userId;
  const userType = req.session.userType;
  console.log('Session:', req.session);
  console.log("Session id:", req.sessionID);
  console.log("userId:", userId);
  console.log("userType:", userType);

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

app.get("/getUserLastUpdate", async (req, res) => {
  const userId = req.session.userId;
  console.log("Ruta /getUserLastUpdate llamada"); 
  if (!userId) {
    console.log("error 401 aqui");
    return res.status(401).json({ error: "User not logged in" });
  }

  try {
    const result = await db.query("SELECT ultimaModificacion FROM UsuarioLog WHERE usuarioId = $1", [userId]);
    const lastUpdate = result.rows[0].ultimaModificacion;
    console.log(lastUpdate);
    res.status(200).json({ lastUpdate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while retrieving the user's last update." });
  }
});
app.post("/changePassword", async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.session.userId;
  console.log(userId);
  if (!userId) {
    return res.status(401).json({ error: "User not logged in" });
  }

  try {
    const userResult = await db.query("SELECT contraseña FROM Usuario WHERE usuarioId = $1", [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedCurrentPassword = userResult.rows[0].contraseña;
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, hashedCurrentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    await db.query("UPDATE Usuario SET contraseña = $1 WHERE usuarioId = $2", [hashedNewPassword, userId]);

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ error: `An error occurred while changing password: ${err.message}` });
  }
});

app.post("/createClass", async (req, res) => {
  const className = req.body.className;
  const isMaestro = req.session.userType === 'maestro';
  const userId = req.session.userId;
  console.log(className)
  if(isMaestro){
    await db.query("CALL creaClase($1, $2);", [userId, className]);
    res.status(200).json({message: 'Class created successfully'});
  }else{
    res.status(401).json({error: 'Not correct permits'});
  }
})

app.post("/addQuiz", async (req, res) => {
  const name = req.body.name;
  const questions = req.body._questions;
  const dueDate = req.body.dueDate;
  const _claseId = req.body.claseId;
  try{
    console.log("Request body:", req.body);
    await db.query("CALL insert_quiz($1, $2, $3, $4)", [name, questions, dueDate, _claseId]);
    console.log("Quiz", name, "created correctly.");
    res.status(200).json({message: `Quiz ${name} created correctly.`});
  }catch(err){
    console.error("Error adding quiz:", err);
    res.status.apply(500).json({error: "Values cannot be null or empty"});
  }
});

app.get("/getQuizzes/:classId", async (req, res) => {
  const classId = req.params.classId;
  console.log(classId);
  let quizzes;
  try {
    const result = await db.query("CALL obtener_quiz($1, $2)", [classId, quizzes]);
    quizzes = result.rows[0];  // Obtener el JSON resultante
    //console.log(quizzes);
    res.status(200).json({ quizzes });
  } catch (err) {
    console.error("Error retrieving quizzes:", err);
    res.status(500).json({ error: "An error occurred while retrieving quizzes" });
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
