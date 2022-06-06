const {
  OAuthAuthorizationCodeModel,
  OAuthClientsModel,
  OAuthStateModel,
  OAuthTokensModel,
  OAuthUsersModel,
} = require("../../../db/mongoose");

const DebugControl = require("../../../utils/debug");

module.exports = class MongoDBOAuthProvider {
  /**
   * Get access token.
   */
  getAccessToken(bearerToken) {
    DebugControl.log.functionName("OAUTH2 MONGODB ADAPTER: getAccessToken");
    DebugControl.log.variable({ name: "input", value: { bearerToken } });

    return OAuthTokensModel.findOne({ accessToken: bearerToken })
      .lean()
      .then((token) => {
        DebugControl.log.variable({ name: "output", value: token });
        return token;
      });
  }

  /**
   * Get client.
   */
  getClient(clientId, clientSecret) {
    DebugControl.log.functionName("OAUTH2 MONGODB ADAPTER: getClient");
    DebugControl.log.variable({
      name: "input",
      value: { clientId, clientSecret },
    });

    const query = { clientId };

    if (clientSecret) {
      query.clientSecret = clientSecret;
    }

    return OAuthClientsModel.findOne(query)
      .lean()
      .then((client) => {
        client.id = client.clientId;
        DebugControl.log.variable({ name: "output", value: client });
        return client;
      });
  }

  /**
   * Get refresh token.
   */

  getRefreshToken(refreshToken) {
    DebugControl.log.functionName("OAUTH2 MONGODB ADAPTER: getRefreshToken");
    DebugControl.log.variable({
      name: "input",
      value: { refreshToken },
    });

    return OAuthTokensModel.findOne({ refreshToken })
      .lean()
      .then((token) => {
        DebugControl.log.variable({ name: "output", value: token });
        return token;
      });
  }

  /**
   * Get user.
   */

  getUser(username, password) {
    DebugControl.log.functionName("OAUTH2 MONGODB ADAPTER: getUser");
    DebugControl.log.variable({
      name: "input",
      value: { username, password },
    });

    return OAuthUsersModel.findOne({
      username: username,
      password: password,
    })
      .lean()
      .then((user) => {
        DebugControl.log.variable({ name: "output", value: user });
        return user;
      });
  }

  /**
   * Save token.
   */

  saveToken(token, client, user) {
    DebugControl.log.functionName("OAUTH2 MONGODB ADAPTER: saveToken");
    DebugControl.log.variable({
      name: "input",
      value: { token, client, user },
    });

    var accessToken = new OAuthTokensModel({
      accessToken: token.accessToken,
      accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
      scope: token.scope,
      client: client,
      clientId: client.clientId,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: new Date(token.refreshTokenExpiresAt),
      user: user,
      userId: user._id,
    });
    // Can't just chain `lean()` to `save()` as we did with `findOne()` elsewhere. Instead we use `Promise` to resolve the data.
    return new Promise(function (resolve, reject) {
      accessToken.save(function (err, data) {
        if (err) reject(err);
        else resolve(data);
      });
    }).then(function (saveResult) {
      // `saveResult` is mongoose wrapper object, not doc itself. Calling `toJSON()` returns the doc.
      saveResult =
        saveResult && typeof saveResult == "object"
          ? saveResult.toJSON()
          : saveResult;

      // Unsure what else points to `saveResult` in oauth2-server, making copy to be safe
      var data = new Object();
      for (var prop in saveResult) data[prop] = saveResult[prop];

      // /oauth-server/lib/models/token-model.js complains if missing `client` and `user`. Creating missing properties.
      data.client = data.clientId;
      data.user = data.userId;

      DebugControl.log.variable({ name: "output", value: data });
      return data;
    });
  }

  saveAuthorizationCode(code, client, user, callback) {
    DebugControl.log.functionName(
      "OAUTH2 MONGODB ADAPTER: saveAuthorizationCode"
    );
    DebugControl.log.variable({
      name: "input",
      value: { code, client, user },
    });

    const body = { ...code, client: client.clientId, user: user.toJSON() };
    const codeObj = new OAuthAuthorizationCodeModel(body);

    DebugControl.log.variable({ name: "output", value: codeObj });

    return codeObj.save(callback);
  }

  getAuthorizationCode(authorizationCode, callback) {
    DebugControl.log.functionName(
      "OAUTH2 MONGODB ADAPTER: getAuthorizationCode"
    );
    DebugControl.log.variable({
      name: "input",
      value: { authorizationCode },
    });

    const query = { authorizationCode };
    OAuthAuthorizationCodeModel.findOne(query, function (err, data) {
      if (err) {
        return callback(err);
      }

      const code = {
        code: authorizationCode,
        expiresAt: new Date(data.expiresAt),
        redirectUri: data.redirectUri,
        scope: data.scope,
        client: { id: data.client },
        user: data.user,
      };

      DebugControl.log.variable({ name: "output", value: code });

      return callback(null, code);
    });
  }

  revokeAuthorizationCode(code, callback) {
    DebugControl.log.functionName(
      "OAUTH2 MONGODB ADAPTER: revokeAuthorizationCode"
    );
    DebugControl.log.variable({
      name: "input",
      value: { code },
    });

    const query = { authorizationCode: code.code };
    DebugControl.log.variable({ name: "output", value: null });
    OAuthAuthorizationCodeModel.remove(query, callback);
  }

  saveState(body) {
    DebugControl.log.functionName("OAUTH2 MONGODB ADAPTER: saveState");
    DebugControl.log.variable({
      name: "input",
      value: { body },
    });

    const query = { state: body.state };
    const payload = { state: body.state, body };
    const options = { upsert: true, returnDocument: "after" };

    return new Promise((resolve, reject) => {
      OAuthStateModel.updateOne(query, payload, options, (err, data) => {
        if (err) {
          return reject(err);
        }

        const result =
          data && "function" === typeof data.toJSON ? data.toJSON() : data;
        DebugControl.log.variable({ name: "output", value: result });
        return resolve(result);
      });
    });
  }

  getState(state) {
    DebugControl.log.functionName("OAUTH2 MONGODB ADAPTER: getState");
    DebugControl.log.variable({
      name: "input",
      value: { state },
    });

    return OAuthStateModel.findOne({ state }).then((result) => {
      DebugControl.log.variable({ name: "output", value: result });
      return result;
    });
  }
};
