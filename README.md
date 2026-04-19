# Barangay Information System (BIS)

A localized full-stack web application designed to digitize Barangay operations, including resident management, document automation (Clearances/Indigency), and incident reporting.

## 🚀 Built With

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database/Auth**: [Supabase](https://supabase.com/) & [PostgreSQL](https://www.postgresql.org/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)

## 📁 Project Structure

```text
src/
├── app/            # Next.js App Router (pages and layouts)
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions, Supabase client
└── types/          # TypeScript interfaces and types
```

## 🛠 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`

3. **Set up Environment Variables**: Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

4. **Run the dev server**: `npm run dev`

## ⚖️ Development Standards

All contributions must follow the [DEVELOPMENT_RULES.md](./DEVELOPMENT_RULES.md) for documentation, code modularity, and performance optimization.
