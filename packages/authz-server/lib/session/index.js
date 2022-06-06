const session = require("express-session");
const MongoStore = require("connect-mongo");

const env = require("../env");

const sessionStore = ["mongodb", "mongoose"].includes(env.STORE_PROVIDER)
  ? MongoStore.create({
      mongoUrl: env.DATABASE_URL,
      collectionName: env.SESSION_COLLECTION_NAME,
    })
  : null;

module.exports.store = sessionStore;
module.exports.middlewares = {};

module.exports.middlewares.init = session({
  name: env.SESSION_COOKIE_NAME,
  store: sessionStore,
  resave: true,
  saveUninitialized: true,
  secret: env.SESSION_SECRET,
});
