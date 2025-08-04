import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth, getUserId } from '@/lib/auth'
import { createBookSchema, booksQuerySchema } from '@/lib/validation'

// GET /api/books - List books with filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = booksQuerySchema.parse({
      filter: searchParams.get('filter'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    })

    const userId = await getUserId(req)
    let queryBuilder = supabaseAdmin
      .from('books')
      .select('*')
      .order('last_updated', { ascending: false })

    // Apply filters based on user authentication and filter type
    if (query.filter === 'my') {
      if (!userId) {
        return NextResponse.json(
          { error: 'Authentication required for my books' },
          { status: 401 }
        )
      }
      queryBuilder = queryBuilder.eq('user_id', userId)
    } else if (query.filter === 'public') {
      queryBuilder = queryBuilder.eq('is_private', false)
    } else {
      // 'all' filter - show user's books + public books
      if (userId) {
        queryBuilder = queryBuilder.or(`user_id.eq.${userId},is_private.eq.false`)
      } else {
        queryBuilder = queryBuilder.eq('is_private', false)
      }
    }

    // Apply pagination
    const from = (query.page - 1) * query.limit
    const to = from + query.limit - 1
    queryBuilder = queryBuilder.range(from, to)

    const { data: books, error, count } = await queryBuilder

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch books' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      books,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: count || 0,
      }
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Invalid request parameters' },
      { status: 400 }
    )
  }
}

// POST /api/books - Create a new book
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    if (user instanceof NextResponse) return user

    const body = await req.json()
    const validatedData = createBookSchema.parse(body)

    const { data: book, error } = await supabaseAdmin
      .from('books')
      .insert({
        ...validatedData,
        user_id: user.id,
        last_updated: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create book' },
        { status: 500 }
      )
    }

    return NextResponse.json(book, { status: 201 })
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