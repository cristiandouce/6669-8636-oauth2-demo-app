/**
 * Module dependencies.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const env = require("../../env");

var uristring = env.DATABASE_URL;

// Makes connection asynchronously. Mongoose will queue up database
// operations and release them when the connection is complete.
// The connection is only executed whenever the store provider is either
// mongodb or mongoose
["mongodb", "mongoose"].includes(env.STORE_PROVIDER) &&
  mongoose.connect(uristring, function (err, res) {
    if (err) {
      console.log("ERROR connecting to: " + uristring + ". " + err);
    } else {
      console.log("Succeeded connected to: " + uristring);
    }
  });

/**
 * Schema definitions.
 */

const OAuthTokensSchema = new Schema({
  accessToken: { type: String },
  accessTokenExpiresAt: { type: Date },
  client: { type: Object }, // `client` and `user` are required in multiple places, for example `getAccessToken()`
  clientId: { type: String },
  refreshToken: { type: String },
  scope: { type: String },
  refreshTokenExpiresAt: { type: Date },
  user: { type: Object },
  userId: { type: String },
});

module.exports.OAuthTokensModel = mongoose.model(
  "OAuthTokens",
  OAuthTokensSchema
);

const OAuthClientsSchema = new Schema({
  name: { type: String },
  clientId: { type: String },
  clientSecret: { type: String },
  redirectUris: { type: Array },
  logoutUris: { type: Array },
  grants: { type: Array },
});

OAuthClientsSchema.virtual("id", function () {
  return `${this.clientId}`;
});

module.exports.OAuthClientsModel = mongoose.model(
  "OAuthClients",
  OAuthClientsSchema
);

const OAuthUsersSchema = new Schema({
  email: { type: String, default: "" },
  firstname: { type: String },
  lastname: { type: String },
  password: { type: String },
  username: { type: String },
});

OAuthUsersSchema.methods.verifyPassword = function (password) {
  return this.password === password;
};

OAuthUsersSchema.virtual("id").get(function () {
  return `${this._id}`;
});

module.exports.OAuthUsersModel = mongoose.model("OAuthUsers", OAuthUsersSchema);

const OAuthAuthorizationCodeSchema = new Schema({
  authorizationCode: { type: String },
  expiresAt: { type: Date },
  redirectUri: { type: String },
  scope: { type: String },
  client: { type: String },
  user: { type: Object },
});

module.exports.OAuthAuthorizationCodeModel = mongoose.model(
  "OAuthAuthorizationCode",
  OAuthAuthorizationCodeSchema
);

const OAuthStateSchema = new Schema({
  state: { type: String },
  body: { type: Object },
});

module.exports.OAuthStateModel = mongoose.model("OAuthState", OAuthStateSchema);
