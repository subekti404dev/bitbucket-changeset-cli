const { createCommand } = require("commander");
const { name, version, description } = require("../package.json");
const { bumpVersion } = require("./cmd");

async function main() {
  const program = createCommand(name)
    .version(version)
    .description(description)
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
