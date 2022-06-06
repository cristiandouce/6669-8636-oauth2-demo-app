const memorm = require("./orm");

module.exports.OAuthTokensModel = memorm.model("oauthtokens", {
  schema: {
    accessToken: { type: String },
    accessTokenExpiresAt: { type: Date },
    client: { type: Object }, // `client` and `user` are required in multiple places, for example `getAccessToken()`
    clientId: { type: String },
    refreshToken: { type: String },
    scope: { type: String },
    refreshTokenExpiresAt: { type: Date },
    user: { type: Object },
    userId: { type: String },
  },
});

module.exports.OAuthClientsModel = memorm.model("oauthclients", {
  schema: {
    name: { type: String },
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUris: { type: Array },
    logoutUris: { type: Array },
    grants: { type: Array },
  },
  virtuals: {
    id: {
      get() {
        return `${this.clientId}`;
      },
    },
  },
});

module.exports.OAuthUsersModel = memorm.model("oauthusers", {
  schema: {
    email: { type: String, default: "" },
    firstname: { type: String },
    lastname: { type: String },
    password: { type: String },
    username: { type: String },
  },
  methods: {
    verifyPassword(password) {
      return this.password === password;
    },
  },
  virtuals: {
    id: {
      get() {
        return `${this._id}`;
      },
    },
  },
});

module.exports.OAuthAuthorizationCodeModel = memorm.model(
  "oauthauthorizationcode",
  {
    schema: {
      authorizationCode: { type: String },
      expiresAt: { type: Date },
      redirectUri: { type: String },
      scope: { type: String },
      client: { type: String },
      user: { type: Object },
    },
  }
);

module.exports.OAuthStateModel = memorm.model("oauthstate", {
  shema: {
    state: { type: String },
    body: { type: Object },
  },
});
