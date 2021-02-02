import { Loader } from '@ghii/ghii';
import * as fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import set from 'lodash.set';

const stat = promisify(fs.stat);

const readFile = promisify(fs.readFile);

type PackageJsonLoaderOptions = {
  target?: string;
  packageJsonPath?: string;
};

export default function packageJsonLoader(options?: PackageJsonLoaderOptions): Loader {
  const sourcePath = options?.packageJsonPath || path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(sourcePath)) throw new Error(`${sourcePath} 404`);
  return async function packageJsonFileLoader() {
    try {
      const fstat = await stat(sourcePath);
      if (fstat.isFile()) {
        const packageJson = await readFile(sourcePath, { encoding: 'utf8' });
        return options?.target ? set({}, options.target, JSON.parse(packageJson)) : JSON.parse(packageJson);
      }
      throw new Error(`Source ${sourcePath} is not a file`);
    } catch (err) {
      throw new Error(`${sourcePath} --> ${err.message} `);
    }
  };
}
