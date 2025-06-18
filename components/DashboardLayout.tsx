'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Home, Search, Users, FolderOpen, Users2, BookOpen, Archive } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

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
    
    // Close search if expanded and navigating to another page
    if (searchExpanded) {
      setSearchExpanded(false);
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
    { id: 'projects', icon: FolderOpen, label: 'Projects', path: '/projects' },
    { id: 'team', icon: Users2, label: 'Team', path: '/team' },
    { id: 'blogs', icon: BookOpen, label: 'Blogs', path: '/blogs' },
    { id: 'resources', icon: Archive, label: 'Resources', path: '/resources' },
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
          {/* Main Navigation - Frosted glass container */}
          <div className="bg-black/20 backdrop-blur-lg border border-white/20 rounded-full px-6 py-2 shadow-2xl flex-1 transition-all duration-500 ease-out">
            <div className="flex items-center justify-center relative">
              
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
                ${searchExpanded ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}
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