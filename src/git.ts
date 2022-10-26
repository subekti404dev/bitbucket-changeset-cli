const { execAsync } = require("./exec");

const COMMIT_MSG_CHANGELOG = "Chore: Update Changelog";

export const getTags = async () => {
  const stdout = await execAsync("git tag");
  const tags = (stdout || "")
    .split("\n")
    .filter((x: string) => x)
    .reverse();
  return tags;
};

export const getCommitMessagesAfterLastTag = async () => {
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
    .filter((x: string) => x && x !== COMMIT_MSG_CHANGELOG);
  return commitMessages;
};

export const doCommitAfterBumpVersion = async (msgArg: string) => {
  const msg = msgArg || COMMIT_MSG_CHANGELOG;
  await execAsync(`git add . && git commit -m "${msg}"`);
};
