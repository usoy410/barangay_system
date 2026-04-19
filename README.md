# Barangay Information System (BIS)

A professional, full-stack digital governance platform designed to automate and streamline Barangay operations. From resident management to real-time document issuance, BIS empowers local officials with modern digital tools.

## ✨ Key Features

- **📂 Resident Registry 2.0**: Comprehensive member management with support for demographics, occupation tracking, and household grouping.
- **📄 Document Automation**: High-fidelity document generation using Microsoft Word (`.docx`) templates.
- **👁️ Real-time Preview**: Instant visualization of populated documents via high-fidelity cloud previewing.
- **🚨 Incident Reporting**: Community-driven reporting system for tracking and resolving local issues.
- **📢 Community Alerts**: Real-time announcements and emergency notifications.
- **🛡️ Secure & Ethical**: Built with Supabase Row Level Security (RLS) and comprehensive audit logging for data privacy.
- **⚙️ Template Manager**: Centralized admin interface for managing official document formats.

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database/Auth**: [Supabase](https://supabase.com/) (PostgreSQL & GoTrue)
- **Document Engine**: [docxtemplater](https://docxtemplater.com/) & [PizZip](https://pizzip.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📁 Project Structure

```text
src/
├── app/            # Next.js App Router (Routes & Server Components)
├── components/     # UI Components (Admin, Services, Residents)
├── hooks/          # Reusable React logic
├── lib/            # Business logic (Supabase, Doc Gen, Storage)
└── types/          # TypeScript Schema & Interface definitions
```

## 🛠 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Set up Environment Variables**: Create a `.env.local` file with your credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
   ```

4. **Database Setup**: Run the contents of `supabase_schema.sql` in your Supabase SQL Editor.
5. **Run the dev server**: `npm run dev`

---

&copy; 2026 Barangay Information System. Built for efficient, paperless local governance.
