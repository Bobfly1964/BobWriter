import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth, getUserId } from '@/lib/auth'
import { updateBookSchema, bookIdSchema } from '@/lib/validation'

// GET /api/books/[id] - Get a specific book
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = bookIdSchema.parse(params)
    const userId = await getUserId(req)

    let queryBuilder = supabaseAdmin
      .from('books')
      .select(`
        *,
        book_readers!inner(
          reader_id,
          readers!inner(id, name, email)
        )
      `)
      .eq('id', id)

    // Apply RLS-like filtering
    if (userId) {
      queryBuilder = queryBuilder.or(`user_id.eq.${userId},is_private.eq.false`)
    } else {
      queryBuilder = queryBuilder.eq('is_private', false)
    }

    const { data: book, error } = await queryBuilder.single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Book not found' },
          { status: 404 }
        )
      }
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch book' },
        { status: 500 }
      )
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Invalid book ID' },
      { status: 400 }
    )
  }
}

// PUT /api/books/[id] - Update a book
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(req)
    if (user instanceof NextResponse) return user

    const { id } = bookIdSchema.parse(params)
    const body = await req.json()
    const validatedData = updateBookSchema.parse(body)

    // Check if user owns the book
    const { data: existingBook, error: fetchError } = await supabaseAdmin
      .from('books')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !existingBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    if (existingBook.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to update this book' },
        { status: 403 }
      )
    }

    const { data: book, error } = await supabaseAdmin
      .from('books')
      .update({
        ...validatedData,
        last_updated: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update book' },
        { status: 500 }
      )
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error('API error:', error)
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid book data' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/books/[id] - Delete a book
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(req)
    if (user instanceof NextResponse) return user

    const { id } = bookIdSchema.parse(params)

    // Check if user owns the book
    const { data: existingBook, error: fetchError } = await supabaseAdmin
      .from('books')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !existingBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    if (existingBook.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this book' },
        { status: 403 }
      )
    }

    const { error } = await supabaseAdmin
      .from('books')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to delete book' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Book deleted successfully' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Invalid book ID' },
      { status: 400 }
    )
  }
} 