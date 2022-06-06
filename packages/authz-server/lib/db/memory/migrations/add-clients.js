const { OAuthClientsModel } = require("../index");
const { clients: clientsFixtures } = require("./fixtures");

/**
 * Make any changes you need to make to the database here
 */
async function up() {
  // Write migration here
  await Promise.all(
    clientsFixtures.map((client) => OAuthClientsModel.create(client))
  );
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
  // Write migration here
  await Promise.all(
    clientsFixtures.map((client) =>
      OAuthClientsModel.deleteOne({ clientId: client.clientId })
    )
  );
}

module.exports = { up, down };
