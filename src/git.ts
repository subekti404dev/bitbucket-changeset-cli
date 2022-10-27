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
    .filter((x: string) => x && !x.toLowerCase().includes("update changelog"));
  return commitMessages;
};

export const doCommitAfterBumpVersion = async (
  mainBranch: string,
  msgArg?: string
) => {
  const msg = msgArg || COMMIT_MSG_CHANGELOG;
  await execAsync(
    `git add . && git commit -m "${msg}" && git push origin HEAD:${mainBranch}`
  );
};

export const getCurrBranch = async () => {
  const stdout = (await execAsync(`git branch`)) as string;
  let branchName = (stdout || "").replace("* ", "").trim();
  if (branchName.includes("no branch")) {
    const stdout2 = (await execAsync(`echo $BITBUCKET_BRANCH`)) as string;
    branchName = stdout2.trim();
  }
  return branchName;
};
