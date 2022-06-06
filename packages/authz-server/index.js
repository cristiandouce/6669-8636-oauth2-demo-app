const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const flash = require("connect-flash");

const oauth = require("./lib/oauth");
const env = require("./lib/env");
const { DebugControl } = require("./lib/utils");
const cookieParser = require("cookie-parser");
const { OAuthUsersModel } = require("./lib/db");
const auth = require("./lib/auth");
const session = require("./lib/session");

// inicializas el server
const app = express();
const server = http.createServer(app);

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// configuramos la session con mongodb como store y passport
// como provider para el objeto de request
app.use(session.middlewares.init);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(DebugControl.log.request());

// definis las rutas
app.get("/", function (req, res, next) {
  res.render("index");
});

app.get(
  "/login",
  DebugControl.middleware.logFlow("Start User Authentication"),
  auth.middlewares.renderLogin
);

app.post(
  "/login",
  DebugControl.middleware.logFlow("Process User Authentication "),
  auth.middlewares.login,
  auth.middlewares.redirectToState
);

app.get(
  "/logout",
  DebugControl.middleware.logFlow("Finish User Authentication "),
  oauth.logout
);

app.get(
  "/oauth/authorize",
  DebugControl.middleware.logFlow("Authorization"),
  oauth.saveStateAndContinue,
  oauth.ensureAuthenticatedOrRedirectToLoginWithState,
  oauth.server.authorize({
    allowEmptyState: false,
    authenticateHandler: {
      handle: (req, res) => {
        DebugControl.log.functionName("Authenticate Handler");
        DebugControl.log.parameters(
          Object.keys(req.query).map((k) => ({ name: k, value: req.query[k] }))
        );
        return req.user;
      },
    },
  })
);

app.post(
  "/oauth/token",
  DebugControl.middleware.logFlow("Token Issuance"),
  oauth.server.token()
);

app.get(
  "/userinfo",
  DebugControl.middleware.logFlow("Private Resource - Token Authentication"),
  oauth.server.authenticate(),
  (req, res, next) => {
    const authorizedScopes = res.locals.oauth.token.scope.split(" ");
    const user = new OAuthUsersModel(res.locals.oauth.token.user);

    const userinfo = [
      "id",
      "username",
      "email",
      "firstname",
      "lastname",
    ].reduce((info, scope) => {
      if (authorizedScopes.includes(scope)) {
        info[scope] = user[scope];
      }
      return info;
    }, {});
    res.json(userinfo);
  }
);

// LISTEN puerto
app.listen(env.PORT, () => {
  console.log(`AUTHZ SERVER LISTENING ON PORT: ${env.PORT}`);
});
