import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from './supabase'

export async function getUser(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

export async function requireAuth(req: NextRequest) {
  const user = await getUser(req)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  return user
}

export async function getUserId(req: NextRequest) {
  const user = await getUser(req)
  return user?.id
} 