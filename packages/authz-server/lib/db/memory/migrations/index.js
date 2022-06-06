const users = require("./add-users");
const clients = require("./add-clients");

module.exports.run = async () => {
  try {
    await clients.up();
    await users.up();
  } catch (err) {
    console.error("Found problem running in-memory migrations", err);
  }
};
