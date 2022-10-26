const { createCommand } = require("commander");
const { name, version } = require("../package.json");

async function main() {
  const program = createCommand(name)
    .version(version)
    .description("CLI to bump npm version and publish to registry")
    .argument("<bitbucket-token>", "token of bitbucket")
    .argument("<npm-registry>", "npm registry")
    .argument("<npm-token>", "npm token")
    .action((bitbucketToken, npmRegistry, npmToken, opts) =>
      console.log({ bitbucketToken, npmRegistry, npmToken, opts })
    );

  await program.parseAsync(process.argv);
}

main();
