module.exports = {
  DATABASE_URL:
    process.env.DATABASE_URL || "mongodb://localhost/poc-oauth-server",
  STORE_PROVIDER: process.env.STORE_PROVIDER || "memory",
  NODE_ENV: process.NODE_ENV || "development",
  PORT: process.env.PORT || 3001,
  SESSION_COOKIE_NAME: "poc.authz.sid",
  SESSION_SECRET: process.env.SESSION_SECRET || "THIS-UNSAFE-SECRET",
  SESSION_COLLECTION_NAME:
    process.env.SESSION_COLLECTION_NAME || "oauthsessions",
};
