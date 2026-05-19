# DeepSeek-TUI Cloud

Hosted SaaS landing site for DeepSeek-TUI Cloud, a remote browser workspace layer for terminal-first DeepSeek V4 coding sessions.

## What is included

- React/Vite frontend with conversion-focused home, pricing, privacy, terms, and keyword guide pages.
- Cloudflare Worker with Workers Assets, canonical HTTPS redirects, `/api/runtime`, `/api/checkout`, `/sitemap.xml`, and `/robots.txt`.
- Creem hosted checkout integration with Pro annual selected by default.
- Cloudflare Workers and Pages GitHub Actions workflows.

## Local development

```bash
npm install
npm run dev
```

## Related Project

- [OpenHuman Online](https://openhuman.online/?utm_source=github&utm_medium=readme&utm_campaign=openhuman_public_repos&utm_content=my_deepseek_tui) helps teams turn source material, notes, and meetings into an inspectable AI memory tree for human-reviewed workflows.

## Build

```bash
npm run build
```

## Deploy

```bash
npm run cloudflare:deploy
```

Store the live Creem API key as a Worker secret named `API_PROD_KEY`, `CREEM_API_KEY`, or a Secrets Store binding named `CREEM_KEY`.
