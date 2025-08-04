# BookVault - Personal Library Management System

A full-stack web application for managing your personal book collection with secure authentication, privacy controls, and reader tracking. Built with Next.js, Supabase, and TailwindCSS.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure sign-up/sign-in with Supabase Auth
- **Book Management**: Create, read, update, and delete books
- **Privacy Controls**: Mark books as private or public
- **Reader Tracking**: Assign readers to books and track who's reading what
- **Search & Filtering**: Find books by title, description, or filter by ownership/privacy
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Security Features
- **Row Level Security (RLS)**: Database-level security policies
- **Authentication Protection**: API routes protected with JWT tokens
- **Private Books**: Only owners can view their private books
- **Input Validation**: Zod schemas for all data validation

### User Experience
- **Modern UI**: Clean, intuitive interface with TailwindCSS
- **Real-time Updates**: Instant feedback on user actions
- **Loading States**: Smooth loading indicators throughout the app
- **Error Handling**: Comprehensive error messages and validation

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **Zod**: Schema validation

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **Supabase**: Database and authentication
- **PostgreSQL**: Relational database
- **Row Level Security**: Database security policies

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- A Supabase account (free tier works)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bookvault
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and API keys

2. **Configure Environment Variables**:
   - Copy `env.example` to `.env.local`
   - Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

3. **Set Up Database Schema**:
   - Go to your Supabase dashboard
   - Navigate to the SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Execute the SQL script

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Database Schema

### Tables

#### `books`
- `id` (UUID, Primary Key)
- `title` (TEXT, Required)
- `description` (TEXT, Optional)
- `is_private` (BOOLEAN, Default: false)
- `last_updated` (TIMESTAMP)
- `created_at` (TIMESTAMP)
- `user_id` (UUID, Foreign Key to auth.users)

#### `readers`
- `id` (UUID, Primary Key)
- `name` (TEXT, Required)
- `email` (TEXT, Required, Unique)
- `created_at` (TIMESTAMP)

#### `book_readers`
- `book_id` (UUID, Foreign Key to books)
- `reader_id` (UUID, Foreign Key to readers)
- `created_at` (TIMESTAMP)
- Primary Key: (book_id, reader_id)

### Row Level Security Policies

- **Books**: Users can only view their own books or public books
- **Readers**: All authenticated users can manage readers
- **Book Readers**: Users can only manage readers for their own books

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Books
- `GET /api/books` - List books with filtering
- `POST /api/books` - Create a new book
- `GET /api/books/[id]` - Get book details
- `PUT /api/books/[id]` - Update a book
- `DELETE /api/books/[id]` - Delete a book

### Readers
- `GET /api/readers` - List all readers
- `POST /api/readers` - Create a new reader

## 🎨 UI Components

The application includes reusable UI components:

- **Button**: Multiple variants (primary, secondary, outline, destructive)
- **Card**: Content containers with header, content, and footer sections
- **Badge**: Status indicators with different variants
- **BookCard**: Specialized card for displaying book information

## 🔐 Authentication Flow

1. **Sign Up**: Users create accounts with email/password
2. **Email Verification**: Supabase sends verification emails
3. **Sign In**: Users authenticate with credentials
4. **Session Management**: JWT tokens handle authentication state
5. **API Protection**: All book operations require valid authentication

## 📱 Pages

### Public Pages
- **Home** (`/`): Landing page with features and call-to-action
- **Books** (`/books`): Browse all accessible books with filtering
- **Book Details** (`/books/[id]`): View book information and readers

### Authentication Pages
- **Sign In** (`/auth/signin`): User login form
- **Sign Up** (`/auth/signup`): User registration form

### Protected Pages
- **Add Book** (`/books/new`): Create new book form
- **Edit Book** (`/books/[id]/edit`): Edit existing book (planned)

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**:
   - Push your code to GitHub
   - Connect your repository to Vercel

2. **Environment Variables**:
   - Add your Supabase environment variables in Vercel dashboard

3. **Deploy**:
   - Vercel will automatically deploy on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Project Structure

```
bookvault/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── books/             # Book-related pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── BookCard.tsx      # Book display component
│   └── Navigation.tsx    # Navigation component
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utility libraries
│   ├── auth.ts          # Authentication utilities
│   ├── supabase.ts      # Supabase client
│   ├── utils.ts         # General utilities
│   └── validation.ts    # Zod validation schemas
├── supabase/            # Database schema
│   └── schema.sql       # SQL schema file
└── public/              # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-repo/bookvault/issues) page
2. Create a new issue with detailed information
3. Include your environment details and error messages

## 🎯 Roadmap

- [ ] Book editing functionality
- [ ] Advanced search with filters
- [ ] Book categories and tags
- [ ] Reading progress tracking
- [ ] Book recommendations
- [ ] Social features (likes, comments)
- [ ] Export/import functionality
- [ ] Mobile app (React Native)

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend-as-a-service
- [Next.js](https://nextjs.org) for the excellent React framework
- [TailwindCSS](https://tailwindcss.com) for the utility-first CSS framework
- [Lucide](https://lucide.dev) for the beautiful icons 