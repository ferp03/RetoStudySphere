import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import initializeGoogleAuth from "./googleAuth.js";
import { dbCredentials } from "./creds.js";
import { handleChatRequest } from "./chatbot.js";

const app = express();
const port = 8000;
const saltRounds = 10;

const db = new pg.Client(dbCredentials);

const CLIENT_ID = "120763213730-p0qvtnteh64pb38qmf56381hh46utne8.apps.googleusercontent.com";
const CLIENT_SECRET = "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";

db.connect();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
  })
);

// app.use((req, res, next) => {
//   console.log('Cookies: ', req.cookies); 
//   console.log('session: ', req.session);
//   next();
// });

app.use(passport.initialize());
app.use(passport.session());

initializeGoogleAuth(db, CLIENT_ID, CLIENT_SECRET, saltRounds, app);
app.post("/chat", handleChatRequest);

app.get("/checkSession", (req, res) =>{
  console.log('checando sesion...');
  if(req.session.userId){
    console.log('auth true');
    res.status(200).json({ authenticated: true });
  }else{
    console.log('auth false');
    res.status(200).json({ authenticated: false });
  }
});

// Ruta para registrar un nuevo usuario
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
        const result = await db.query(
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

// Ruta para iniciar sesión
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
        const userId = checkResult.rows[0].usuarioid;  // Obtener el ID del usuario
        const userType = checkResult.rows[0].tipousuario; // Obtener el tipo de usuario
        req.session.userId = userId;  // Almacenar el ID en la sesión
        req.session.userType = userType;  // Almacenar el tipo de usuario en la sesión
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
  req.session.destroy((err) =>{
    if(err){
      return res.status(500).json({ error: 'No se pudo hacer log out' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Log out correctamente'});
    console.log("logout correcto");
  })
})

// Ruta para obtener la información de un usuario
app.post("/getUserInfo", async (req, res) => {
  const userId = req.session.userId;  // Obtener el ID del usuario de la sesión
  const userType = req.session.userType;  // Obtener el tipo de usuario de la sesión

  if (!userId || !userType) {
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

/* 
  snippet para obtener las clases de un usuario con su user id

    let userInfo;
    if (userType === 'maestro') {
      const result = await db.query("CALL clases_maestro($1, $2)", [userId, userInfo]);
      userInfo = result.rows[0]._clasesmaestro;
    } else if (userType === 'alumno') {
      const result = await db.query("CALL clases_alumno($1, $2)", [userId, userInfo]);
      userInfo = result.rows[0]._clasesalumno;
    }

  snippet para obtener la información de un maestro con su user id

    let userInfo;
    if (userType === 'maestro') {
      const result = await db.query("CALL detalle_maestro($1, $2)", [userId, userInfo]);
      userInfo = result.rows[0]._detallemaestro;
    } else if (userType === 'alumno') {
      const result = await db.query("CALL detalle_alumno($1, $2)", [userId, userInfo]);
      userInfo = result.rows[0]._detallealumno;
    }

  
*/


app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("An error occurred");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});