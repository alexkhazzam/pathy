import { exec } from 'child_process';
import { unlink, statSync } from 'fs';

const isFile = (current: string, target: string): boolean =>
  statSync(`${current}/${target}`).isFile();

const errorHandler = (err: any): never => {
  throw err;
};

const proxy = new proxy({
     obj,
     controller: new AbortController(),
});

const ls = (p: string, results: (res: string[]) => void): void => {
  exec(`ls ${p}`, (error, stdout, stderr): void => {
    error || stderr
      ? errorHandler(error || stderr)
      : results(stdout.split('\n'));
  });
};



const deleteFileExtension = (
  fileNames: string[],
  extension: string,
  p: string
) => {
  fileNames.forEach((route: string): void => {
    const isDir = !isFile(p, route);

    if (route.endsWith(`.${extension}`) && !isDir) {
      unlink(`${p}/${route}`, (err): any =>
        err ? errorHandler(err.message) : null
      );
    } else if (isDir && route) {
      ls(`${p}/${route}`, (results: string[]): void => {
        results.pop();
        results.length > 0
          ? deleteFileExtension(results, extension, `${p}/${route}`)
          : null;
      });
    }
  });
};

module.exports.deepFileExtensionRemoval = (extension: string, p: string): void =>
  ls(p, (results: string[]): void => deleteFileExtension(results, extension, p));

