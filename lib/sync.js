import { join } from 'path';
import PackageContext from './context.js';
import { normalizeOptions, validateVersionValue, readPackageFileSync, writePackageFileSync, writeVersionFilesSync } from './utils.js';

export default function bumpver(version, options) {

  options = normalizeOptions(options);
  validateVersionValue(version, options);

  const {
    cwd = process.cwd(),
    versionFile,
  } = options;

  const packageInfo = readPackageFileSync(cwd);
  const context = new PackageContext();

  if (packageInfo.workspaces) {
    packageInfo.workspaces.forEach(async projectPath => {
      const packageInfo = readPackageFileSync(join(cwd, projectPath));
      context.add(projectPath, packageInfo);
    });
  }

  packageInfo.version = version;
  writePackageFileSync(cwd, packageInfo);
  writeVersionFilesSync(cwd, versionFile, version);

  for (const { projectPath, packageInfo } of context.projects) {
    context.overwriteDependencies(packageInfo.dependencies, version);
    context.overwriteDependencies(packageInfo.devDependencies, version);
    context.overwriteDependencies(packageInfo.peerDependencies, version);
    packageInfo.version = version;
    const absoluteProjectPath = join(cwd, projectPath);
    writePackageFileSync(absoluteProjectPath, packageInfo);
    writeVersionFilesSync(absoluteProjectPath, versionFile, version);
  }
}
