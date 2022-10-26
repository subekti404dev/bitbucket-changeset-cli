const { writeFileSync } = require("fs");
const os = require("os");
const path = require("path");

export const writeNpmrc = async (registry: string, token: string) => {
  writeFileSync(
    path.join(os.homedir(), ".npmrc"),
    `//${registry}/:_authToken="${token}"`
  );
};
