'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  BookOpen, 
  Video, 
  Code, 
  Download, 
  ExternalLink, 
  Star,
  FileText,
  Laptop,
  Globe,
  Github,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'Documentation' | 'Tutorial' | 'Tool' | 'Template' | 'Course' | 'Article';
  type: 'pdf' | 'video' | 'website' | 'github' | 'download';
  url: string;
  image: string;
  author: string;
  date: string;
  rating: number;
  views: number;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isFeatured?: boolean;
}

export default function ResourcesPage() {
  const [searchQuery] = useState('');
  const [selectedCategory] = useState('All');
  const [selectedDifficulty] = useState('All');
  const [currentResourceIndex, setCurrentResourceIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'up' | 'down' | null>(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const resources: Resource[] = [
    {
      id: '1',
      title: 'React Complete Developer Guide',
      description: 'Comprehensive guide covering React fundamentals, hooks, state management, and advanced patterns with practical examples.',
      category: 'Documentation',
      type: 'website',
      url: 'https://react-guide.iisertvm.ac.in',
      image: '/images/resources/react-guide.jpg',
      author: 'Rahul Nair',
      date: 'Dec 2024',
      rating: 4.9,
      views: 1250,
      tags: ['React', 'JavaScript', 'Frontend', 'Hooks'],
      difficulty: 'Intermediate',
      isFeatured: true
    },
    {
      id: '2',
      title: 'Python Data Science Toolkit',
      description: 'Essential Python libraries and tools for data science including NumPy, Pandas, and Matplotlib with Jupyter notebooks.',
      category: 'Tool',
      type: 'github',
      url: 'https://github.com/iisertvm/python-ds-toolkit',
      image: '/images/resources/hero-tech.png',
      author: 'Dr. Meera Joshi',
      date: 'Nov 2024',
      rating: 4.8,
      views: 2100,
      tags: ['Python', 'Data Science', 'Pandas', 'NumPy'],
      difficulty: 'Beginner',
      isFeatured: true
    },
    {
      id: '3',
      title: 'Modern CSS Grid Layouts',
      description: 'Interactive tutorial series on CSS Grid with live examples and practical layouts for modern web design.',
      category: 'Tutorial',
      type: 'video',
      url: 'https://youtube.com/watch?v=css-grid-tutorial',
      image: '/images/resources/css-grid.jpg',
      author: 'Sneha Patel',
      date: 'Oct 2024',
      rating: 4.7,
      views: 850,
      tags: ['CSS', 'Web Design', 'Layout', 'Grid'],
      difficulty: 'Intermediate'
    },
    {
      id: '4',
      title: 'Machine Learning Cheat Sheet',
      description: 'Quick reference guide for ML algorithms, formulas, and implementation tips. Perfect for interviews and quick revision.',
      category: 'Article',
      type: 'pdf',
      url: '/downloads/ml-cheatsheet.pdf',
      image: '/images/resources/ml-cheatsheet.jpg',
      author: 'Priya Sharma',
      date: 'Dec 2024',
      rating: 4.9,
      views: 3200,
      tags: ['Machine Learning', 'Algorithms', 'Reference'],
      difficulty: 'Advanced'
    },
    {
      id: '5',
      title: 'Node.js Backend Template',
      description: 'Production-ready Node.js backend template with authentication, database integration, and API documentation.',
      category: 'Template',
      type: 'github',
      url: 'https://github.com/iisertvm/nodejs-backend-template',
      image: '/images/resources/nodejs-template.jpg',
      author: 'Arjun Kumar',
      date: 'Nov 2024',
      rating: 4.6,
      views: 1450,
      tags: ['Node.js', 'Backend', 'API', 'Template'],
      difficulty: 'Intermediate'
    },
    {
      id: '6',
      title: 'Git Workflow Masterclass',
      description: 'Complete course on Git version control, branching strategies, collaboration workflows, and best practices.',
      category: 'Course',
      type: 'video',
      url: 'https://courses.iisertvm.ac.in/git-masterclass',
      image: '/images/resources/git-course.jpg',
      author: 'Vikram Singh',
      date: 'Sep 2024',
      rating: 4.8,
      views: 1800,
      tags: ['Git', 'Version Control', 'Collaboration'],
      difficulty: 'Beginner'
    },
    {
      id: '7',
      title: 'Mobile App UI Kit',
      description: 'Comprehensive Figma UI kit for mobile app design with components, icons, and design system guidelines.',
      category: 'Template',
      type: 'download',
      url: '/downloads/mobile-ui-kit.fig',
      image: '/images/resources/ui-kit.jpg',
      author: 'Anjali Singh',
      date: 'Oct 2024',
      rating: 4.7,
      views: 950,
      tags: ['UI/UX', 'Mobile', 'Figma', 'Design'],
      difficulty: 'Beginner'
    },
    {
      id: '8',
      title: 'Database Design Patterns',
      description: 'In-depth article covering database design patterns, normalization, indexing strategies, and performance optimization.',
      category: 'Article',
      type: 'website',
      url: 'https://blog.iisertvm.ac.in/database-patterns',
      image: '/images/resources/database-patterns.jpg',
      author: 'Karthik Menon',
      date: 'Dec 2024',
      rating: 4.8,
      views: 1100,
      tags: ['Database', 'SQL', 'Design Patterns'],
      difficulty: 'Advanced'
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || resource.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const currentResource = filteredResources[currentResourceIndex];

  const goToPrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection('up');
    
    setTimeout(() => {
      setCurrentResourceIndex((prev) => 
        prev === 0 ? filteredResources.length - 1 : prev - 1
      );
      setTimeout(() => {
        setIsAnimating(false);
        setSlideDirection(null);
      }, 50);
    }, 200);
  };

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection('down');
    
    setTimeout(() => {
      setCurrentResourceIndex((prev) => 
        prev === filteredResources.length - 1 ? 0 : prev + 1
      );
      setTimeout(() => {
        setIsAnimating(false);
        setSlideDirection(null);
      }, 50);
    }, 200);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText size={16} />;
      case 'video': return <Video size={16} />;
      case 'website': return <Globe size={16} />;
      case 'github': return <Github size={16} />;
      case 'download': return <Download size={16} />;
      default: return <ExternalLink size={16} />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Documentation': return <BookOpen size={20} />;
      case 'Tutorial': return <Video size={20} />;
      case 'Tool': return <Laptop size={20} />;
      case 'Template': return <Code size={20} />;
      case 'Course': return <BookOpen size={20} />;
      case 'Article': return <FileText size={20} />;
      default: return <BookOpen size={20} />;
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-fade-in-scale {
          animation: fadeInScale 1s ease-out forwards;
        }
      `}</style>
    <DashboardLayout>
      <div className="min-h-full">
        {/* Header */}
        <div className={`text-center py-12 px-8 transition-all duration-1000 ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
        }`}>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Learning <span className="text-purple-400">Resources</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Curated collection of tutorials, tools, and resources to accelerate your learning journey
          </p>
        </div>

        <div className={`max-w-7xl mx-auto px-8 pb-16 transition-all duration-1000 delay-200 ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {filteredResources.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen size={64} className="text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-400 mb-2">No resources found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Left Side - Vertical Carousel */}
              <div className={`lg:col-span-4 transition-all duration-1000 delay-300 ${
                isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}>
                <div className="flex flex-col items-center space-y-4">
                  {/* Previous Resource Preview */}
                  {filteredResources.length > 1 && (
                    <div className={`relative w-3/4 h-24 rounded-xl overflow-hidden opacity-40 transition-all duration-300 hover:opacity-60 ${
                      isAnimating && slideDirection === 'up' ? 'transform -translate-y-2 opacity-0' : 
                      isAnimating && slideDirection === 'down' ? 'transform translate-y-2 opacity-60' : ''
                    } ${isPageLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '600ms'}}>
                      <Image
                        src={filteredResources[currentResourceIndex === 0 ? filteredResources.length - 1 : currentResourceIndex - 1].image}
                        alt="Previous resource"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-xs font-medium truncate">
                          {filteredResources[currentResourceIndex === 0 ? filteredResources.length - 1 : currentResourceIndex - 1].title}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Up Arrow - Moved closer */}
                  <button
                    onClick={goToPrevious}
                    disabled={isAnimating}
                    className={`p-3 bg-black/30 backdrop-blur-lg border border-white/20 rounded-full text-white hover:bg-purple-600/20 hover:border-purple-400/30 transition-all duration-200 ${
                      isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                    } ${isPageLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{animationDelay: '700ms'}}
                  >
                    <ChevronUp size={24} />
                  </button>

                  {/* Current Resource Container */}
                  <div className={`relative w-full h-[500px] rounded-2xl overflow-hidden group shadow-2xl transition-all duration-300 ${
                    isAnimating && slideDirection === 'up' ? 'transform -translate-y-8 opacity-0' :
                    isAnimating && slideDirection === 'down' ? 'transform translate-y-8 opacity-0' : 
                    'transform translate-y-0 opacity-100'
                  } ${isPageLoaded ? 'animate-fade-in-scale' : 'opacity-0'}`} style={{animationDelay: '800ms'}}>
                    <Image
                      src={currentResource.image}
                      alt={currentResource.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-between p-6">
                      {/* Top - Tag */}
                      <div className="flex justify-between items-start">
                        <span className="bg-purple-600/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                          {currentResource.tags[0]}
                        </span>
                        {currentResource.isFeatured && (
                          <span className="bg-yellow-500/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-bold flex items-center space-x-1">
                            <Star size={12} />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>
                      
                      {/* Bottom - Title */}
                      <div>
                        <h3 className="text-white text-xl font-bold mb-2 line-clamp-2">
                          {currentResource.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(currentResource.category)}
                          <span className="text-purple-300 text-sm font-semibold">
                            {currentResource.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Down Arrow - Moved closer */}
                  <button
                    onClick={goToNext}
                    disabled={isAnimating}
                    className={`p-3 bg-black/30 backdrop-blur-lg border border-white/20 rounded-full text-white hover:bg-purple-600/20 hover:border-purple-400/30 transition-all duration-200 ${
                      isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                    } ${isPageLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{animationDelay: '900ms'}}
                  >
                    <ChevronDown size={24} />
                  </button>

                  {/* Next Resource Preview */}
                  {filteredResources.length > 1 && (
                    <div className={`relative w-3/4 h-24 rounded-xl overflow-hidden opacity-40 transition-all duration-300 hover:opacity-60 ${
                      isAnimating && slideDirection === 'down' ? 'transform translate-y-2 opacity-0' : 
                      isAnimating && slideDirection === 'up' ? 'transform -translate-y-2 opacity-60' : ''
                    } ${isPageLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '1000ms'}}>
                      <Image
                        src={filteredResources[currentResourceIndex === filteredResources.length - 1 ? 0 : currentResourceIndex + 1].image}
                        alt="Next resource"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-xs font-medium truncate">
                          {filteredResources[currentResourceIndex === filteredResources.length - 1 ? 0 : currentResourceIndex + 1].title}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Resource Counter */}
                  <div className={`text-center mt-4 ${isPageLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '1100ms'}}>
                    <p className="text-gray-400 text-sm">
                      {currentResourceIndex + 1} of {filteredResources.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - Resource Details */}
              <div className={`lg:col-span-8 flex items-center transition-all duration-1000 delay-500 ${
                isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}>
                <div className="space-y-6 w-full">
                  {/* Header */}
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      {getCategoryIcon(currentResource.category)}
                      <span className="text-purple-400 font-semibold">
                        {currentResource.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        currentResource.difficulty === 'Beginner' ? 'bg-green-600/20 text-green-400' :
                        currentResource.difficulty === 'Intermediate' ? 'bg-blue-600/20 text-blue-400' :
                        'bg-red-600/20 text-red-400'
                      }`}>
                        {currentResource.difficulty}
                      </span>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-white mb-4">
                      {currentResource.title}
                    </h1>
                    
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {currentResource.description}
                    </p>
                  </div>

                  {/* Resource Type */}
                  <div className="flex items-center space-x-2 text-sm">
                    {getTypeIcon(currentResource.type)}
                    <span className="text-white font-medium capitalize">{currentResource.type}</span>
                    <span className="text-gray-400">resource</span>
                  </div>

                  {/* Upload Date */}
                  <div>
                    <p className="text-white font-medium">Uploaded {currentResource.date}</p>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-white font-semibold mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentResource.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="bg-white/10 border border-white/20 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-purple-600/20 hover:border-purple-400/30 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Access Button */}
                  <div>
                    <a
                      href={currentResource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                    >
                      {getTypeIcon(currentResource.type)}
                      <span>Access Resource</span>
                      <ExternalLink size={18} />
                    </a>
                  </div>

                  {/* Resource Type Info */}
                  <div className="border-t border-white/10 pt-6">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <span>Resource Type:</span>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(currentResource.type)}
                        <span className="text-white capitalize">{currentResource.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
    </>
  );
}