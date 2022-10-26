import { writeFileSync } from "fs";
import os from "os";
import path from "path";

export const writeNpmrc = async (registry: string, token: string) => {
  writeFileSync(
    path.join(os.homedir(), ".npmrc"),
    `//${registry}/:_authToken="${token}"`
  );
};
