import { readFile, writeFile, access } from 'fs/promises';
import { readFileSync, writeFileSync, existsSync, constants } from 'fs';
import { join } from 'path';

const SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
const DEFAULT_VERSION_FILE = ['src/version.js', 'lib/version.js', 'version.js'];
const PACKAGE_FILE_NAME = 'package.json';

export function normalizeOptions({
  cwd = process.cwd(),
  semVer = true,
  versionFile = false,
} = {}) {
  // semver
  semVer = !!semVer;

  // version file
  if (versionFile) {
    if (versionFile === true) {
      versionFile = DEFAULT_VERSION_FILE;
    }
    if (typeof versionFile === 'string') {
      versionFile = [versionFile];
    } else if (!Array.isArray(versionFile)) {
      throw new Error('versionFile must be a string or an array of strings');
    }
  } else {
    versionFile = [];
  }

  return {
    cwd,
    semVer,
    versionFile,
  };
}

export function validateVersionValue(version, { semVer }) {
  if (typeof version !== 'string' || !version) {
    throw new Error('version is required');
  }
  if (semVer && !isSemVer(version)) {
    throw new Error(`version not in semver format: ${version}`);
  }
}

export function isSemVer(version) {
  return SEMVER_REGEX.test(version);
}

export async function readPackageFile(projectPath) {
  const file = join(projectPath, PACKAGE_FILE_NAME);
  const content = `${await readFile(file)}`;
  return JSON.parse(content);
}

export function readPackageFileSync(projectPath) {
  const file = join(projectPath, PACKAGE_FILE_NAME);
  const content = `${readFileSync(file)}`;
  return JSON.parse(content);
}

export async function writePackageFile(projectPath, packageInfo) {
  const file = join(projectPath, PACKAGE_FILE_NAME);
  const content = JSON.stringify(packageInfo, null, 2);
  await writeFile(file, content);
}

export function writePackageFileSync(projectPath, packageInfo) {
  const file = join(projectPath, PACKAGE_FILE_NAME);
  const content = JSON.stringify(packageInfo, null, 2);
  writeFileSync(file, content);
}

export async function writeVersionFiles(projectPath, versionFiles, version) {
  await Promise.all(versionFiles.map(file => writeVersionFile(projectPath, file, version)));
}

export function writeVersionFilesSync(projectPath, versionFiles, version) {
  versionFiles.forEach(file => writeVersionFileSync(projectPath, file, version));
}

async function writeVersionFile(projectPath, versionFile, version) {
  const filePath = join(projectPath, versionFile);
  const content = generateEsmVersionFileContent(version);
  try {
    await access(filePath, constants.W_OK);
    await writeFile(filePath, content);
  } catch (err) {
    if (err.code !== 'ENOENT') { // not "file not found"
      throw err;
    }
  }
}

function writeVersionFileSync(projectPath, versionFile, version) {
  const filePath = join(projectPath, versionFile);
  const content = generateEsmVersionFileContent(version);
  existsSync(filePath) && writeFileSync(filePath, content);
}

function generateEsmVersionFileContent(version) {
  return `export default '${version}';`;
}
