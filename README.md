# Create Webflow Extension

Scaffold a new Webflow Designer Extension project with a [built-in template](https://github.com/Flash-Brew-Digital/webflow-extension-starter).

![Flash Brew Digital OSS](https://img.shields.io/badge/Flash_Brew_Digital-OSS-6F4E37?style=for-the-badge&labelColor=E9E3DD)
![MIT License](https://img.shields.io/badge/License-MIT-6F4E37?style=for-the-badge&labelColor=E9E3DD)
![Webflow Community Resource](https://img.shields.io/badge/Community_Resource-146EF5?style=for-the-badge&logo=webflow&logoColor=white)

## Usage

```bash
npx create-webflow-extension@latest
```

Follow the interactive prompts to configure your project accordingly.

## Options

```
Usage: create-webflow-extension [name] [options]

Arguments:
  name                        Project name

Options:
  -V, --version               Output the version number
  -n, --name <name>           Project name
  --pm <manager>              Package manager (pnpm, npm, yarn, bun)
  -l, --linter <linter>       Linter and formatter (oxlint, biome, eslint)
  --sg, --skip-git            Skip initializing a git repository
  --si, --skip-install        Skip installing dependencies
  -q, --quiet                 Suppress interactive prompts and visual output
  -h, --help                  Display help
```

## Examples

Interactive mode:

```bash
npx create-webflow-extension
```

With project name:

```bash
npx create-webflow-extension my-extension
```

Non-interactive with all options:

```bash
npx create-webflow-extension my-extension --pm pnpm --linter oxlint --quiet
```

Skip dependency installation:

```bash
npx create-webflow-extension my-extension --skip-install
```

## What's included

The generated project includes:

- React 19 with TypeScript
- Rspack for fast Rust-based bundling
- Custom hooks for the Designer API
- Configurable linting and formatting via [Ultracite](https://www.ultracite.ai/) (Oxlint + Oxfmt, Biome, or ESLint + Prettier + Stylelint)
- Ready-to-use project structure

## Resources

- [Designer Extensions documentation](https://developers.webflow.com/designer/docs/designer-extensions)
- [Designer APIs reference](https://developers.webflow.com/designer/reference/introduction)
- [Webflow Apps UI Kit (Figma)](https://www.figma.com/community/file/1291823507081366246/webflow-app-ui-kit-2-0)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](.github/CONTRIBUTING.md) for more information.

## License

[MIT License](LICENSE.md)

## Author

[Ben Sabic](https://bensabic.ca) at [Flash Brew Digital](https://flashbrew.digital)
