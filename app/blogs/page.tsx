'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import DashboardLayout from '@/components/DashboardLayout';
import { Calendar, User, Loader2, Plus, ExternalLink } from 'lucide-react';
import { fetchBlogPosts, fetchPostsByCategory, getBlogImageUrl, BlogPost } from '@/lib/supabase';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Posts' },
    { id: 'Technology', label: 'Technology' },
    { id: 'Research', label: 'Research' },
    { id: 'Innovation', label: 'Innovation' },
    { id: 'Community', label: 'Community' }
  ];

  // Fetch blog posts on component mount
  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const posts = await fetchBlogPosts();
        setBlogPosts(posts);
        
        // Set the first blog post as selected when page loads
        if (posts.length > 0) {
          setSelectedPost(posts[0]);
        }
      } catch (err) {
        console.error('Error loading blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  // Filter posts by category
  useEffect(() => {
    const filterPosts = async () => {
      if (selectedCategory === 'all') {
        const posts = await fetchBlogPosts();
        setBlogPosts(posts);
      } else {
        const posts = await fetchPostsByCategory(selectedCategory);
        setBlogPosts(posts);
      }
    };

    if (!loading) {
      filterPosts();
    }
  }, [selectedCategory, loading]);

  // Get image URL for a blog post using the ID
  const getPostImageUrl = (post: BlogPost): string => {
    return getBlogImageUrl(post.id, 'jpg');
  };

  // Get truncated content for preview (first 150 words)
  const getTruncatedContent = (content: string): string => {
    const words = content.split(' ');
    if (words.length <= 150) {
      return content;
    }
    return words.slice(0, 150).join(' ') + '...';
  };

  // Function to open full article in new page
  const openFullArticle = (post: BlogPost) => {
    const fullArticleHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${post.title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.7;
            color: white;
            min-height: 100vh;
            background-image: url('${getPostImageUrl(post)}');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            position: relative;
          }
          
          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(8px);
            z-index: 1;
          }
          
          .content-wrapper {
            position: relative;
            z-index: 2;
            max-width: 1200px;
            margin: 0 auto;
            padding: 4rem 2rem;
            min-height: 100vh;
          }
          
          .category {
            background: linear-gradient(135deg, #8b5cf6, #3b82f6);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 700;
            display: inline-block;
            margin-bottom: 2rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .title {
            font-size: 4rem;
            font-weight: 900;
            margin-bottom: 2rem;
            line-height: 1.1;
            text-shadow: 0 8px 16px rgba(0, 0, 0, 0.8);
            background: linear-gradient(135deg, #ffffff, #e0e7ff);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          
          .meta {
            display: flex;
            align-items: center;
            gap: 2rem;
            margin-bottom: 3rem;
            flex-wrap: wrap;
          }
          
          .author-info {
            display: flex;
            align-items: center;
            gap: 1rem;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(10px);
            padding: 1rem 1.5rem;
            border-radius: 9999px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .avatar {
            width: 3rem;
            height: 3rem;
            background: linear-gradient(135deg, #8b5cf6, #3b82f6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            border: 2px solid rgba(255, 255, 255, 0.2);
          }
          
          .date-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(10px);
            padding: 1rem 1.5rem;
            border-radius: 9999px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #d1d5db;
          }
          
          .content {
            font-size: 1.25rem;
            line-height: 1.8;
            white-space: pre-line;
            color: #f9fafb;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
            background: rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(5px);
            padding: 3rem;
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }
          
          .close-btn {
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: linear-gradient(135deg, #8b5cf6, #3b82f6);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 1rem 2rem;
            border-radius: 9999px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 1000;
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          
          .close-btn:hover {
            background: linear-gradient(135deg, #a855f7, #2563eb);
            transform: scale(1.05);
            box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
          }
          
          @media (max-width: 768px) {
            .content-wrapper {
              padding: 2rem 1rem;
            }
            
            .title {
              font-size: 2.5rem;
            }
            
            .meta {
              flex-direction: column;
              align-items: stretch;
              gap: 1rem;
            }
            
            .author-info,
            .date-info {
              justify-content: center;
            }
            
            .content {
              padding: 2rem;
              font-size: 1.125rem;
            }
            
            .close-btn {
              top: 1rem;
              right: 1rem;
              padding: 0.75rem 1.5rem;
              font-size: 0.875rem;
            }
          }
        </style>
      </head>
      <body>
        <button class="close-btn" onclick="window.close()">✕ Close</button>
        <div class="content-wrapper">
          <span class="category">${post.category}</span>
          <h1 class="title">${post.title}</h1>
          <div class="meta">
            <div class="author-info">
              <div class="avatar">👤</div>
              <div>
                <div style="font-weight: 700; color: white; font-size: 1.125rem;">${post.author}</div>
                <div style="font-size: 0.875rem; color: #d1d5db;">${post.read_time}</div>
              </div>
            </div>
            <div class="date-info">
              <span style="font-size: 1.25rem;">📅</span>
              <span style="font-size: 0.875rem;">${new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div class="content">${post.full_content}</div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([fullArticleHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    
    // Clean up the URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-full flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
            <p className="text-white text-lg">Loading blog posts...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const previewContent = selectedPost 
    ? getTruncatedContent(selectedPost.full_content)
    : 'Join us as we delve into the latest technological breakthroughs, from quantum computing to artificial intelligence. Our research is paving the way for revolutionary changes in how we understand and interact with the world around us. Click on any blog post below to read more.';

  return (
    <DashboardLayout>
      <div className="min-h-full">
        {/* Hero Section - Shows selected post content */}
        <div className="relative overflow-hidden h-[950px] rounded-b-3xl">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-lg border border-white/10" />
          
          {/* Hero Content */}
          <div className="relative z-10 h-full p-8">
            <div className="max-w-7xl mx-auto w-full h-full">
              <div className="w-full h-full">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {selectedPost ? selectedPost.category : 'Welcome'}
                    </span>
                  </div>
                  
                  <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                    {selectedPost ? selectedPost.title : 'DISCOVER THE FUTURE OF TECHNOLOGY'}
                  </h1>
                  
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold drop-shadow-sm">
                          {selectedPost ? selectedPost.author : 'Coding Club Team'}
                        </p>
                        <p className="text-gray-300 text-sm drop-shadow-sm">
                          {selectedPost ? selectedPost.read_time : 'Explore our blog'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Calendar size={16} />
                      <span className="text-sm drop-shadow-sm">
                        {selectedPost 
                          ? new Date(selectedPost.created_at).toLocaleDateString()
                          : new Date().toLocaleDateString()
                        }
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="w-full mb-8">
                  <div className="text-xl text-gray-200 leading-relaxed whitespace-pre-line max-w-none drop-shadow-sm">
                    {previewContent}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Section */}
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Read Full Article Button */}
          {selectedPost && (
            <div className="flex justify-center mb-8">
              <button 
                onClick={() => openFullArticle(selectedPost)}
                className="group bg-gradient-to-r from-purple-500 to-blue-500 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center space-x-3"
              >
                <span>Read Full Article</span>
                <ExternalLink size={20} className="text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Category Filter */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-black/20 backdrop-blur-lg border border-white/20 text-white hover:bg-white/10 hover:border-purple-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Blog Posts Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">OUR BLOG POSTS</h2>
            <p className="text-gray-300 text-lg">
              {blogPosts.length === 0 
                ? 'No posts found for this category' 
                : `Discover our latest insights and innovations (${blogPosts.length} posts)`
              }
            </p>
          </div>

          {/* Blog Posts Grid */}
          {blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-black/20 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="relative overflow-hidden h-[500px]">
                    <Image
                      src={getPostImageUrl(post)}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Author name - top left */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {post.author}
                      </span>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    
                    {/* Content at bottom center */}
                    <div className="absolute bottom-0 left-0 right-0 text-center p-6">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                        {post.title}
                      </h3>
                      <p className="text-gray-200 text-sm leading-relaxed opacity-90">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
              
              {/* Add Post Button */}
              <div className="group bg-black/10 backdrop-blur-lg border border-white/20 border-dashed rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 cursor-pointer flex items-center justify-center h-[500px]">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Plus size={32} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                  </div>
                  <p className="text-gray-300 text-lg font-semibold group-hover:text-white transition-colors">
                    Add New Post
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No blog posts found.</p>
            </div>
            )}
        </div>
      </div>
    </DashboardLayout>
  );
}