import packgeJsonLoader from '../package-json-loader';
import * as fs from 'fs';
import path from 'path';
import { PackageJson } from 'type-fest';
describe('Ghii Yaml Loader', () => {
  it('export a function', () => {
    expect(typeof packgeJsonLoader).toBe('function');
  });

  describe('to create a loader', () => {
    it('create a file loader from yaml file', async () => {
      const yamlFileLoader = packgeJsonLoader();
      expect(typeof yamlFileLoader).toBe('function');
    });
    it('a package.json that not exist ', async () => {
      expect(() => {
        packgeJsonLoader({ packageJsonPath: 'a-missing-path/package.json' });
      }).toThrow();
    });

    /*it('attempt to read not existent file throw Error', async () => {
      expect(() => {
        packgeJsonLoader();
      }).toThrow();
    })*/
    it('attempt to read a folder throw Error', async () => {
      expect(packgeJsonLoader({ packageJsonPath: process.cwd() })).rejects.toBeInstanceOf(Error);
    });

    it('attempt to read a not valid file throw Error', async () => {
      expect(packgeJsonLoader({ packageJsonPath: path.join(__dirname, 'aRandomFile.json') })).rejects.toBeInstanceOf(
        Error
      );
    });
    it('read to app name from package json', async () => {
      const content = (await packgeJsonLoader({ target: 'app' })()) as { app: PackageJson };
      expect(content.app.name).toBe('@ghii/package-json-loader');
    });
    it('read to app name from package json', async () => {
      const content = (await packgeJsonLoader()()) as PackageJson;
      expect(content.name).toBe('@ghii/package-json-loader');
    });
  });
});
