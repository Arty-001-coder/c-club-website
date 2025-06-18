'use client';

import { useState } from 'react';
import Image from 'next/image';
import DashboardLayout from '@/components/DashboardLayout';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  fullContent: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  views: number;
  likes: number;
  comments: number;
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const categories = [
    { id: 'all', label: 'All Posts' },
    { id: 'technology', label: 'Technology' },
    { id: 'research', label: 'Research' },
    { id: 'innovation', label: 'Innovation' },
    { id: 'community', label: 'Community' }
  ];

  const featuredPost = selectedPost || {
    id: 0,
    title: 'DISCOVER THE FUTURE OF TECHNOLOGY',
    subtitle: 'Exploring cutting-edge innovations that will shape tomorrow',
    excerpt: 'Join us as we delve into the latest technological breakthroughs, from quantum computing to artificial intelligence. Our research is paving the way for revolutionary changes in how we understand and interact with the world around us. Click on any blog post below to read more.',
    fullContent: 'Join us as we delve into the latest technological breakthroughs, from quantum computing to artificial intelligence. Our research is paving the way for revolutionary changes in how we understand and interact with the world around us. Click on any blog post below to read more.',
    image: '/images/hero-tech.jpg',
    author: 'Coding Club Team',
    date: '2025-06-15',
    readTime: 'Select a post to read',
    category: 'Featured',
    views: 0,
    likes: 0,
    comments: 0
  };

  const blogPosts: BlogPost[] = [
    {
      id: 2,
      title: 'Quantum Computing Breakthrough',
      excerpt: 'Our latest research in quantum algorithms shows promising results for solving complex optimization problems. This breakthrough could revolutionize how we approach computational challenges in various fields.',
      fullContent: 'Our research team has achieved a significant breakthrough in quantum computing algorithms. By developing new optimization techniques, we have demonstrated the potential for quantum computers to solve complex problems that are currently intractable with classical computers. This research opens up new possibilities for applications in cryptography, drug discovery, and artificial intelligence.',
      image: '/images/hero-tech.png',
      author: 'Alex Johnson',
      date: '2025-06-12',
      readTime: '5 min read',
      category: 'Technology',
      views: 1245,
      likes: 89,
      comments: 23
    },
    {
      id: 3,
      title: 'AI in Scientific Research',
      excerpt: 'How machine learning is revolutionizing data analysis and discovery in scientific research.',
      fullContent: 'Artificial Intelligence is transforming the landscape of scientific research. Machine learning algorithms are now capable of analyzing vast datasets, identifying patterns that would be impossible for humans to detect, and accelerating the pace of discovery. From protein folding prediction to climate modeling, AI is becoming an indispensable tool for researchers across all disciplines.',
      image: '/images/ai-research.jpg',
      author: 'Maya Patel',
      date: '2025-06-10',
      readTime: '6 min read',
      category: 'Innovation',
      views: 2156,
      likes: 145,
      comments: 34
    },
    {
      id: 4,
      title: 'Building Tomorrow\'s Solutions',
      excerpt: 'Community-driven projects that are making a real impact on global challenges.',
      fullContent: 'Our coding club believes in the power of community-driven development. Through collaborative projects, we are addressing real-world challenges from environmental monitoring to educational accessibility. These initiatives demonstrate how passionate individuals can come together to create solutions that benefit society as a whole.',
      image: '/images/community-projects.jpg',
      author: 'Chris Williams',
      date: '2025-06-08',
      readTime: '4 min read',
      category: 'Community',
      views: 987,
      likes: 67,
      comments: 12
    },
    {
      id: 5,
      title: 'Sustainable Tech Innovations',
      excerpt: 'Exploring green technologies and their potential to create a more sustainable future.',
      fullContent: 'Sustainability is at the forefront of technological innovation. Our research focuses on developing eco-friendly solutions that minimize environmental impact while maximizing efficiency. From renewable energy systems to biodegradable electronics, we are pioneering technologies that will help create a more sustainable future for generations to come.',
      image: '/images/sustainable-tech.jpg',
      author: 'Emma Davis',
      date: '2025-06-05',
      readTime: '7 min read',
      category: 'Research',
      views: 1543,
      likes: 112,
      comments: 28
    },
    {
      id: 6,
      title: 'Collaborative Research Methods',
      excerpt: 'How interdisciplinary collaboration is driving breakthrough discoveries in science.',
      fullContent: 'The future of research lies in collaboration across disciplines. By bringing together experts from different fields, we can approach complex problems from multiple angles and develop more comprehensive solutions. Our interdisciplinary approach has led to groundbreaking discoveries that would not have been possible within traditional academic silos.',
      image: '/images/collaboration.jpg',
      author: 'David Kim',
      date: '2025-06-03',
      readTime: '5 min read',
      category: 'Innovation',
      views: 876,
      likes: 54,
      comments: 16
    },
    {
      id: 7,
      title: 'The Power of Open Source',
      excerpt: 'Why open source development is crucial for advancing technology and fostering innovation.',
      fullContent: 'Open source development has revolutionized the technology landscape. By making code freely available and encouraging collaboration, the open source movement has accelerated innovation and democratized access to cutting-edge technologies. Our commitment to open source principles ensures that our research benefits the entire global community.',
      image: '/images/open-source.jpg',
      author: 'Lisa Rodriguez',
      date: '2025-06-01',
      readTime: '6 min read',
      category: 'Technology',
      views: 1234,
      likes: 98,
      comments: 21
    }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category.toLowerCase() === selectedCategory);

  return (
    <DashboardLayout>
      <div className="min-h-full">
        {/* Hero Section */}
        <div className="relative h-[900px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${featuredPost.image})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-8 w-full">
              <div className="max-w-4xl">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="bg-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {featuredPost.category}
                  </span>
                  {selectedPost && (
                    <button 
                      onClick={() => setSelectedPost(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-600 transition-colors"
                    >
                      Back to Featured
                    </button>
                  )}
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  {featuredPost.title}
                </h1>
                
                <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                  {selectedPost ? featuredPost.fullContent : featuredPost.excerpt}
                </p>
                
                <div className="flex items-center space-x-6 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{featuredPost.author}</p>
                      <p className="text-gray-300 text-sm">{featuredPost.readTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Calendar size={16} />
                    <span className="text-sm">{new Date(featuredPost.date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <button className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 flex items-center space-x-3">
                  <span>{selectedPost ? 'Continue Reading' : 'Explore Our Blog'}</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                    : 'bg-black/20 backdrop-blur-lg border border-white/20 text-white hover:bg-white/10 hover:border-cyan-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Popular Posts Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">POPULAR POSTS</h2>
            <p className="text-gray-300 text-lg">Discover our most engaging content</p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-black/20 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div className="relative overflow-hidden h-[500px]">
                  <Image
                    src={post.image}
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
          </div>

          {/* Load More Button */}
          
        </div>
      </div>
    </DashboardLayout>
  );
}