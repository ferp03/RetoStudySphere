import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import bcrypt from "bcrypt";

const initializeGoogleAuth = (db, CLIENT_ID, CLIENT_SECRET, saltRounds, app) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: "http://localhost:8000/auth/google/mainpage",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("Google profile:", profile);
          const email = profile.emails[0].value;
          console.log("Email:", email);

          const checkResult = await db.query("SELECT * FROM Usuario WHERE correo = $1", [email]);
          let usuarioId;
          if (checkResult.rows.length === 0) {
            console.log("User not found, creating new user...");
            const hashedPassword = await bcrypt.hash("googleUser", saltRounds);
            const tipoUsuario = 'alumno';
            const result = await db.query(
              "INSERT INTO Usuario (nombre, correo, contraseña, tipoUsuario) VALUES ($1, $2, $3, $4) RETURNING usuarioId",
              [profile.displayName, email, hashedPassword, tipoUsuario]
            );
            usuarioId = result.rows[0].usuarioId;
          } else {
            console.log("User already exists:");
            usuarioId = checkResult.rows[0].usuarioId;
          }
          done(null, { usuarioId, email, displayName: profile.displayName });
        } catch (err) {
          console.error("Error in GoogleStrategy callback:", err);
          done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((user, cb) => {
    cb(null, user);
  });

  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

  app.get(
    "/auth/google/mainpage",
    (req, res, next) => {
      console.log("Authentication callback called");
      next();
    },
    (req, res, next) => {
      console.log("Passport authentication middleware called");
      next();
    },
    passport.authenticate("google", {
      failureRedirect: "http://localhost:3000",
    }),
    (req, res, next) => {
      console.log("Google authentication successful, redirecting to main page...");
      next();
    },
    (req, res) => {
      console.log("Executing final redirection...");
      res.redirect("http://localhost:3000/auth/google/mainpage");
    }
  );
};

export default initializeGoogleAuth;