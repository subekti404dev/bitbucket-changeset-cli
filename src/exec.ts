import { exec } from "child_process";

export const execAsync = (cmd: string) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (err: any, stdout: string, _stderr: string) => {
      if (err) {
        return reject(err);
      }
      return resolve(stdout);
    });
  });
};
