# bumpvr

`bumpvr` is a tool for automating the process of bumping version numbers in your Node.js project's package.json.

* Supports NPM workspaces (monorepo).
* Supports replacing local depenedencies (`file:...`) among NPM workspace projects.

## Installation

```bash
npm install -g bumpvr
```

## Usage

```bash
bumpvr [options] <version>
```

For example,

```bash
bumpvr 1.2.3
```

will bump the version number in your package.json and in the package.json files of all the projects in your NPM workspace to `1.2.3`.

## Options

| Option | Description |
| --- | --- |
| `--cwd` | The directory where the package.json file is located. Default is the current working directory. |
| `--no-semver` | Do not validate the version number against the Semantic Versioning specification. |

## License

This project is licensed under the [MIT License](./LICENSE). 
