import { z } from 'zod'

// Book validation schemas
export const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().optional(),
  is_private: z.boolean().default(false),
})

export const updateBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long').optional(),
  description: z.string().optional(),
  is_private: z.boolean().optional(),
})

export const bookIdSchema = z.object({
  id: z.string().uuid('Invalid book ID'),
})

// Reader validation schemas
export const createReaderSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
})

export const updateReaderSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  email: z.string().email('Invalid email address').optional(),
})

export const readerIdSchema = z.object({
  id: z.string().uuid('Invalid reader ID'),
})

// Book-Reader relationship validation schemas
export const addReaderToBookSchema = z.object({
  book_id: z.string().uuid('Invalid book ID'),
  reader_id: z.string().uuid('Invalid reader ID'),
})

export const removeReaderFromBookSchema = z.object({
  book_id: z.string().uuid('Invalid book ID'),
  reader_id: z.string().uuid('Invalid reader ID'),
})

// Auth validation schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Query parameter schemas
export const booksQuerySchema = z.object({
  filter: z.enum(['all', 'my', 'public']).default('all'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
})

export type CreateBookInput = z.infer<typeof createBookSchema>
export type UpdateBookInput = z.infer<typeof updateBookSchema>
export type CreateReaderInput = z.infer<typeof createReaderSchema>
export type UpdateReaderInput = z.infer<typeof updateReaderSchema>
export type AddReaderToBookInput = z.infer<typeof addReaderToBookSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type BooksQueryInput = z.infer<typeof booksQuerySchema> 