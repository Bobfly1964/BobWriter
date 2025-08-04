-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create tables
CREATE TABLE IF NOT EXISTS public.books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT false,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.readers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.book_readers (
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    reader_id UUID REFERENCES public.readers(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (book_id, reader_id)
);

-- Enable Row Level Security
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_readers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for books
CREATE POLICY "Users can view their own books" ON public.books
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public books" ON public.books
    FOR SELECT USING (is_private = false);

CREATE POLICY "Users can insert their own books" ON public.books
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books" ON public.books
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books" ON public.books
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for readers
CREATE POLICY "Users can view all readers" ON public.readers
    FOR SELECT USING (true);

CREATE POLICY "Users can insert readers" ON public.readers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update readers" ON public.readers
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete readers" ON public.readers
    FOR DELETE USING (true);

-- RLS Policies for book_readers
CREATE POLICY "Users can view book readers for their books" ON public.book_readers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.books 
            WHERE books.id = book_readers.book_id 
            AND (books.user_id = auth.uid() OR books.is_private = false)
        )
    );

CREATE POLICY "Users can insert book readers for their books" ON public.book_readers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.books 
            WHERE books.id = book_readers.book_id 
            AND books.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete book readers for their books" ON public.book_readers
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.books 
            WHERE books.id = book_readers.book_id 
            AND books.user_id = auth.uid()
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_user_id ON public.books(user_id);
CREATE INDEX IF NOT EXISTS idx_books_is_private ON public.books(is_private);
CREATE INDEX IF NOT EXISTS idx_book_readers_book_id ON public.book_readers(book_id);
CREATE INDEX IF NOT EXISTS idx_book_readers_reader_id ON public.book_readers(reader_id);

-- Insert sample data (optional)
INSERT INTO public.readers (name, email) VALUES 
    ('John Doe', 'john@example.com'),
    ('Jane Smith', 'jane@example.com'),
    ('Bob Johnson', 'bob@example.com')
ON CONFLICT (email) DO NOTHING; 