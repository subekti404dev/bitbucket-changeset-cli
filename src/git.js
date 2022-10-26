const { execAsync } = require("./exec");

const getTags = async () => {
  const res = await execAsync("git tag");
  console.log({ res });
};

getTags()
