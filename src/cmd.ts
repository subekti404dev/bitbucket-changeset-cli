import { execAsync } from "./exec";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { generateChangelogItems } from "./changeset";
import { writeNpmrc } from "./npm";
import { doCommitAfterBumpVersion, getCurrBranch } from "./git";

interface IBumpVersion {
  npmToken: string;
  mainBranch: string;
  versionCmd?: string;
}
export const bumpVersion = async ({
  mainBranch,
  versionCmd,
  npmToken,
}: IBumpVersion) => {
  try {
    const rootDir = process.cwd();
    const changesetDir = path.join(rootDir, ".changeset");

    // checking dependencies
    console.log("Checking Dependencies...");

    const stdoutGitCheck = (await execAsync("which git")) as string;
    if ((stdoutGitCheck || "").includes("not found")) {
      console.error("git is not installed !!");
      process.exit(1);
    }
    if (!existsSync(changesetDir)) {
      console.error("changeset is not initialized on this repo !!");
      process.exit(1);
    }

    let pkgJson: any = {};
    try {
      pkgJson = require(path.join(rootDir, "package.json"));
    } catch (error) {}

    if (!pkgJson?.name) {
      console.error("invalid package.json file, please check !!");
      process.exit(1);
    }

    if (!pkgJson?.publishConfig?.registry) {
      console.error("Please add `publishConfig.registry` package.json !!");
      process.exit(1);
    }
    //   generate changeset update files
    console.log("Generating Changeset Files...");

    await generateChangelogItems(pkgJson.name, changesetDir);

    //   bump version and write changelog
    console.log("Bumping Version and Write Changelog...");
    await execAsync(versionCmd || "npx changeset version");

    // let changelog;
    try {
      const changelog = readFileSync(path.join(rootDir, "CHANGELOG.md"), {
        encoding: "utf-8",
      });

      if (changelog) {
        console.log("=============================");
        console.log(changelog);
        console.log("=============================");
      }
    } catch (error) {}

    // update .npmrc
    console.log("Update `.npmrc` File...");
    const registryHost = (pkgJson?.publishConfig?.registry || "")
      ?.split("://")?.[1]
      ?.split("/")?.[0];
    await writeNpmrc(registryHost, npmToken);

    //   publish
    console.log("Publish Package...");
    await execAsync(
      `npm publish --registry=${pkgJson?.publishConfig?.registry}`
    );

    // do commit
    console.log("Commiting Changelog...");
    await doCommitAfterBumpVersion(mainBranch);

    console.log("Success 👍");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
