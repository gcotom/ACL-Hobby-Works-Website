# ACL Hobby Works (Next.js Full‑Stack)

Custom LEGO® Clone Troopers — shop highlights and custom quotes.

## Quickstart
```bash
npm i
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```
Open http://localhost:3000

## Pages
- `/` Landing
- `/gallery` Showcase
- `/shop` Products (from DB)
- `/quote` Custom Quote form (Server Action → DB)
- `/admin` View submitted quotes
