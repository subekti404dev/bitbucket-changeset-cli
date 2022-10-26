const { writeFileSync } = require("fs");
const path = require("path");
const { getCommitMessagesAfterLastTag } = require("./git");

const generateChangelogItems = async (projectName, dir = ".changeset") => {
  const commitMessages = (await getCommitMessagesAfterLastTag()) || [];
  for (const [i, msg] of commitMessages.entries()) {
    const content = `---\n "${projectName}": patch\n---\n\n${msg}`;
    const filepath = path.join(process.cwd(), dir, `update-changelog-${i}.md`);
    writeFileSync(filepath, content);
  }
  // console.log(commitMessages);
};
module.exports = { generateChangelogItems };

// generateChangelogItems("test-pkg");
