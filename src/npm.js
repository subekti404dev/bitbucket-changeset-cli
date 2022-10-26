const { writeFileSync } = require("fs");
const os = require("os");
const path = require("path");

const writeNpmrc = async (registry, token) => {
  writeFileSync(
    path.join(os.homedir(), ".npmrc"),
    `//${registry}/:_authToken="${token}"`
  );
};

module.exports = { writeNpmrc };
