const env = require("../env");
const memoryDB = require("./memory");
const migrations = require("./memory/migrations");

const mongooseDB = require("./mongoose");

let db;

switch (env.STORE_PROVIDER) {
  case "mongoose":
  case "mongodb":
    db = mongooseDB;
    break;
  case "memory":
  default:
    db = memoryDB;
    // IMPORTANT: When using in-memory models, we need to run migrations every time.
    migrations.run();
    break;
}

module.exports = db;
