const { createCommand } = require("commander");
const pkgJson = require("../package.json");
const { bumpVersion } = require("./cmd");

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
