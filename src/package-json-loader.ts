import { Loader } from '@ghii/ghii';
import * as fs from 'fs';
import set from 'lodash.set';
import path from 'path';
import { PackageJson } from 'type-fest';
import { promisify } from 'util';

const stat = promisify(fs.stat);

const readFile = promisify(fs.readFile);

type PackageJsonLoaderOptions = {
  target?: string;
  packageJsonPath?: string;
  map?: (packageJson: PackageJson) => any;
};

export default function packageJsonLoader(options?: PackageJsonLoaderOptions): Loader {
  const sourcePath = options?.packageJsonPath ?? path.join(process.cwd(), 'package.json');
  const mapFn = options?.map ?? (v => v);
  if (!fs.existsSync(sourcePath)) throw new Error(`${sourcePath} 404`);
  return async function packageJsonFileLoader() {
    try {
      const fstat = await stat(sourcePath);
      if (fstat.isFile()) {
        const packageJsonSting = await readFile(sourcePath, { encoding: 'utf8' });
        const mappedPackageJson = mapFn(JSON.parse(packageJsonSting));

        return options?.target ? set({}, options.target, mappedPackageJson) : mappedPackageJson;
      }
      throw new Error(`Source ${sourcePath} is not a file`);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`${sourcePath} --> ${err.message} `);
      }
    }
  };
}
