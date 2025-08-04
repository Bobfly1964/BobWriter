'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Edit, Trash2, Lock, Eye, Calendar, User, Plus } from 'lucide-react'

interface Reader {
  id: string
  name: string
  email: string
}

interface Book {
  id: string
  title: string
  description?: string | null
  is_private: boolean
  last_updated: string
  user_id: string
  book_readers?: {
    reader_id: string
    readers: Reader
  }[]
}

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const bookId = params.id as string

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${bookId}`)
        if (response.ok) {
          const data = await response.json()
          setBook(data)
        } else if (response.status === 404) {
          setError('Book not found')
        } else {
          setError('Failed to load book')
        }
      } catch (error) {
        console.error('Error fetching book:', error)
        setError('Failed to load book')
      } finally {
        setLoading(false)
      }
    }

    if (bookId) {
      fetchBook()
    }
  }, [bookId])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this book?')) return

    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
        },
      })

      if (response.ok) {
        router.push('/books')
      } else {
        console.error('Failed to delete book')
      }
    } catch (error) {
      console.error('Error deleting book:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-500">
                <h3 className="text-lg font-medium mb-2">Book not found</h3>
                <p className="text-gray-400 mb-4">{error}</p>
                <Button asChild>
                  <a href="/books">Back to Books</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const isOwner = user?.id === book.user_id
  const readers = book.book_readers?.map(br => br.readers) || []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Book Details */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-3xl">{book.title}</CardTitle>
                  {book.is_private ? (
                    <Badge variant="warning" className="flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Private
                    </Badge>
                  ) : (
                    <Badge variant="success" className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Public
                    </Badge>
                  )}
                  {isOwner && (
                    <Badge variant="default">Owner</Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Updated {formatDate(book.last_updated)}</span>
                  </div>
                </div>
              </div>

              {isOwner && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/books/${book.id}/edit`)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {book.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {book.description}
                </p>
              </div>
            )}

            {/* Readers Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Readers</h3>
                {isOwner && (
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Reader
                  </Button>
                )}
              </div>

              {readers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {readers.map((reader) => (
                    <Card key={reader.id} className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{reader.name}</h4>
                          <p className="text-sm text-gray-500">{reader.email}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No readers assigned to this book yet.</p>
                  {isOwner && (
                    <p className="text-sm mt-2">Add readers to track who's reading this book.</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 