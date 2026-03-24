# Seeking Zima

Personal portfolio site for [Anilkumar Panda](https://anilkumarpanda.com).

Built with Astro, Tailwind CSS, and MDX. Every page features unique generative art seeded by visitor entropy.

## Adding Content

### Add a note

Create `src/content/notes/YYYY-MM-DD.mdx`:

```mdx
---
date: 2026-03-19
---

Your note content here.
```

### Add an article

Create `src/content/writing/your-slug.mdx`:

```mdx
---
title: "Article Title"
date: 2026-03-19
description: "A short description."
tags: ["tag1", "tag2"]
artSeed: 42
---

Article content in MDX.
```

### Add a project

Create `src/content/lab/your-slug.mdx`:

```mdx
---
title: "Project Name"
date: 2026-03-19
description: "What it does."
tech: ["Python", "FastAPI"]
status: "live"
demoUrl: "https://example.com"
githubUrl: "https://github.com/..."
artSeed: 42
---

Project description in MDX.
```

## Development

```sh
npm install
npm run dev
```

## Deploy

Push to [github.com/anilkumarpanda/seekingzima](https://github.com/anilkumarpanda/seekingzima) and Vercel auto-deploys.

### Custom domain

1. Add `anilkumarpanda.com` in Vercel dashboard (Settings > Domains)
2. Copy the DNS records Vercel provides
3. Paste them into Porkbun DNS settings
