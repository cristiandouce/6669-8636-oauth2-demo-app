const { find, findIndex, each, remove, pullAt } = require("lodash");
const { v4: uuid } = require("uuid");
const { callbackify } = require("util");

const db = {
  // collection names will get added
};

const applyType = (value, options) => {
  if (Date === options.type) {
    return new options.type(value);
  }

  if ([Number, String, Object].includes(options.type)) {
    return options.type(value);
  }

  return value;
};
/**
 * Creates a model emulating the Mongoose interface
 * IMPORTANT: Implementation is not 100% complete. Only the methods employed were implemented.
 *
 * @param {string} collection the name of the collection
 * @param {object} schema schema definition for virtuals and methods
 * @returns
 */
const createModel = (collection, schema = {}) => {
  // initialize db ollection
  db[collection] = [];

  // Export the base model class for in-memory
  return class MemoryModel {
    static findOne(query, callback) {
      const found = find(db[collection], query);
      let promise = Promise.resolve(found ? new MemoryModel(found) : found);

      if ("function" === typeof callback) {
        return callbackify(() => promise)(callback);
      }

      return promise;
    }

    static findById(_id, callback) {
      const found = find(db[collection], { _id });
      let promise = Promise.resolve(found ? new MemoryModel(found) : found);

      if ("function" === typeof callback) {
        return callbackify(() => promise)(callback);
      }

      return promise;
    }

    static deleteOne(query) {
      const index = findIndex(db[collection], query);
      const pulled = index > -1 ? pullAt(db[collection], index)[0] : null;
      return Promise.resolve(pulled ? new MemoryModel(pulled) : pulled);
    }

    static create(body) {
      const document = {
        // allows to override the _id of the object
        // that's being created in the collection
        _id: uuid(),

        // extend with body
        ...body,
      };

      db[collection].push(document);
      return Promise.resolve(new MemoryModel(document));
    }

    static remove(query, callback) {
      const promise = Promise.resolve(remove(db[collection], query));

      if ("function" === typeof callback) {
        return callbackify(() => promise)(callback);
      }

      return promise;
    }

    static updateOne(query, body, options, callback) {
      const index = findIndex(db[collection], query);
      const pulled = index > -1 ? pullAt(db[collection], index)[0] : null;

      const updated = {
        ...pulled,
        ...body,
        // ...(pulled ? { _id: pulled._id } : null),
      };

      db[collection].splice(index, 0, updated);

      const promise = Promise.resolve(new MemoryModel(updated));

      if ("function" === typeof callback) {
        return callbackify(() => promise)(callback);
      }

      return promise;
    }

    constructor(props) {
      Object.assign(this, props);

      each(schema.schema, (options, name) => {
        if (null == this[name]) {
          return;
        }
        // apply the type assigned
        this[name] = applyType(this[name], options);
      });

      each(schema.methods, (method, name) => {
        if ("function" !== typeof method) {
          return;
        }

        this[name] = method.bind(this);
      });

      each(schema.virtuals, (virtual, name) => {
        if (
          "function" !== typeof virtual.get &&
          "function" !== typeof virtual.set
        ) {
          return;
        }

        Object.defineProperty(this, name, {
          get: virtual.get && virtual.get.bind(this),
          set: virtual.set && virtual.set.bind(this),
        });
      });

      // assign a `_id` to the new entity
      // or reutilize the one already assigned
      this._id = this._id || uuid();
    }

    save(callback) {
      const promise = MemoryModel.create(this.toJSON());

      if ("function" === typeof callback) {
        return callbackify(() => promise)(callback);
      }

      return promise;
    }

    toJSON() {
      let ret = {};
      each(schema.schema, (value, name) => {
        ret[name] = this[name];
      });

      // need to add _id
      ret._id = this._id;

      return ret;
    }
  };
};

module.exports = {
  model: createModel,
};
