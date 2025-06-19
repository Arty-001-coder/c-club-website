'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Home, Search, Users, FolderOpen, Users2, BookOpen, Archive, Mail, MessageCircle } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeButton, setActiveButton] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [logoExpanded, setLogoExpanded] = useState(false);

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

  const goTo = async (path: string, itemId: string) => {
    if (isTransitioning) return;
    
    // Close search and logo if expanded and navigating to another page
    if (searchExpanded) {
      setSearchExpanded(false);
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
  };

  const toggleLogo = () => {
    setLogoExpanded(!logoExpanded);
    // Close search if logo is opened
    if (!logoExpanded && searchExpanded) {
      setSearchExpanded(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search logic here
      console.log('Searching for:', searchQuery);
      // You can add your search logic here
    }
  };

  const closeSearch = () => {
    setSearchExpanded(false);
    setSearchQuery('');
  };


  const navItems = [
    { id: 'overview', icon: Home, label: 'Home', path: '/' },
    { id: 'alumni', icon: Users, label: 'Alumni', path: '/alumni' },
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

  return (
    <div className="h-screen flex flex-col overflow-hidden relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/back.png")' }}>
      {/* Background overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-blue-900/70 to-black/80 backdrop-blur-sm -z-10"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-xl -z-20 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-xl -z-20 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl -z-20 animate-pulse" style={{ animationDelay: '4s' }} />

      {/* Top Navbar */}
      <nav className="mt-4 h-14 w-full flex items-center justify-center px-4 relative flex-shrink-0 z-10">
        <div className="flex items-center space-x-4 w-5/6 max-w-6xl">
          {/* Logo Container - Separate from navbar */}
          <div className="flex-shrink-0">
            <button
              onClick={toggleLogo}
              className={`
                bg-black/20 backdrop-blur-lg border border-white/20 rounded-full px-4 py-2 shadow-2xl
                text-white transition-all duration-300 ease-out transform hover:scale-110 hover:-translate-y-0.5
                ${logoExpanded 
                  ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 shadow-lg shadow-purple-500/25 border-purple-400/50' 
                  : 'hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-white/10'
                }
                group flex items-center space-x-2 relative
              `}
            >
              <span className={`
                text-xs font-medium transition-all duration-300 ease-out
                ${logoExpanded ? 'text-white drop-shadow-lg font-semibold' : 'text-gray-300 group-hover:text-white'}
              `}>
                Coding Club
              </span>
              
              {/* Active state indicator for logo */}
              {logoExpanded && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full animate-pulse" />
              )}
            </button>
          </div>

          {/* Main Navigation - Frosted glass container */}
          <div className="bg-black/20 backdrop-blur-lg border border-white/20 rounded-full px-6 py-2 shadow-2xl flex-1 transition-all duration-500 ease-out">
            <div className="flex items-center justify-center relative">
              
              {/* Logo details overlay - appears when logo is expanded */}
              <div className={`
                absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out
                ${logoExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
              `}>
                <div className="flex items-center space-x-6 w-full max-w-2xl">
                  {/* Club Logo and Name */}
                  <div className="flex items-center space-x-3">
                    {/* Replace with actual logo image */}
                    <div className="w-10 h-10 rounded-4xl  shadow-lg shadow-purple-500/50 overflow-hidden bg-gradient-to-br items-center justify-center">
                      <Image 
                        src="/logo.png" 
                        alt="CCIT Logo" 
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                        onError={() => {
                          // Image will be hidden and fallback gradient background will show
                          console.log('Logo image failed to load, showing fallback');
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white bg-clip-text">
                        CCIT
                      </h3>
                    </div>
                  </div>

                  {/* Social Links */}
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

        
                </div>
              </div>

              {/* Search bar overlay - appears when search is expanded */}
              <div className={`
                absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out
                ${searchExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
              `}>
                <form onSubmit={handleSearchSubmit} className="flex items-center space-x-3 w-full max-w-md">
                  <Search size={20} className="text-white" />
                  <input
                    type="text"
                    placeholder="Search anything..."
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

              {/* Navigation buttons */}
              <div className={`
                flex items-center space-x-1 transition-all duration-500 ease-out
                ${(searchExpanded || logoExpanded) ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}
              `}>
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeButton === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      className={`
                        relative text-white px-4 py-2 rounded-full transition-all duration-300 ease-out
                        transform hover:scale-110 hover:-translate-y-0.5
                        ${isActive 
                          ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 shadow-lg shadow-purple-500/25 border border-purple-400/50 backdrop-blur-sm' 
                          : 'hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-white/10'
                        }
                        ${isTransitioning ? 'pointer-events-none' : ''}
                        group flex items-center space-x-2
                      `}
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                      onClick={() => goTo(item.path, item.id)}
                    >
                      <Icon 
                        size={18} 
                        className={`
                          transition-all duration-300 ease-out
                          ${isActive ? 'text-white drop-shadow-lg' : 'text-gray-300 group-hover:text-white group-hover:rotate-12'}
                        `}
                      />
                      
                      {/* Label text beside icon */}
                      <span className={`
                        text-xs font-medium transition-all duration-300 ease-out
                        ${isActive ? 'text-white drop-shadow-lg font-semibold' : 'text-gray-300 group-hover:text-white'}
                      `}>
                        {item.label}
                      </span>

                      {/* Active state indicator - enhanced */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Separate Search Button */}
          <div className="flex-shrink-0">
            <button
              onClick={toggleSearch}
              className={`
                bg-black/20 backdrop-blur-lg border border-white/20 rounded-full px-4 py-2 shadow-2xl
                text-white transition-all duration-300 ease-out transform hover:scale-110 hover:-translate-y-0.5
                ${searchExpanded 
                  ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 shadow-lg shadow-purple-500/25 border-purple-400/50' 
                  : 'hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-white/10'
                }
                group flex items-center space-x-2 relative
              `}
            >
              <Search 
                size={18} 
                className={`
                  transition-all duration-300 ease-out
                  ${searchExpanded ? 'text-white drop-shadow-lg' : 'text-gray-300 group-hover:text-white group-hover:rotate-12'}
                `}
              />
              <span className={`
                text-xs font-medium transition-all duration-300 ease-out
                ${searchExpanded ? 'text-white drop-shadow-lg font-semibold' : 'text-gray-300 group-hover:text-white'}
              `}>
                Search
              </span>
              
              {/* Active state indicator for search */}
              {searchExpanded && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 relative min-h-0 z-10">
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