import { join } from 'path';
import PackageContext from './context.js';
import { normalizeOptions, validateVersionValue, readPackageFile, writePackageFile, writeVersionFiles } from './utils.js';

export default async function bumpver(version, options) {

  options = normalizeOptions(options);
  validateVersionValue(version, options);

  const {
    cwd = process.cwd(),
    versionFile,
  } = options;

  const packageInfo = await readPackageFile(cwd);
  const context = new PackageContext();

  if (packageInfo.workspaces) {
    await Promise.all(packageInfo.workspaces.map(async projectPath => {
      const packageInfo = await readPackageFile(join(cwd, projectPath));
      context.add(projectPath, packageInfo);
    }));
  }

  const tasks = [];

  packageInfo.version = version;
  tasks.push(writePackageFile(cwd, packageInfo));
  tasks.push(writeVersionFiles(cwd, versionFile, version));

  for (const { projectPath, packageInfo } of context.projects) {
    context.overwriteDependencies(packageInfo.dependencies, version);
    context.overwriteDependencies(packageInfo.devDependencies, version);
    context.overwriteDependencies(packageInfo.peerDependencies, version);
    packageInfo.version = version;
    const absoluteProjectPath = join(cwd, projectPath);
    tasks.push(writePackageFile(absoluteProjectPath, packageInfo));
    tasks.push(writeVersionFiles(absoluteProjectPath, versionFile, version));
  }

  await Promise.all(tasks);
}
