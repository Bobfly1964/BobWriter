import React from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Lock, Eye, Calendar, User } from 'lucide-react'

interface BookCardProps {
  book: {
    id: string
    title: string
    description?: string | null
    is_private: boolean
    last_updated: string
    user_id: string
  }
  isOwner?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function BookCard({ book, isOwner = false, onEdit, onDelete }: BookCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{book.title}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
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
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        {book.description && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {book.description}
          </p>
        )}
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Updated {formatDate(book.last_updated)}</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button asChild variant="primary" className="flex-1">
          <Link href={`/books/${book.id}`}>
            View Details
          </Link>
        </Button>
        
        {isOwner && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(book.id)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete?.(book.id)}
            >
              Delete
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
} 