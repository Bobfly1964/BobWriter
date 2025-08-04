import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createReaderSchema } from '@/lib/validation'

// GET /api/readers - List all readers
export async function GET(req: NextRequest) {
  try {
    const { data: readers, error } = await supabaseAdmin
      .from('readers')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch readers' },
        { status: 500 }
      )
    }

    return NextResponse.json({ readers })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/readers - Create a new reader
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = createReaderSchema.parse(body)

    const { data: reader, error } = await supabaseAdmin
      .from('readers')
      .insert(validatedData)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Reader with this email already exists' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to create reader' },
        { status: 500 }
      )
    }

    return NextResponse.json(reader, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid reader data' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 