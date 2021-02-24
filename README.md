# Markdown template for the AsyncAPI Generator
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## Usage

```bash
ag asyncapi.yaml @asyncapi/markdown-template -o output
```

If you don't have the AsyncAPI Generator installed, you can install it like this:

```bash
npm install -g @asyncapi/generator
```

## Supported parameters

|Name|Description|Required|Default|Allowed values|Example|
|---|---|---|---|---|---|
|frontMatter|The name of a JSON or YAML formatted file containing values to override the default YAML frontmatter.|No|None|Any JSON or YAML formatted file|`slate.yaml`|
|outFilename|The filename of the output file.|No|`asyncapi.md`|*Any* with `.md` extension|`index.md`|
|slate|Include [Slate](https://github/slatedocs/slate) YAML frontmatter in the output markdown. Disables markdown ToC.|No|`false`|`boolean`|`true`|
|version|Override the version of your application provided under `info.version` location in the specification file.|No|Version is taken from the specification file.|Version is taken from the spec file. |`1.0.0`|


## Development

1. Make sure you have the latest generator installed `npm install -g @asyncapi/generator`.
2. Modify the template or it's reusable parts. Adjust `test/spec/asyncapi.yml` to have more complexity if needed.
3. Generate output with watcher enabled by running the command `npm run dev`.
4. Check generated markdown file located in `./test/output/asyncapi.md`.

Parameters for the template are defined in `package.json`.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://www.fmvilas.com"><img src="https://avatars3.githubusercontent.com/u/242119?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Fran Méndez</b></sub></a><br /><a href="https://github.com/asyncapi/markdown-template/commits?author=fmvilas" title="Code">💻</a> <a href="https://github.com/asyncapi/markdown-template/commits?author=fmvilas" title="Documentation">📖</a> <a href="https://github.com/asyncapi/markdown-template/pulls?q=is%3Apr+reviewed-by%3Afmvilas" title="Reviewed Pull Requests">👀</a> <a href="#ideas-fmvilas" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://resume.github.io/?derberg"><img src="https://avatars1.githubusercontent.com/u/6995927?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lukasz Gornicki</b></sub></a><br /><a href="https://github.com/asyncapi/markdown-template/commits?author=derberg" title="Code">💻</a> <a href="https://github.com/asyncapi/markdown-template/commits?author=derberg" title="Documentation">📖</a> <a href="https://github.com/asyncapi/markdown-template/pulls?q=is%3Apr+reviewed-by%3Aderberg" title="Reviewed Pull Requests">👀</a> <a href="#infra-derberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://github.com/ximyro"><img src="https://avatars0.githubusercontent.com/u/1026811?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ilya Buzlov</b></sub></a><br /><a href="https://github.com/asyncapi/markdown-template/commits?author=ximyro" title="Code">💻</a> <a href="https://github.com/asyncapi/markdown-template/issues?q=author%3Aximyro" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://deltaeight.de"><img src="https://avatars1.githubusercontent.com/u/19175262?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Julian Rabe</b></sub></a><br /><a href="https://github.com/asyncapi/markdown-template/commits?author=schw4rzlicht" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/magicmatatjahu"><img src="https://avatars2.githubusercontent.com/u/20404945?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Maciej Urbańczyk</b></sub></a><br /><a href="https://github.com/asyncapi/markdown-template/commits?author=magicmatatjahu" title="Documentation">📖</a> <a href="https://github.com/asyncapi/markdown-template/commits?author=magicmatatjahu" title="Code">💻</a></td>
    <td align="center"><a href="http://blog.ineat-conseil.fr/"><img src="https://avatars.githubusercontent.com/u/5501911?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ludovic Dussart</b></sub></a><br /><a href="https://github.com/asyncapi/markdown-template/commits?author=M3lkior" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
