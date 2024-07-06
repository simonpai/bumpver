export default class PackageContext {

  constructor() {
    this.projects = [];
    this._projectPathToModuleName = {};
  }

  add(projectPath, packageInfo) {
    if (!packageInfo.private) {
      this.projects.push({ projectPath, packageInfo });
      this._projectPathToModuleName[projectPath] = packageInfo.name;
    }
  }

  overwriteDependencies(dependencies, version) {
    if (!dependencies) {
      return;
    }
    for (const moduleName in dependencies) {
      const oldVersion = dependencies[moduleName];
      if (oldVersion === '*' || (oldVersion.startsWith('file:') && this._projectPathToModuleName[oldVersion.substring(5)] === moduleName)) {
        dependencies[moduleName] = version;
      }
    }
  }

}
