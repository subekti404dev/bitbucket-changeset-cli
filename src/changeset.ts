import { writeFileSync } from "fs";
import path from "path";
import { getCommitMessagesAfterLastTag } from "./git";

export const generateChangelogItems = async (
  projectName: string,
  changesetDir: string
) => {
  const commitMessages = (await getCommitMessagesAfterLastTag()) || [];
  for (const [i, msg] of commitMessages.entries()) {
    const content = `---\n "${projectName}": patch\n---\n\n${msg}`;
    const filepath = path.join(changesetDir, `update-changelog-${i}.md`);
    writeFileSync(filepath, content);
  }
};
