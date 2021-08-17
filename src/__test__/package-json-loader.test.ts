import packgeJsonLoader from '../package-json-loader';
import path from 'path';
import { PackageJson } from 'type-fest';
describe('Ghii Yaml Loader', () => {
  it('export a function', () => {
    expect(typeof packgeJsonLoader).toBe('function');
  });

  describe('to create a loader', () => {
    it('create a file loader from yaml file', async () => {
      const packageJsonLoader = packgeJsonLoader();
      expect(typeof packageJsonLoader).toBe('function');
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
    it('read to app name from package json on default path', async () => {
      const content = (await packgeJsonLoader()()) as PackageJson;
      expect(content.name).toBe('@ghii/package-json-loader');
    });
    it('read and map to scalar', async () => {
      const content = await packgeJsonLoader({ map: p => p.name })();
      expect(content).toBe('@ghii/package-json-loader');
    });
    it('read and map to object', async () => {
      const content = await packgeJsonLoader({
        map: p => ({
          packageName: p.name,
        }),
      })();
      expect(content.packageName).toBe('@ghii/package-json-loader');
    });
  });
});
