const { OAuthUsersModel } = require("../index");
const { users: usersFixtures } = require("./fixtures");

/**
 * Make any changes you need to make to the database here
 */
async function up() {
  // Write migration here
  await Promise.all(usersFixtures.map((user) => OAuthUsersModel.create(user)));
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
  // Write migration here
  await Promise.all(
    usersFixtures.map((user) =>
      OAuthUsersModel.deleteOne({ email: user.email })
    )
  );
}

module.exports = { up, down };
