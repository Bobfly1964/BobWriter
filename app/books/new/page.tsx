'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, BookOpen, Lock, Eye } from 'lucide-react'

export default function NewBookPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if not authenticated
  if (!user) {
    router.push('/auth/signin')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({
          title,
          description: description || null,
          is_private: isPrivate,
        }),
      })

      if (response.ok) {
        const book = await response.json()
        router.push(`/books/${book.id}`)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create book')
      }
    } catch (error) {
      console.error('Error creating book:', error)
      setError('Failed to create book')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-6 w-6 text-primary-600" />
              <CardTitle className="text-2xl">Add New Book</CardTitle>
            </div>
            <CardDescription>
              Add a new book to your collection. You can make it private or public.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Book Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter the book title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter a description of the book (optional)"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Provide a brief description to help others understand what the book is about.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Privacy Settings
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="privacy"
                      value="public"
                      checked={!isPrivate}
                      onChange={() => setIsPrivate(false)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium">Public</div>
                        <div className="text-sm text-gray-500">
                          Anyone can see this book in the public collection
                        </div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="privacy"
                      value="private"
                      checked={isPrivate}
                      onChange={() => setIsPrivate(true)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-orange-600" />
                      <div>
                        <div className="font-medium">Private</div>
                        <div className="text-sm text-gray-500">
                          Only you can see this book
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  loading={loading}
                  disabled={loading || !title.trim()}
                >
                  Create Book
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 