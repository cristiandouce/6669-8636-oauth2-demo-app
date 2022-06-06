const crypto = require("crypto");
const DebugControl = require("./debug");

module.exports.randomString = () => {
  const seed = crypto.randomBytes(256);
  return crypto.createHash("sha1").update(seed).digest("hex");
};

module.exports.DebugControl = DebugControl;
