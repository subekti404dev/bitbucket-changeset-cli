const { exec } = require("child_process");

const execAsync = (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, _stderr) => {
      if (err) {
        return reject(err);
      }
      return resolve(stdout);
    });
  });
};

const getTags = async () => {
  const res = await execAsync("git tag");
  console.log({ res });
};

getTags()
