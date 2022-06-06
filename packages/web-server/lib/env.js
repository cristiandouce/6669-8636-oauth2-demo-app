module.exports = {
  DATABASE_URL:
    process.env.DATABASE_URL || "mongodb://localhost/poc-oauth-server",
  STORE_PROVIDER: process.env.STORE_PROVIDER || "mongodb",
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  SESSION_COOKIE_NAME: "poc.web.sid",
  SESSION_SECRET: process.env.SESSION_SECRET || "THIS-UNSAFE-SECRET",
  SESSION_COLLECTION_NAME: process.env.SESSION_COLLECTION_NAME || "websessions",
  BASE_DOMAIN: process.env.BASE_DOMAIN || "http://localhost:3000/",
  OAUTH_CLIENT_ID:
    process.env.OAUTH_CLIENT_ID || "22ae08768f4ecf3d1c8b898b9b0784c0fd952c1a",
  OAUTH_CLIENT_SECRET:
    process.env.OAUTH_CLIENT_SECRET ||
    "ef31567226a2ec48898720bb726b4ad8c0c1a62bf6993e1c7b6496164c511faa306627a858da9f2ae1251d242242b395ea369eddf577fb6235bbb035c2723e0c9744d7fe22b1fcf522ed981a7b9d1829",
  OAUTH_CALLBACK_URL:
    process.env.OAUTH_CALLBACK_URL || "http://localhost:3000/login/callback",
  OAUTH_AUTHORIZATION_URL:
    process.env.OAUTH_AUTHORIZATION_URL ||
    "http://localhost:3001/oauth/authorize",
  OAUTH_TOKEN_URL:
    process.env.OAUTH_TOKEN_URL || "http://localhost:3001/oauth/token",
  OAUTH_FEDERATED_LOGOUT: process.env.OAUTH_FEDERATED_LOGOUT || false,
  OAUTH_LOGOUT_URL:
    process.env.OAUTH_LOGOUT_URL || "http://localhost:3001/logout",
  OAUTH_USERINFO_URL:
    process.env.OAUTH_USERINFO_URL || "http://localhost:3001/userinfo",
};
