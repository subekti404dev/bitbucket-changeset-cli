const { execAsync } = require("./exec");
const { existsSync } = require("fs");
const path = require("path");
const { generateChangelogItems } = require("./changeset");
const { writeNpmrc } = require("./npm");

interface IBumpVersion {
  versionCmd?: string;
  npmToken: string
}
export const bumpVersion = async ({ versionCmd, npmToken }: IBumpVersion) => {
  const rootDir = process.cwd();
  const changesetDir = path.join(rootDir, ".changeset");

  // checking dependencies
  const stdoutGitCheck = await execAsync("which git");
  if ((stdoutGitCheck || "").includes("not found")) {
    console.error("git is not installed !!");
    process.exit();
  }
  if (!existsSync(changesetDir)) {
    console.error("changeset is not initialized on this repo !!");
    process.exit();
  }

  let pkgJson: any = {};
  try {
    pkgJson = require(path.join(rootDir, "package.json"));
  } catch (error) {}

  if (!pkgJson?.name) {
    console.error("invalid package.json file, please check !!");
    process.exit();
  }

  if (!pkgJson?.publishConfig?.registry) {
    console.error("Please add `publishConfig.registry` package.json !!");
    process.exit();
  }
  //   generate changeset update files
  await generateChangelogItems(pkgJson.name, changesetDir);

  //   bump version and write changelog
  await execAsync(versionCmd || "npx changeset version");

  // update .npmrc
  const registryHost = (pkgJson?.publishConfig?.registry || "")
    ?.split("://")?.[1]
    ?.split("/")?.[0];
  await writeNpmrc(registryHost, npmToken);

  //   publish
  await execAsync(`npm publish --registry=${pkgJson?.publishConfig?.registry}`);
};
