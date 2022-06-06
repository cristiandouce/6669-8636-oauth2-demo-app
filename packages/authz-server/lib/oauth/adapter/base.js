const MongoDBOAuthProvider = require("./mongodb");
const MemoryOAuthProvider = require("./memory");
/**
 * Base Adapter class to interact with `express-oauth-server`
 */
class OAuthAdapter {
  static getProvider(name) {
    let provider;

    switch (name) {
      case "mongoose":
      case "mongodb":
        provider = new MongoDBOAuthProvider();
        break;
      case "memory":
      default:
        provider = new MemoryOAuthProvider();
        break;
    }
    return provider;
  }

  /**
   * @param {string} provider the storage provider to use
   */
  constructor(provider) {
    this.provider = OAuthAdapter.getProvider(provider);
    if (!this.provider) {
      throw new Error(`invalid provider ${provider}`);
    }
  }

  getAccessToken(bearerToken) {
    return this.provider.getAccessToken(bearerToken);
  }

  getClient(clientId, clientSecret) {
    return this.provider.getClient(clientId, clientSecret);
  }

  getRefreshToken(refreshToken) {
    return this.provider.getRefreshToken(refreshToken);
  }

  getUser(username, password) {
    return this.provider.getUser(username, password);
  }

  saveToken(token, client, user) {
    return this.provider.saveToken(token, client, user);
  }

  saveAuthorizationCode(code, client, user, callback) {
    return this.provider.saveAuthorizationCode(code, client, user, callback);
  }

  getAuthorizationCode(authorizationCode, callback) {
    return this.provider.getAuthorizationCode(authorizationCode, callback);
  }

  revokeAuthorizationCode(code, callback) {
    return this.provider.revokeAuthorizationCode(code, callback);
  }

  saveState(body) {
    return this.provider.saveState(body);
  }

  getState(state) {
    return this.provider.getState(state);
  }
}

module.exports = {
  OAuthAdapter,
};
