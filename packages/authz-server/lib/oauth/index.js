const OAuthServer = require("express-oauth-server");

const utils = require("../utils");
const adapter = require("./adapter");
const { OAuthClientsModel } = require("../db");

module.exports.server = new OAuthServer({
  model: adapter,
  grants: ["authorization_code", "refresh_token"],
  accessTokenLifetime: 60 * 60 * 24, // 24 hours, or 1 day
  allowEmptyState: true,
  allowExtendedTokenAttributes: true,
});

module.exports.adapter = adapter;

module.exports.saveStateAndContinue = (req, res, next) => {
  const originalState = !!req.query.state;

  // generate state if missing
  req.query.state = req.query.state || utils.randomString();

  const querystring = new URLSearchParams(req.query).toString();
  const redirectUrl = `${req.path}?${querystring}`;

  const onSave = () => (originalState ? next() : res.redirect(redirectUrl));

  // save state and continue
  return adapter.saveState(req.query).then(onSave, next);
};

module.exports.ensureAuthenticatedOrRedirectToLoginWithState = (
  req,
  res,
  next
) => {
  if (!req.user) {
    return res.redirect(`/login?state=${req.query.state}`);
  }

  return next();
};

module.exports.logout = (req, res, next) => {
  req.logout();
  req.session.destroy();

  if (!req.query.client_id || !req.query.redirect_uri) {
    return res.redirect("/");
  }

  OAuthClientsModel.findOne({ clientId: req.query.client_id }, (err, data) => {
    if (err) {
      return next(err);
    }

    if ((data.logoutUris || []).includes(req.query.redirect_uri)) {
      return res.redirect(req.query.redirect_uri);
    }

    return next(err);
  });
};
