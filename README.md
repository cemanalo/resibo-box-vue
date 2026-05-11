# Resibo Box

A modern receipt scanning and management application built with Vue 3, TypeScript, and Supabase. Resibo Box allows users to upload, scan, and organize their receipts using OCR technology.

## Features

- **Receipt Scanning**: Upload receipt images and extract text using Tesseract.js OCR
- **User Authentication**: Secure authentication system powered by Supabase Auth
- **Data Management**: Store and organize receipt information in a structured database
- **Dashboard**: View metrics and analytics for your receipts
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Type Safety**: Full TypeScript support throughout the application

## Tech Stack

- **Frontend**: Vue 3 with Composition API and `<script setup>`
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **OCR**: Tesseract.js
- **Routing**: Vue Router 5

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase project (for backend services)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resibo-box-vue
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   
   Run the migration script in your Supabase SQL editor:
   ```sql
   -- See supabase/migrations/20240511000000_create_receipts_table.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   │   ├── AuthGuard.vue
│   │   ├── LoginForm.vue
│   │   └── RegisterForm.vue
│   ├── scan-receipts/     # Receipt scanning components
│   │   ├── OCRResults.vue
│   │   └── UploadSection.vue
│   └── shared/            # Shared components
├── composables/           # Vue composables
│   ├── useAuth.ts
│   └── useCredits.ts
├── config/                # Configuration files
│   └── supabase.ts
├── pages/                 # Page components
└── assets/                # Static assets
```

## Database Schema

The application uses a `receipts` table with the following structure:

- `id`: UUID primary key
- `batch_id`: UUID for grouping receipts
- `user_id`: UUID referencing the authenticated user
- `provider`: Receipt provider/company name
- `reference_number`: Transaction reference
- `amount`: Transaction amount
- `sender`: Sender information
- `raw_text`: Extracted OCR text
- `created_at`/`updated_at`: Timestamps

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure code quality
5. Submit a pull request

## License

This project is licensed under the MIT License.
