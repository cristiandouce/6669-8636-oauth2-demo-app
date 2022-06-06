const http = require("http");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const flash = require("connect-flash");

const env = require("./lib/env");
const auth = require("./lib/auth");
const session = require("./lib/session");
const DebugControl = require("./lib/debug");

// inicializas el server con el framework de express
const app = express();
const server = http.createServer(app);

// acá definimos de donde servir el contenido estático (js, css)
// y cual es el motor de plantillas para el contenido html servido
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// acá definimos parsers de request, para manejarlos como JSON
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// configuramos la session con mongodb como store y passport
// como provider para el objeto de request
app.use(session.middlewares.init);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// definimos un logger para los requests
app.use(DebugControl.log.request());

// Esta ruta es el contenido publico
app.get("/", function (req, res, next) {
  res.render("index", {
    user: req.user,
    session: req.session,
    flash: req.flash(),
  });
});

// Esta ruta es el contenido protegido
app.get(
  "/protected",
  auth.middlewares.ensureAuthenticated,
  (req, res, next) => {
    res.render("protected", {
      user: req.user,
      session: req.session,
      flash: req.flash(),
    });
  }
);

// Esta ruta inicia el authorize request contra
// el Authorization server...
app.get(
  "/login/poc-oauth",
  DebugControl.middleware.logFlow("OAuth2 redirect"),
  passport.authenticate("poc-authz", {
    scope: ["id", "email", "firstname", "lastname"],
  })
);

// Esta ruta recibe el authorization code e
// inicial el token request (access y refresh)
app.get(
  "/login/callback",
  DebugControl.middleware.logFlow("Authorization Code Exchange"),
  passport.authenticate("poc-authz", {
    successRedirect: "/protected",
    failureRedirect: "/",
    failureFlash: true,
  })
);

// Esta ruta deslogea al usuario. Segun FEDERATED_LOGOUT
// sea true o false, también me deslogea del Authorization server
app.get(
  "/logout",
  DebugControl.middleware.logFlow("Logout User"),
  auth.middlewares.logout
);

// Acá inicamos el server en el puerto configurado por entorno
app.listen(env.PORT, () => {
  console.log(`WEB SERVER LISTENING ON PORT: ${env.PORT}`);
});
