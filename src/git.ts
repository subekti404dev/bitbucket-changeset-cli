import { execAsync } from "./exec";

const COMMIT_MSG_CHANGELOG = "Chore: Update Changelog";

export const getTags = async () => {
  const stdout = (await execAsync("git tag")) as string;
  const tags = (stdout || "")
    .split("\n")
    .filter((x: string) => x)
    .reverse();
  return tags;
};

export const getCommitMessagesAfterLastTag = async () => {
  const tags = await getTags();
  const lastTags = tags?.[1];
  let stdout: string;
  if (lastTags) {
    stdout = (await execAsync(
      `git log ${lastTags}..HEAD --no-merges --oneline --pretty=tformat:"%s"`
    )) as string;
  } else {
    stdout = (await execAsync(
      `git log --no-merges --oneline --pretty=tformat:"%s"`
    )) as string;
  }

  const commitMessages = (stdout || "")
    .split("\n")
    .filter((x: string) => x && x !== COMMIT_MSG_CHANGELOG);
  return commitMessages;
};

export const doCommitAfterBumpVersion = async (msgArg?: string) => {
  const msg = msgArg || COMMIT_MSG_CHANGELOG;
  await execAsync(`git add . && git commit -m "${msg}" && git push`);
};
