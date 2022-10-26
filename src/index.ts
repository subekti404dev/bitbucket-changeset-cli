import { createCommand } from "commander";
import pkgJson from "../package.json";
import { bumpVersion } from "./cmd";

async function main() {
  const program = createCommand(pkgJson.name)
    .version(pkgJson.version)
    .description(pkgJson.description)
    .argument("<npm-token>", "npm token")
    .action((npmToken: string) => {
      // console.log({ npmToken });
      bumpVersion({
        npmToken,
      });
    });

  await program.parseAsync(process.argv);
}

main();
