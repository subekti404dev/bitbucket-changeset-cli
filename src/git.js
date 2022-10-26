const { execAsync } = require("./exec");

const getTags = async () => {
  const stdout = await execAsync("git tag");
  const tags = (stdout || "")
    .split("\n")
    .filter((x) => x)
    .reverse();
  return tags;
};

const getCommitMessagesAfterLastTag = async (tag = null) => {
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

  const commitMessages = (stdout || "").split("\n").filter((x) => x);
  return commitMessages;
};

// getCommitMessagesAfterLastTag();
module.exports = { getTags, getCommitMessagesAfterLastTag };
