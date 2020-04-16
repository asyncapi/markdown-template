# Markdown template for the AsyncAPI Generator

## Usage

```
ag asyncapi.yaml @asyncapi/markdown-template -o output
```

If you don't have the AsyncAPI Generator installed, you can install it like this:

```
npm install -g @asyncapi/generator
```

## Development

1. Make sure you have the latest generator installed `npm install -g @asyncapi/generator`.
1. Modify the template or it's helper functions. Adjust `test/spec/asyncapi.yml` to have more features if needed.
1. Generate output with watcher enables `npm run develop`.
1. Check generated markdown file located in `./test/output/asyncapi.md`.