const passport = require("passport");
const LocalStrategy = require("passport-local");

const model = require("../oauth/adapter");
const { OAuthUsersModel, OAuthClientsModel } = require("../db");
const { DebugControl } = require("../utils");

// inicializas passport login
passport.use(
  new LocalStrategy(function (username, password, done) {
    OAuthUsersModel.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, "Invalid credentials (username / password)");
      }

      if (!user.verifyPassword(password)) {
        return done(null, false, "Invalid credentials (username / password)");
      }

      return done(null, user);
    });
  })
);

// serializamos el usuario en la session por user_id
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deseralizamos el usuario en el req.user buscandolo en el repositorio
passport.deserializeUser(function (id, done) {
  OAuthUsersModel.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports.middlewares = {};

module.exports.middlewares.renderLogin = (req, res, next) => {
  DebugControl.log.functionName("middlewares.renderLogin");
  const flash = req.flash();
  const state = { state: req.query.state };
  model.getState(req.query.state).then(
    (dbState) => {
      const body = dbState ? dbState.body : {};
      DebugControl.log.variable({
        name: "LOGIN STATE",
        value: { state: { ...state, ...body } },
      });
      res.render("login", { state: { ...state, ...body }, flash });
    },
    (err) => {
      res.render("login", {
        state: { state: req.query.state, flash: [err.message] },
      });
    }
  );
};

module.exports.middlewares.login = (req, res, next) =>
  passport.authenticate("local", {
    failureFlash: true,
    failWithError: true,
    // queremos redirigir al mismo state
    failureRedirect: `/login?state=${req.query.state}`,
  })(req, res, next);

module.exports.middlewares.redirectToState = function (req, res, next) {
  model.getState(req.query.state).then((state) => {
    if (!state) {
      return res.status(400).send("Invalid state");
    }

    const querystring = new URLSearchParams(state.body);
    const uristring = `/oauth/authorize?${querystring}`;
    return res.redirect(uristring);
  }, next);
};
