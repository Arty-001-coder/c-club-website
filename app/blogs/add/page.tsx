'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Save, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { createBlogPost, uploadBlogImage } from '@/lib/supabase';
import Image from 'next/image';

interface BlogFormData {
  title: string;
  excerpt: string;
  full_content: string;
  author: string;
  read_time: string;
  category: string;
}

export default function AddBlogPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    excerpt: '',
    full_content: '',
    author: '',
    read_time: '',
    category: 'Technology'
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const categories = [
    'Technology',
    'Research', 
    'Innovation',
    'Community'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (50MB = 50 * 1024 * 1024 bytes)
      if (file.size > 50 * 1024 * 1024) {
        setError('Image size must be less than 50MB');
        return;
      }

      setSelectedImage(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.excerpt.trim()) {
      setError('Excerpt is required');
      return false;
    }
    if (!formData.full_content.trim()) {
      setError('Full content is required');
      return false;
    }
    if (!formData.author.trim()) {
      setError('Author is required');
      return false;
    }
    if (!formData.read_time.trim()) {
      setError('Read time is required');
      return false;
    }
    if (!selectedImage) {
      setError('Please select an image for the blog post');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, create the blog post in the database
      const blogPost = await createBlogPost(formData);
      
      if (!blogPost?.id) {
        throw new Error('Failed to create blog post');
      }

      // Then upload the image using the blog post ID
      if (selectedImage) {
        const fileExtension = selectedImage.name.split('.').pop() || 'jpg';
        await uploadBlogImage(blogPost.id, selectedImage, fileExtension);
      }

      setSuccess(true);
      
      // Redirect to blogs page after a short delay
      setTimeout(() => {
        router.push('/blogs');
      }, 2000);

    } catch (err) {
      console.error('Error creating blog post:', err);
      setError(err instanceof Error ? err.message : 'Failed to create blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/blogs');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center" style={{backgroundImage: "url('/images/blog.jpg')"}}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Blog Post Created!</h1>
          <p className="text-gray-300 text-lg mb-6">Your blog post has been successfully created and published.</p>
          <p className="text-gray-400">Redirecting to blogs page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{backgroundImage: "url('/images/blog.jpg')"}}>
      <div className="absolute inset-0 bg-black/20 "></div>
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Blogs</span>
          </button>
          
          <h1 className="text-3xl font-bold text-white">Add New Blog Post</h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-black/20 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {/* Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-white font-semibold mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-black/30 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="Enter your blog title..."
                required
              />
            </div>

            {/* Author and Read Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="author" className="block text-white font-semibold mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full bg-black/30 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Author name..."
                  required
                />
              </div>
              
              <div>
                <label htmlFor="read_time" className="block text-white font-semibold mb-2">
                  Read Time *
                </label>
                <input
                  type="text"
                  id="read_time"
                  name="read_time"
                  value={formData.read_time}
                  onChange={handleInputChange}
                  className="w-full bg-black/30 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="e.g., 5 min read"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="mb-6">
              <label htmlFor="category" className="block text-white font-semibold mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-black/30 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Excerpt */}
            <div className="mb-6">
              <label htmlFor="excerpt" className="block text-white font-semibold mb-2">
                Excerpt *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-black/30 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                placeholder="Write a brief excerpt for your blog post..."
                required
              />
            </div>

            {/* Full Content */}
            <div className="mb-6">
              <label htmlFor="full_content" className="block text-white font-semibold mb-2">
                Full Content *
              </label>
              <textarea
                id="full_content"
                name="full_content"
                value={formData.full_content}
                onChange={handleInputChange}
                rows={12}
                className="w-full bg-black/30 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                placeholder="Write the full content of your blog post..."
                required
              />
            </div>

            {/* Image Upload */}
            <div className="mb-8">
              <label className="block text-white font-semibold mb-2">
                Blog Image *
              </label>
              <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <Image
                        src={imagePreview} 
                        alt="Preview"
                        fill 
                        className="max-w-full max-h-64 mx-auto rounded-lg"
                      />
                      <p className="text-gray-300">Click to change image</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-white font-semibold">Click to upload image</p>
                        <p className="text-gray-400 text-sm">or drag and drop</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <p className="text-yellow-300 text-sm">Maximum file size: 50MB</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Post...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Create Blog Post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}