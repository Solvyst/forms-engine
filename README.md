# Solvyst Forms Engine

Monorepo for a server-driven forms engine and its adapters.

## Packages

| Package | Description |
| --- | --- |
| [`@solvyst/forms-engine-core`](packages/forms-engine-core) | Framework-agnostic form schema + validation engine. |
| [`@solvyst/forms-engine-express`](packages/forms-engine-express) | Express adapter for the core engine. |

## Repository layout

```
packages/
  forms-engine-core/
  forms-engine-express/
```

## Getting started

```bash
pnpm install
```

## Scripts

```bash
pnpm build   # build all packages
pnpm dev     # watch all packages
pnpm test    # run tests (core only currently)
```

## Usage

See the package READMEs for full API docs and examples:
- `packages/forms-engine-core/README.md`
- `packages/forms-engine-express/README.md`

## License

MIT © Anil Moharana
