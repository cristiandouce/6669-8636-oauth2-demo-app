const env = require("../../env");
const { OAuthAdapter } = require("./base");
/**
 * Exportar el modelo de db que queramos usar
 */

module.exports = new OAuthAdapter(env.STORE_PROVIDER);
