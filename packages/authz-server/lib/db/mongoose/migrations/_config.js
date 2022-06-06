const env = require("../../../env");

module.exports = {
  dbConnectionUri: env.DATABASE_URL,
  migrationsDir: __dirname,
  autosync: true,
};
