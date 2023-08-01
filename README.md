# Markdown template for the AsyncAPI Generator

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-11-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Usage](#usage)
- [Supported parameters](#supported-parameters)
- [Development](#development)
- [Contributors ✨](#contributors-%E2%9C%A8)

<!-- tocstop -->

## Usage

Install AsyncAPI CLI

```bash
npm install -g @asyncapi/cli
```

Generate using CLI 

```bash
asyncapi generate fromTemplate <asyncapi.yaml> @asyncapi/markdown-template@1.2.1
```

You can replace `<asyncapi.yaml>` with local path or URL pointing to [any AsyncAPI document](https://raw.githubusercontent.com/asyncapi/spec/master/examples/streetlights-kafka.yml).
Look into [Releases](/asyncapi/markdown-template/releases) of this template to pick up the version you need. It is not recommended to always use the latest in production. Always use a specific version.

## Supported parameters

|Name|Description|Required|Default|Allowed values|Example|
|---|---|---|---|---|---|
|frontMatter|The name of a JSON or YAML formatted file containing values to provide the YAML frontmatter for static-site or documentation generators, just like [this](test/spec/ssg.yaml) one. The file may contain {{title}} and {{version}} tags. They are replaced with information for the AsyncAPI document that is under `info.title` and `info.version`. You can overwrite the version with `version` parameter. [Here](test/spec/slate.yaml) you can see an example that uses tags in frontmatter compatible with [slate](https://github.com/Slatedocs/Slate) |No|None|Any JSON or YAML formatted file|`slate.yaml`|
|outFilename|The filename of the output file.|No|`asyncapi.md`|*Any* with `.md` extension|`index.md`|
|toc|Include a Table-of-Contents in the output markdown.|No|`true`|`boolean`|`false`|
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
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.fmvilas.com"><img src="https://avatars3.githubusercontent.com/u/242119?v=4?s=100" width="100px;" alt="Fran Méndez"/><br /><sub><b>Fran Méndez</b></sub></a><br /><a href="https://github.com/asyncapi/markdown-template/commits?author=fmvilas" title="Code">💻</a> <a href="https://github.com/asyncapi/markdown-template/commits?author=fmvilas" title="Documentation">📖</a> <a href="https://github.com/asyncapi/markdown-template/pulls?q=is%3Apr+reviewed-by%3Afmvilas" title="Reviewed Pull Requests">👀</a> <a href="#ideas-fmvilas" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-fmvilas" title="Maintenance">🚧</a> <a href="https://github.com/asyncapi/markdown-template/issues?q=author%3Afmvilas" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/markdown-template/commits?author=fmvilas" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://resume.github.io/?derberg"><img src="https://avatars1.githubusercontent.com/u/6995927?v=4?s=100" width="100px;" alt="Lukasz Gornicki"/><br /><sub><b>Lukasz Gornicki</b></sub></a><br /><a href="https://github.com/asyncapi/markdown-template/commits?author=derberg" title="Code">💻</a> <a href="https://github.com/asyncapi/markdown-template/commits?author=derberg" title="Documentation">📖</a> <a href="https://github.com/asyncapi/markdown-template/pulls?q=is%3Apr+reviewed-by%3Aderberg" title="Reviewed Pull Requests">👀</a> <a href="#infra-derberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-derberg" title="Maintenance">🚧</a> <a href="https://github.com/asyncapi/markdown-template/issues?q=author%3Aderberg" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/markdown-template/commits?author=derberg" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ximyro"><img src="https://avatars0.githubusercontent.com/u/1026811?v=4?s=100" width="100px;" alt="Ilya Buzlov"/><br /><sub><b>Ilya Buzlov</b></sub></a><br /><a href="https://github.com/asyncapi/markdown-template/commits?author=ximyro" title="Code">💻</a> <a href="https://github.com/asyncapi/markdown-template/issues?q=author%3Aximyro" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://deltaeight.de"><img src="https://avatars1.githubusercontent.com/u/19175262?v=4?s=100" width="100px;" alt="Julian Rabe"/><br /><sub><b>Julian Rabe</b></sub></a><br /><a href="https://github.com/asyncapi/markdown-template/commits?author=schw4rzlicht" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/magicmatatjahu"><img src="https://avatars2.githubusercontent.com/u/20404945?v=4?s=100" width="100px;" alt="Maciej Urbańczyk"/><br /><sub><b>Maciej Urbańczyk</b></sub></a><br /><a href="https://github.com/asyncapi/markdown-template/commits?author=magicmatatjahu" title="Documentation">📖</a> <a href="https://github.com/asyncapi/markdown-template/commits?author=magicmatatjahu" title="Code">💻</a> <a href="#maintenance-magicmatatjahu" title="Maintenance">🚧</a> <a href="https://github.com/asyncapi/markdown-template/issues?q=author%3Amagicmatatjahu" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/markdown-template/pulls?q=is%3Apr+reviewed-by%3Amagicmatatjahu" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/markdown-template/commits?author=magicmatatjahu" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://blog.ineat-conseil.fr/"><img src="https://avatars.githubusercontent.com/u/5501911?v=4?s=100" width="100px;" alt="Ludovic Dussart"/><br /><sub><b>Ludovic Dussart</b></sub></a><br /><a href="https://github.com/asyncapi/markdown-template/commits?author=M3lkior" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://mermade.github.io"><img src="https://avatars.githubusercontent.com/u/21603?v=4?s=100" width="100px;" alt="Mike Ralphson"/><br /><sub><b>Mike Ralphson</b></sub></a><br /><a href="https://github.com/asyncapi/markdown-template/commits?author=MikeRalphson" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/stuartforrest-infinity"><img src="https://avatars.githubusercontent.com/u/49638642?v=4?s=100" width="100px;" alt="stuartforrest-infinity"/><br /><sub><b>stuartforrest-infinity</b></sub></a><br /><a href="https://github.com/asyncapi/markdown-template/issues?q=author%3Astuartforrest-infinity" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/markdown-template/commits?author=stuartforrest-infinity" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://dalelane.co.uk/"><img src="https://avatars.githubusercontent.com/u/1444788?v=4?s=100" width="100px;" alt="Dale Lane"/><br /><sub><b>Dale Lane</b></sub></a><br /><a href="https://github.com/asyncapi/markdown-template/commits?author=dalelane" title="Code">💻</a> <a href="#ideas-dalelane" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/GerMichael"><img src="https://avatars.githubusercontent.com/u/62344871?v=4?s=100" width="100px;" alt="Michael Gerischer"/><br /><sub><b>Michael Gerischer</b></sub></a><br /><a href="https://github.com/asyncapi/markdown-template/commits?author=GerMichael" title="Code">💻</a> <a href="https://github.com/asyncapi/markdown-template/issues?q=author%3AGerMichael" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/markdown-template/commits?author=GerMichael" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Arya-Gupta"><img src="https://avatars.githubusercontent.com/u/84087089?v=4?s=100" width="100px;" alt="Arya Gupta"/><br /><sub><b>Arya Gupta</b></sub></a><br /><a href="https://github.com/asyncapi/markdown-template/commits?author=Arya-Gupta" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
