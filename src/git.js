const { execAsync } = require("./exec");

const COMMIT_MSG_CHANGELOG = "Chore: Update Changelog";

const getTags = async () => {
  const stdout = await execAsync("git tag");
  const tags = (stdout || "")
    .split("\n")
    .filter((x) => x)
    .reverse();
  return tags;
};

const getCommitMessagesAfterLastTag = async () => {
  const tags = await getTags();
  const lastTags = tags?.[0];
  let stdout;
  if (lastTags) {
    stdout = await execAsync(
      `git log ${lastTags}..HEAD --no-merges --oneline --pretty=tformat:"%s"`
    );
  } else {
    stdout = await execAsync(
      `git log --no-merges --oneline --pretty=tformat:"%s"`
    );
  }

  const commitMessages = (stdout || "")
    .split("\n")
    .filter((x) => x && x !== COMMIT_MSG_CHANGELOG);
  return commitMessages;
};

const doCommitAfterBumpVersion = async (msgArg) => {
  const msg = msgArg || COMMIT_MSG_CHANGELOG;
  await execAsync(`git add . && git commit -m "${msg}"`);
};

// getCommitMessagesAfterLastTag();
module.exports = {
  getTags,
  getCommitMessagesAfterLastTag,
  doCommitAfterBumpVersion,
};
