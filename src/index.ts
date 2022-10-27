import { createCommand } from "commander";
import pkgJson from "../package.json";
import { bumpVersion } from "./cmd";

async function main() {
  const program = createCommand(pkgJson.name)
    .version(pkgJson.version)
    .description(pkgJson.description)
    .argument("<npm-token>", "npm token")
    .option(
      "-mb, --main-branch <main-branch-name>",
      "main branch name",
      "master"
    )
    .action((npmToken: string, opts: any) => {
      const { mainBranch } = opts;
      bumpVersion({
        mainBranch,
        npmToken,
      });
    });

  await program.parseAsync(process.argv);
}

main();
