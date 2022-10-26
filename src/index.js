const { createCommand } = require("commander");
const { name, version } = require("../package.json");
const { bumpVersion } = require("./cmd");

async function main() {
  const program = createCommand(name)
    .version(version)
    .description("CLI to bump npm version and publish to registry")
    .argument("<npm-token>", "npm token")
    .action((npmToken, opts) => {
      console.log({ npmToken, opts });
      bumpVersion({
        npmToken,
      });
    });

  await program.parseAsync(process.argv);
}

main();
