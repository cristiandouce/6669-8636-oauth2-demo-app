const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2");
const { default: fetch } = require("axios");

const env = require("./env");
const { DebugControl } = require("../../authz-server/lib/utils");

// inicializamos la estrategia de Passport para OAuth
// contra nuestro servidor de OAuth2. el que llamamos `poc-authz`
passport.use(
  "poc-authz",
  new OAuth2Strategy(
    {
      authorizationURL: env.OAUTH_AUTHORIZATION_URL,
      tokenURL: env.OAUTH_TOKEN_URL,
      clientID: env.OAUTH_CLIENT_ID,
      clientSecret: env.OAUTH_CLIENT_SECRET,
      callbackURL: env.OAUTH_CALLBACK_URL,
      state: true,
      passReqToCallback: true,
    },

    // cuando tenemos un intercambio exitoso de token, podemos
    // hacer cosas con el access token y refreshToken provistos
    (req, accessToken, refreshToken, profile, done) => {
      DebugControl.log.functionName("Passport Strategy callback");
      DebugControl.log.variable({
        name: "input",
        value: { accessToken, refreshToken, profile },
      });

      // guardamos el accessToken y el refreshToken en la sesión
      req.session.tokens = {
        access: accessToken,
        refresh: refreshToken,
      };

      console.group();
      console.group();
      DebugControl.log.flow("Userinfo request");
      console.log();
      console.log(
        "PERFORM GET REQUEST",
        `${env.OAUTH_USERINFO_URL}?${new URLSearchParams({
          client_id: env.OAUTH_CLIENT_ID,
        })}`,
        "with headers:",
        {
          Authorization: `Bearer ${accessToken}`,
        }
      );
      console.log();
      console.groupEnd();
      console.groupEnd();

      // con el grant del access token, podemos pedir información del usuario
      // en el endpoint del /userinfo del Authorization server.
      fetch
        .get(env.OAUTH_USERINFO_URL, {
          querystring: new URLSearchParams({ client_id: env.OAUTH_CLIENT_ID }),
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => res.data)
        .then(
          (userinfo) => {
            const user = Object.assign(profile, userinfo);
            DebugControl.log.variable({ name: "output", value: user });
            return done(null, user);
          },
          (err) => done(err)
        );
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

// mal, pero funciona... guardamos el usuario completo como clave
// de entrada en la session... esto infla el objeto de session,
// pero para el PoC está bien
passport.deserializeUser(function (id, done) {
  done(null, id);
});

module.exports.middlewares = {};

module.exports.middlewares.logout = (req, res, next) => {
  req.logout();
  req.session.destroy();

  const querystring = new URLSearchParams({
    client_id: env.OAUTH_CLIENT_ID,
    redirect_uri: env.BASE_DOMAIN,
  });

  return res.redirect(`${env.OAUTH_LOGOUT_URL}?${querystring}`);
};

module.exports.middlewares.ensureAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).render("401", {
      user: req.user,
      session: req.session,
      flash: req.flash(),
    });
  }

  return next();
};
