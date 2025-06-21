'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Home, Search, FolderOpen, Users2, BookOpen, Archive, Mail, MessageCircle, GraduationCap } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

interface Props {
  children: ReactNode;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  path: string;
  section: string;
  keywords: string[];
}

export default function DashboardLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeButton, setActiveButton] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [logoExpanded, setLogoExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Comprehensive search database
  const searchDatabase: SearchResult[] = [
    // Home/Overview
    {
      id: 'home-main',
      title: 'Home - Coding Club',
      description: 'Main homepage with club overview, stats, and upcoming events',
      path: '/',
      section: 'Home',
      keywords: ['home', 'overview', 'main', 'coding club', 'iiser', 'stats', 'events', 'community', 'join', 'workshops']
    },
    {
      id: 'home-tech',
      title: 'Tech Stack',
      description: 'Technologies we work with - AI, ML, Web Development, Python',
      path: '/',
      section: 'Home',
      keywords: ['tech', 'technology', 'stack', 'ai', 'artificial intelligence', 'machine learning', 'ml', 'python', 'web development', 'react', 'javascript', 'deep learning', 'data science']
    },
    {
      id: 'home-events',
      title: 'Upcoming Events',
      description: 'ML Workshop, Web Dev Bootcamp, AI Research Seminar',
      path: '/',
      section: 'Home',
      keywords: ['events', 'workshop', 'bootcamp', 'seminar', 'ml workshop', 'web dev', 'ai research', 'upcoming', 'schedule']
    },
    
    // Alumni
    {
      id: 'alumni-main',
      title: 'Alumni Network',
      description: 'Connect with our successful alumni working in top tech companies',
      path: '/alumni',
      section: 'Alumni',
      keywords: ['alumni', 'graduates', 'network', 'connections', 'tech companies', 'career', 'mentorship', 'success stories']
    },
    {
      id: 'alumni-companies',
      title: 'Alumni at Top Companies',
      description: 'Our alumni working at Google, Microsoft, Amazon, Meta, and other tech giants',
      path: '/alumni',
      section: 'Alumni',
      keywords: ['google', 'microsoft', 'amazon', 'meta', 'facebook', 'apple', 'netflix', 'tech giants', 'companies', 'jobs', 'placement']
    },
    
    // Projects & Courses
    {
      id: 'projects-main',
      title: 'Projects & Courses',
      description: 'Hands-on projects and structured courses for skill development',
      path: '/projects',
      section: 'Projects',
      keywords: ['projects', 'courses', 'hands-on', 'skill development', 'programming', 'coding', 'learn', 'practice']
    },
    {
      id: 'projects-ml',
      title: 'Machine Learning Projects',
      description: 'ML and AI projects including neural networks, NLP, and computer vision',
      path: '/projects',
      section: 'Projects',
      keywords: ['machine learning', 'ml', 'ai', 'neural networks', 'nlp', 'natural language processing', 'computer vision', 'deep learning', 'tensorflow', 'pytorch']
    },
    {
      id: 'projects-web',
      title: 'Web Development Projects',
      description: 'Full-stack web applications using React, Node.js, and modern frameworks',
      path: '/projects',
      section: 'Projects',
      keywords: ['web development', 'fullstack', 'react', 'nodejs', 'javascript', 'frontend', 'backend', 'database', 'api', 'responsive']
    },
    {
      id: 'projects-data',
      title: 'Data Science Projects',
      description: 'Data analysis, visualization, and statistical modeling projects',
      path: '/projects',
      section: 'Projects',
      keywords: ['data science', 'data analysis', 'visualization', 'statistics', 'pandas', 'numpy', 'matplotlib', 'jupyter', 'datasets']
    },
    
    // Team
    {
      id: 'team-main',
      title: 'Meet Our Team',
      description: 'Core team members, coordinators, and active contributors',
      path: '/team',
      section: 'Team',
      keywords: ['team', 'members', 'coordinators', 'contributors', 'leadership', 'core team', 'organizers', 'volunteers']
    },
    {
      id: 'team-coordinators',
      title: 'Club Coordinators',
      description: 'Leadership team managing club activities and events',
      path: '/team',
      section: 'Team',
      keywords: ['coordinators', 'leadership', 'management', 'organizers', 'leads', 'heads', 'executives']
    },
    
    // Blogs
    {
      id: 'blogs-main',
      title: 'Tech Blogs',
      description: 'Technical articles, tutorials, and insights from our community',
      path: '/blogs',
      section: 'Blogs',
      keywords: ['blogs', 'articles', 'tutorials', 'technical', 'insights', 'community', 'writing', 'knowledge sharing']
    },
    {
      id: 'blogs-tutorials',
      title: 'Programming Tutorials',
      description: 'Step-by-step coding tutorials and how-to guides',
      path: '/blogs',
      section: 'Blogs',
      keywords: ['tutorials', 'how-to', 'guides', 'step-by-step', 'programming', 'coding', 'learning', 'education']
    },
    {
      id: 'blogs-research',
      title: 'Research Articles',
      description: 'Latest research in AI, ML, and computer science',
      path: '/blogs',
      section: 'Blogs',
      keywords: ['research', 'papers', 'latest', 'computer science', 'ai research', 'ml research', 'academic', 'science']
    },
    
    // Resources
    {
      id: 'resources-main',
      title: 'Learning Resources',
      description: 'Curated resources for programming, AI/ML, and tech skills',
      path: '/resources',
      section: 'Resources',
      keywords: ['resources', 'learning', 'curated', 'programming', 'books', 'courses', 'materials', 'study']
    },
    {
      id: 'resources-books',
      title: 'Recommended Books',
      description: 'Essential books for programming, algorithms, and computer science',
      path: '/resources',
      section: 'Resources',
      keywords: ['books', 'recommended', 'reading', 'algorithms', 'computer science', 'programming books', 'textbooks']
    },
    {
      id: 'resources-tools',
      title: 'Development Tools',
      description: 'IDEs, frameworks, libraries, and development tools',
      path: '/resources',
      section: 'Resources',
      keywords: ['tools', 'development', 'ide', 'frameworks', 'libraries', 'software', 'programming tools', 'github', 'vscode']
    },
    {
      id: 'resources-datasets',
      title: 'Datasets & APIs',
      description: 'Public datasets and APIs for projects and research',
      path: '/resources',
      section: 'Resources',
      keywords: ['datasets', 'apis', 'data', 'public datasets', 'research data', 'machine learning datasets', 'kaggle']
    }
  ];

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Extract current page from pathname and set active button
  useEffect(() => {
    if (pathname) {
      // Map pathname to button IDs
      if (pathname.includes('/blogs')) {
        setActiveButton('blogs');
      } else if (pathname.includes('/alumni')) {
        setActiveButton('alumni');
      } else if (pathname.includes('/projects')) {
        setActiveButton('projects');
      } else if (pathname.includes('/team')) {
        setActiveButton('team');
      } else if (pathname.includes('/resources')) {
        setActiveButton('resources');
      } else if (pathname === '/' || pathname.includes('/overview') || pathname.includes('/home')) {
        setActiveButton('overview');
      } else {
        setActiveButton('overview'); // Default fallback
      }
    }
  }, [pathname]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const query = searchQuery.toLowerCase().trim();
      const results = searchDatabase.filter(item => {
        return (
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
          item.section.toLowerCase().includes(query)
        );
      }).slice(0, 6); // Limit to 6 results

      setSearchResults(results);
      setShowSearchResults(results.length > 0);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  const goTo = async (path: string, itemId: string) => {
    if (isTransitioning) return;
    
    // Close search and logo if expanded and navigating to another page
    if (searchExpanded) {
      setSearchExpanded(false);
      setShowSearchResults(false);
    }
    if (logoExpanded) {
      setLogoExpanded(false);
    }
    
    setIsTransitioning(true);
    setActiveButton(itemId); // Immediately update active button for visual feedback
    
    try {
      // Use window.location for direct navigation to ensure it works
      if (itemId === 'blogs') {
        window.location.href = '/blogs';
      } else {
        // For other pages, use router.push
        router.push(path);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location
      window.location.href = path;
    }
    
    // Reset transition state after a delay
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const toggleSearch = () => {
    setSearchExpanded(!searchExpanded);
    // Close logo if search is opened
    if (!searchExpanded && logoExpanded) {
      setLogoExpanded(false);
    }
    // Clear search when closing
    if (searchExpanded) {
      setSearchQuery('');
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const toggleLogo = () => {
    setLogoExpanded(!logoExpanded);
    // Close search if logo is opened
    if (!logoExpanded && searchExpanded) {
      setSearchExpanded(false);
      setShowSearchResults(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && searchResults.length > 0) {
      // Navigate to the first/best match
      const bestMatch = searchResults[0];
      const sectionId = bestMatch.section.toLowerCase() === 'home' ? 'overview' : bestMatch.section.toLowerCase();
      goTo(bestMatch.path, sectionId);
      closeSearch();
    }
  };

  const handleSearchResultClick = (result: SearchResult) => {
    const sectionId = result.section.toLowerCase() === 'home' ? 'overview' : result.section.toLowerCase();
    goTo(result.path, sectionId);
    closeSearch();
  };

  const closeSearch = () => {
    setSearchExpanded(false);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // Function to highlight matching text in search results
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-purple-400/30 text-purple-200 font-semibold">
          {part}
        </span>
      ) : part
    );
  };

  const navItems = [
    { id: 'overview', icon: Home, label: 'Home', path: '/' },
    { id: 'alumni', icon: GraduationCap, label: 'Alumni', path: '/alumni' },
    { id: 'projects', icon: FolderOpen, label: 'Projects & Courses', path: '/projects' },
    { id: 'team', icon: Users2, label: 'Team', path: '/team' },
    { id: 'blogs', icon: BookOpen, label: 'Blogs', path: '/blogs' },
    { id: 'resources', icon: Archive, label: 'Resources', path: '/resources' },
  ];

  const socialLinks = [
    { 
      name: 'Email', 
      icon: Mail, 
      url: 'mailto:coding.club@iisertvm.ac.in',
      label: 'coding.club@iisertvm.ac.in'
    },
    { 
      name: 'Discord', 
      icon: MessageCircle, 
      url: 'https://discord.gg/codingclub',
      label: 'Join Discord'
    },
    { 
      name: 'LinkedIn', 
      icon: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ), 
      url: 'https://www.linkedin.com/company/cciisertvm',
      label: 'LinkedIn'
    },
    { 
      name: 'Instagram', 
      icon: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ), 
      url: 'https://www.instagram.com/codingclubiisertvm',
      label: 'Instagram'
    },
  ];

  // Unified Layout for both Desktop and Mobile
  return (
    <div className="h-screen flex flex-col overflow-hidden relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/back.png")' }}>
      {/* Background overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-blue-900/70 to-black/80 backdrop-blur-sm -z-10"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-xl -z-20 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-xl -z-20 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl -z-20 animate-pulse" style={{ animationDelay: '4s' }} />

      {/* Top Navbar - Same for both desktop and mobile */}
      <nav className="mt-4 h-14 w-full flex items-center justify-center px-4 relative flex-shrink-0 z-10">
        <div className={`flex items-center space-x-2 lg:space-x-4 ${isMobile ? 'w-full max-w-sm' : 'w-5/6 max-w-6xl'}`}>
          {/* Logo Container - C² for mobile, Coding Club for desktop */}
          <div className="flex-shrink-0">
            <button
              onClick={toggleLogo}
              className={`
                bg-black/40 backdrop-blur-lg border border-white/20 rounded-full px-4 py-2 shadow-2xl
                text-white transition-all duration-300 ease-out transform hover:scale-110 hover:-translate-y-0.5
                ${logoExpanded 
                  ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 shadow-lg shadow-purple-500/25 border-purple-400/50' 
                  : 'hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-white/10'
                }
                group flex items-center space-x-2 relative
              `}
            >
              <span className={`
                ${isMobile ? 'text-sm font-bold' : 'text-xs font-medium'} transition-all duration-300 ease-out
                ${logoExpanded ? 'text-white drop-shadow-lg font-semibold' : 'text-gray-300 group-hover:text-white'}
              `}>
                {isMobile ? 'C²' : 'Coding Club'}
              </span>
              
              {/* Active state indicator for logo */}
              {logoExpanded && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full animate-pulse" />
              )}
            </button>
          </div>

          {/* Main Navigation - Responsive container */}
          <div className={`bg-black/40 backdrop-blur-lg rounded-full ${isMobile ? 'px-3 py-2' : 'px-6 py-2'} shadow-2xl flex-1 transition-all duration-500 ease-out relative`}>
            <div className="flex items-center justify-center relative">
              
              {/* Logo details overlay - appears when logo is expanded */}
              <div className={`
                absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out
                ${logoExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
              `}>
                <div className={`flex items-center ${isMobile ? 'space-x-3' : 'space-x-6'} w-full ${isMobile ? 'max-w-xs' : 'max-w-2xl'}`}>
                  {/* Club Logo and Name */}
                  <div className="flex items-center space-x-3">
                    <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-full shadow-lg shadow-purple-500/50 overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center`}>
                      <Image 
                        src="/logo.png" 
                        alt="CCIT Logo" 
                        width={isMobile ? 32 : 40}
                        height={isMobile ? 32 : 40}
                        className="object-cover w-full h-full"
                        onError={() => {
                          console.log('Logo image failed to load, showing fallback');
                        }}
                      />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'} text-white bg-clip-text`}>
                        CCIT
                      </h3>
                    </div>
                  </div>

                  {/* Social Links - Hidden on mobile in expanded view, shown only on desktop */}
                  {!isMobile && (
                    <div className="flex items-center space-x-3">
                      {socialLinks.map((social) => {
                        const IconComponent = social.icon;
                        return (
                          <a
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/social flex items-center space-x-2 px-3 py-1.5 rounded-full hover:bg-black/30 hover:backdrop-blur-lg hover:border hover:border-white/20 transition-all duration-300 ease-out transform hover:scale-105"
                          >
                            <IconComponent className="w-4 h-4 text-gray-300 group-hover/social:text-white transition-colors duration-300" />
                            <span className="text-xs text-gray-300 group-hover/social:text-white transition-all duration-300">
                              {social.name}
                            </span>
                          </a>
                        );
                      })}
                      
                      {/* IISER TVM Text */}
                      <span className="text-sm font-semibold text-white bg-clip-text px-2">
                        IISER TRIVANDRUM
                      </span>
                    </div>
                  )}

                  {/* Mobile: Show IISER TVM text instead of social links */}
                  {isMobile && (
                    <div className="text-center">
                      <span className="text-xs font-semibold text-white bg-clip-text">
                        IISER TRIVANDRUM
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Search bar overlay - appears when search is expanded */}
              <div className={`
                absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out
                ${searchExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
              `}>
                <form onSubmit={handleSearchSubmit} className={`flex items-center space-x-3 w-full ${isMobile ? 'max-w-xs' : 'max-w-md'}`}>
                  <Search size={isMobile ? 18 : 20} className="text-white" />
                  <input
                    type="text"
                    placeholder="Search across all sections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-white placeholder-gray-300 outline-none flex-1 text-sm"
                    autoFocus={searchExpanded}
                  />
                  <button
                    type="button"
                    onClick={closeSearch}
                    className="text-white hover:text-gray-300 transition-colors duration-200 p-1 hover:bg-white/10 rounded-full ml-2"
                  >
                    ✕
                  </button>
                </form>
              </div>

              {/* Navigation buttons - Icons only for mobile, icons + text for desktop */}
              <div className={`
                flex items-center ${isMobile ? 'space-x-1' : 'space-x-1'} transition-all duration-500 ease-out
                ${(searchExpanded || logoExpanded) ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}
              `}>
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeButton === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      className={`
                        relative text-white ${isMobile ? 'px-2 py-2' : 'px-4 py-2'} rounded-full transition-all duration-300 ease-out
                        transform hover:scale-110 hover:-translate-y-0.5
                        ${isActive 
                          ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 shadow-lg shadow-purple-500/25 border border-purple-400/50 backdrop-blur-sm' 
                          : 'hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-white/10'
                        }
                        ${isTransitioning ? 'pointer-events-none' : ''}
                        group flex items-center ${isMobile ? '' : 'space-x-2'}
                      `}
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                      onClick={() => goTo(item.path, item.id)}
                      title={isMobile ? item.label : undefined}
                    >
                      <Icon 
                        size={isMobile ? 16 : 18} 
                        className={`
                          transition-all duration-300 ease-out
                          ${isActive ? 'text-white drop-shadow-lg' : 'text-gray-300 group-hover:text-white group-hover:rotate-12'}
                        `}
                      />
                      
                      {/* Label text - only show on desktop */}
                      {!isMobile && (
                        <span className={`
                          text-xs font-medium transition-all duration-300 ease-out
                          ${isActive ? 'text-white drop-shadow-lg font-semibold' : 'text-gray-300 group-hover:text-white'}
                        `}>
                          {item.label}
                        </span>
                      )}

                      {/* Active state indicator */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex-shrink-0">
            <button
              onClick={toggleSearch}
              className={`
                bg-black/40 backdrop-blur-lg border border-white/20 rounded-full ${isMobile ? 'px-3 py-2' : 'px-4 py-2'} shadow-2xl
                text-white transition-all duration-300 ease-out transform hover:scale-110 hover:-translate-y-0.5
                ${searchExpanded 
                  ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 shadow-lg shadow-purple-500/25 border-purple-400/50' 
                  : 'hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-white/10'
                }
                group flex items-center ${isMobile ? '' : 'space-x-2'} relative
              `}
            >
              <Search 
                size={isMobile ? 16 : 18} 
                className={`
                  transition-all duration-300 ease-out
                  ${searchExpanded ? 'text-white drop-shadow-lg' : 'text-gray-300 group-hover:text-white group-hover:rotate-12'}
                `}
              />
              {/* Search label - only show on desktop */}
              {!isMobile && (
                <span className={`
                  text-xs font-medium transition-all duration-300 ease-out
                  ${searchExpanded ? 'text-white drop-shadow-lg font-semibold' : 'text-gray-300 group-hover:text-white'}
                `}>
                  Search
                </span>
              )}
              
              {/* Active state indicator for search */}
              {searchExpanded && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Search Results Overlay */}
      {searchExpanded && showSearchResults && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
          <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/20 max-h-96 overflow-y-auto">
            <div className="p-4">
              <div className="text-sm text-gray-300 mb-3 px-2">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for {searchQuery}
              </div>
              
              <div className="space-y-2">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full text-left p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group border border-transparent hover:border-purple-400/30"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs px-2 py-1 bg-purple-600/30 text-purple-200 rounded-full font-medium">
                            {result.section}
                          </span>
                        </div>
                        <h4 className="text-white font-medium text-sm mb-1 group-hover:text-purple-200 transition-colors">
                          {highlightMatch(result.title, searchQuery)}
                        </h4>
                        <p className="text-gray-400 text-xs line-clamp-2">
                          {highlightMatch(result.description, searchQuery)}
                        </p>
                      </div>
                      
                      <div className="flex-shrink-0 ml-3">
                        <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center group-hover:bg-purple-600/40 transition-colors">
                          <span className="text-purple-300 text-xs">→</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {searchResults.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/10">
                  <p className="text-xs text-gray-400 text-center">
                    Press Enter to go to the first result or click any result above
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logo Details Overlay for Mobile */}
      {logoExpanded && isMobile && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-black/40 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mx-4 w-full max-w-md">
            <div className="text-center space-y-4">
              {/* Club Logo and Name */}
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full shadow-lg shadow-purple-500/50 overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Image 
                    src="/logo.png" 
                    alt="CCIT Logo" 
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                    onError={() => {
                      console.log('Logo image failed to load, showing fallback');
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    CCIT
                  </h3>
                  <p className="text-sm text-gray-300">Coding Club</p>
                </div>
              </div>

              {/* IISER TVM Text */}
              <div className="text-center mb-6">
                <span className="text-lg font-semibold text-white bg-clip-text">
                  IISER TRIVANDRUM
                </span>
              </div>

              {/* Social Links */}
              <div className="space-y-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/social flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-black/30 hover:backdrop-blur-lg hover:border hover:border-white/20 transition-all duration-300 ease-out transform hover:scale-105 w-full"
                    >
                      <IconComponent className="w-5 h-5 text-gray-300 group-hover/social:text-white transition-colors duration-300" />
                      <span className="text-sm text-gray-300 group-hover/social:text-white transition-all duration-300">
                        {social.name}
                      </span>
                    </a>
                  );
                })}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setLogoExpanded(false)}
                className="mt-6 w-full px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Full width and height */}
      <main className="flex-1 p-4 lg:p-6 relative min-h-0 z-10">
        {/* Content wrapper with transition */}
        <div 
          className={`
             rounded-3xl shadow-2xl w-full h-full relative
            transition-all duration-300 ease-out
            ${isTransitioning ? 'opacity-95 scale-[0.998]' : 'opacity-100 scale-100'}
          `}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 via-transparent to-blue-50/20 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
          
          {/* Loading overlay during transitions */}
          {isTransitioning && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          
          {/* Scrollable Content */}
          <div 
            className={`
              h-full overflow-y-auto overflow-x-hidden transition-all duration-200 ease-out rounded-3xl
              ${isTransitioning ? 'opacity-70 blur-sm' : 'opacity-100 blur-0'}
            `}
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}