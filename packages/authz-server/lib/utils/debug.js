const finished = require("on-finished");

const levels = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

let level = levels.HIGH;

module.exports = {
  levels,
  setLevel: (l) => (level = l),
  middleware: {
    logFlow: (flowName) => (req, res, next) => {
      module.exports.log.flow(flowName);
      return next();
    },
  },
  log: {
    parameters: (parameters) => {
      if (levels.HIGH > level) return;
      console.log();
      console.group();
      if (Array.isArray(parameters)) {
        parameters.forEach((p) => console.log(`${p.name}:`, p.value));
      } else if ("object" === typeof parameters) {
        Object.keys(parameters).forEach((name) => {
          if (!name) return;
          console.log(`${name}:`, parameters[name]);
        });
      } else {
        console.log(parameters);
      }
      console.groupEnd();
      console.log();
    },
    functionName: (name) => {
      if (levels.MEDIUM > level) return;
      console.log(`\nEXECUTING: ${name}`);
    },
    flow: (flow) => {
      if (levels.LOW > level) return;
      console.log(`\nBEGIN FLOW: ${flow}`);
    },
    variable: ({ name, value }) => {
      if (levels.HIGH > level) return;
      console.group();
      console.group();
      console.log(`VARIABLE ${name}:`, value);
      console.groupEnd();
      console.groupEnd();
    },
    request: () => (req, res, next) => {
      if (levels.HIGH > level) return next();
      const reqHeaders = (({ Authorization }) => ({ Authorization }))(
        req.headers
      );
      console.log("\nHit URL", req.url, "with following:");
      console.group();
      console.log("Headers:", reqHeaders);
      console.log("Query:", req.query);
      console.log("Body:", req.body);
      console.groupEnd();

      finished(res, (err, _res) => {
        const resHeaders = {
          Location: _res.getHeaders()["location"],
        };
        console.log("\nReply URL", req.url, "with following:");
        console.group();
        console.log("Status:", _res.statusCode);
        console.log("Headers:", resHeaders);
        console.groupEnd();
      });

      return next();
    },
  },
};
