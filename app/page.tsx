import React from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { BookOpen, Shield, Users, Search, Plus, Eye } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Your Personal
              <span className="text-primary-600"> BookVault</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Secure, organize, and share your book collection. Keep your private books safe while discovering amazing reads from the community.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/books">
                <Button size="lg" className="w-full sm:w-auto">
                  <Eye className="mr-2 h-5 w-5" />
                  Browse Books
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Plus className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose BookVault?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to manage your personal library
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary-600 mb-4" />
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Keep your private books safe with our secure authentication system. Only you can access your private collection.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary-600 mb-4" />
                <CardTitle>Community Sharing</CardTitle>
                <CardDescription>
                  Share your public books with the community and discover amazing reads from other book lovers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Search className="h-12 w-12 text-primary-600 mb-4" />
                <CardTitle>Easy Discovery</CardTitle>
                <CardDescription>
                  Find books by title, description, or browse through public collections. Advanced filtering makes discovery effortless.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary-600 mb-4" />
                <CardTitle>Organize Your Library</CardTitle>
                <CardDescription>
                  Add descriptions, track readers, and organize your books with our intuitive management system.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Plus className="h-12 w-12 text-primary-600 mb-4" />
                <CardTitle>Simple Management</CardTitle>
                <CardDescription>
                  Add, edit, and delete books with ease. Our clean interface makes library management a breeze.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Eye className="h-12 w-12 text-primary-600 mb-4" />
                <CardTitle>Reader Tracking</CardTitle>
                <CardDescription>
                  Keep track of who's reading your books and manage reader relationships with our built-in system.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Start Your BookVault?
            </h2>
            <p className="mt-4 text-xl text-primary-100">
              Join thousands of book lovers who trust BookVault to manage their collections.
            </p>
            <div className="mt-8">
              <Link href="/auth/signup">
                <Button variant="secondary" size="lg">
                  Create Your Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-white">BookVault</span>
            </div>
            <p className="text-gray-400">
              © 2024 BookVault. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 