# clock

Next.js + Tailwind CSS + shadcn/ui + TypeScript app with Prisma, bundled with reusable mini-services, examples, and DB scaffolding.

## Stack
- Next.js (standalone build), React, TypeScript
- Tailwind CSS, shadcn/ui (`components.json`), Radix UI
- Prisma ORM (`prisma/`, `db/`)
- Bun (`bun.lock`)

## Getting Started
```bash
npm install   # or bun install
cp .env.example .env  # if present, otherwise create .env (never commit it)
npx prisma generate
npx prisma db push
npm run dev   # http://localhost:3000
```

Build / production:
```bash
npm run build
npm start
```

## Project Structure
- `src/` — app source
- `prisma/` + `db/` — schema and DB helpers
- `public/` — static assets
- `mini-services/`, `examples/`, `download/` — shared services and generated files
- `.zscripts/` — dev/build helpers

## Environment & Secrets
- `.env*` is gitignored. Copy from `.env.example` and fill locally.
- `*.pem`, `*.key` are ignored — never commit credentials.

## License
Proprietary / check repo for LICENSE.
