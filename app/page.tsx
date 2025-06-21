'use client';

import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

export default function HomePage() {
  const [displayedText, setDisplayedText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showEvents, setShowEvents] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [eventCharIndex, setEventCharIndex] = useState(0);
  const [isTypingEvent, setIsTypingEvent] = useState(false);
  const [showViewDetails, setShowViewDetails] = useState(false);
  const [showTechSection, setShowTechSection] = useState(false);
  const [isClosingTechSection, setIsClosingTechSection] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [eventDisplayTimer, setEventDisplayTimer] = useState<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Merchandise typewriter effect states
  const [merchandiseText, setMerchandiseText] = useState('');
  const [merchandiseCharIndex, setMerchandiseCharIndex] = useState(0);
  const [showMerchandiseTyping, setShowMerchandiseTyping] = useState(false);

  // Google Form URL - Replace this with your actual Google Form URL
  const GOOGLE_FORM_URL = 'https://forms.google.com/your-form-id-here';

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const codeLines = [
    '> Initializing future_tech.py',
    '> Loading quantum algorithms',
    '> Connecting to server..',
    '> System ready! Welcome to Coding Club',
    '> >>> import innovation',
    '> >>> innovation.transform_future'
  ];

  const merchandiseFullText = "Explore our Merchandise";

  const upcomingEvents = [
    {
      name: '> Event: ML Workshop',
      date: '> Date: January 25, 2025',
      description: '> Description: Hands-on machine learning with Python',
      pdfUrl: '/pdfs/ml-workshop-details.pdf'
    },
    {
      name: '> Event: Web Dev Bootcamp',
      date: '> Date: February 2, 2025',
      description: '> Description: Build modern web apps with React & Node.js',
      pdfUrl: '/pdfs/webdev-bootcamp-details.pdf'
    },
    {
      name: '> Event: AI Research Seminar',
      date: '> Date: February 10, 2025',
      description: '> Description: Latest breakthroughs in artificial intelligence',
      pdfUrl: '/pdfs/ai-seminar-details.pdf'
    }
  ];

  // Initial page load animation
  useEffect(() => {
    setShowMainContent(true);
    // Start merchandise typewriter effect after a delay
    const merchandiseTimer = setTimeout(() => {
      setShowMerchandiseTyping(true);
    }, 2000);
    return () => clearTimeout(merchandiseTimer);
  }, []);

  // Merchandise typewriter effect
  useEffect(() => {
    if (showMerchandiseTyping && merchandiseCharIndex < merchandiseFullText.length) {
      const timer = setTimeout(() => {
        setMerchandiseText(prev => prev + merchandiseFullText[merchandiseCharIndex]);
        setMerchandiseCharIndex(prev => prev + 1);
      }, 80);
      return () => clearTimeout(timer);
    } else if (showMerchandiseTyping && merchandiseCharIndex >= merchandiseFullText.length) {
      // Text is complete, wait 5 seconds then restart
      const restartTimer = setTimeout(() => {
        setMerchandiseText('');
        setMerchandiseCharIndex(0);
      }, 5000);
      return () => clearTimeout(restartTimer);
    }
  }, [showMerchandiseTyping, merchandiseCharIndex, merchandiseFullText]);

  // Initial typewriter effect for code lines
  useEffect(() => {
    if (!showEvents && currentLineIndex < codeLines.length) {
      const currentLine = codeLines[currentLineIndex];
      
      if (currentCharIndex < currentLine.length) {
        const timer = setTimeout(() => {
          setDisplayedText(prev => prev + currentLine[currentCharIndex]);
          setCurrentCharIndex(prev => prev + 1);
        }, 50);
        
        return () => clearTimeout(timer);
      } else {
        // Move to next line
        const timer = setTimeout(() => {
          setDisplayedText(prev => prev + '\n');
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, 300);
        
        return () => clearTimeout(timer);
      }
    } else if (!showEvents && currentLineIndex >= codeLines.length) {
      // All code lines are done, clear text and start events after a brief pause
      const timer = setTimeout(() => {
        setDisplayedText('');
        setShowEvents(true);
        setIsTypingEvent(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentCharIndex, currentLineIndex, codeLines, showEvents]);

  // Event typewriter effect
  useEffect(() => {
    if (showEvents && isTypingEvent) {
      const currentEvent = upcomingEvents[currentEventIndex];
      const eventText = `${currentEvent.name}\n${currentEvent.date}\n${currentEvent.description}`;
      
      if (eventCharIndex < eventText.length) {
        const timer = setTimeout(() => {
          setDisplayedText(prev => prev + eventText[eventCharIndex]);
          setEventCharIndex(prev => prev + 1);
        }, 30);
        
        return () => clearTimeout(timer);
      } else {
        // Event typing is complete, show for 4 seconds then move to next
        setIsTypingEvent(false);
        setShowViewDetails(true);
      }
    }
  }, [showEvents, isTypingEvent, eventCharIndex, currentEventIndex, upcomingEvents]);

  // Handle event display and transition
  useEffect(() => {
    if (showEvents && !isTypingEvent && showViewDetails) {
      const displayTimer = setTimeout(() => {
        // Clear current event and move to next
        setDisplayedText('');
        setEventCharIndex(0);
        setShowViewDetails(false);
        setCurrentEventIndex(prev => (prev + 1) % upcomingEvents.length);
        setIsTypingEvent(true);
      }, 4000);
      
      setEventDisplayTimer(displayTimer);
      return () => clearTimeout(displayTimer);
    }
  }, [showEvents, isTypingEvent, showViewDetails, upcomingEvents.length]);

  const handleScrollToTop = () => {
    // First start the closing animation
    setIsClosingTechSection(true);
    
    // Hide main content briefly
    setShowMainContent(false);
    
    // Scroll to top smoothly
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
    
    // Then close the tech section and show main content with fade-in
    setTimeout(() => {
      setShowTechSection(false);
      setIsClosingTechSection(false);
      // Trigger main content fade-in after a brief delay
      setTimeout(() => {
        setShowMainContent(true);
      }, 100);
    }, 1200); // Longer delay for smooth scroll + fade out
  };

  const handleExploreTech = () => {
    setShowTechSection(true);
    // Smooth scroll to tech section
    setTimeout(() => {
      const techSection = document.getElementById('tech-section');
      if (techSection) {
        techSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Handle Join Community button click
  const handleJoinCommunity = () => {
    window.open(GOOGLE_FORM_URL, '_blank');
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleViewDetails = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  const techStack = [
    {
      category: 'Machine Learning',
      icon: 'fas fa-brain',
      description: 'Building intelligent systems that learn and adapt',
      color: 'from-blue-500 to-green-500',
      iconColor: 'text-blue-400',
      glowColor: 'drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]',
      hoverGlow: 'group-hover:drop-shadow-[0_0_30px_rgba(59,130,246,1)]'
    },
    {
      category: 'Python',
      icon: 'fab fa-python', 
      description: 'Powerful language for data science and automation',
      color: 'from-blue-500 to-green-500',
      iconColor: 'text-blue-400',
      glowColor: 'drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]',
      hoverGlow: 'group-hover:drop-shadow-[0_0_30px_rgba(59,130,246,1)]'
    },
    {
      category: 'Artificial Intelligence',
      icon: 'fas fa-robot',
      description: 'Creating systems that mimic human intelligence',
      color: 'from-purple-500 to-pink-500',
      iconColor: 'text-purple-400',
      glowColor: 'drop-shadow-[0_0_20px_rgba(147,51,234,0.8)]',
      hoverGlow: 'group-hover:drop-shadow-[0_0_30px_rgba(147,51,234,1)]'
    },
    {
      category: 'Scientific Computing',
      icon: 'fas fa-flask',
      description: 'Solving complex scientific problems with code',
      color: 'from-blue-500 to-cyan-500',
      iconColor: 'text-cyan-400',
      glowColor: 'drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]',
      hoverGlow: 'group-hover:drop-shadow-[0_0_30px_rgba(34,211,238,1)]'
    },
    {
      category: 'Web Development',
      icon: 'fas fa-code', 
      description: 'Creating modern, responsive web applications',
      color: 'from-green-500 to-teal-500',
      iconColor: 'text-green-400',
      glowColor: 'drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]',
      hoverGlow: 'group-hover:drop-shadow-[0_0_30px_rgba(34,197,94,1)]'
    },
    {
      category: 'Data Science',
      icon: 'fas fa-chart-line',
      description: 'Extracting and analyzing insights from complex datasets',
      color: 'from-yellow-500 to-orange-500',
      iconColor: 'text-yellow-400',
      glowColor: 'drop-shadow-[0_0_20px_rgba(234,179,8,0.8)]',
      hoverGlow: 'group-hover:drop-shadow-[0_0_30px_rgba(234,179,8,1)]'
    },
    {
      category: 'Large Language Models',
      icon: 'fas fa-comment-dots',
      description: 'Working with advanced language AI systems',
      color: 'from-pink-500 to-purple-500',
      iconColor: 'text-pink-400',
      glowColor: 'drop-shadow-[0_0_20px_rgba(244,114,182,0.8)]',
      hoverGlow: 'group-hover:drop-shadow-[0_0_30px_rgba(244,114,182,1)]'
    },
    {
      category: 'Deep Learning',
      icon: 'fas fa-network-wired',
      description: 'Building neural networks for complex problems',
      color: 'from-blue-500 to-indigo-500',
      iconColor: 'text-blue-400',
      glowColor: 'drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]',
      hoverGlow: 'group-hover:drop-shadow-[0_0_30px_rgba(59,130,246,1)]'
    }
  ];

  const tools = [
    { name: 'React', icon: 'fab fa-react', color: 'text-cyan-400', glowColor: 'drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]', hoverGlow: 'group-hover:drop-shadow-[0_0_25px_rgba(34,211,238,1)]' },
    { name: 'Node.js', icon: 'fab fa-node-js', color: 'text-green-400', glowColor: 'drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]', hoverGlow: 'group-hover:drop-shadow-[0_0_25px_rgba(34,197,94,1)]' },
    { name: 'Python', icon: 'fab fa-python', color: 'text-yellow-400', glowColor: 'drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]', hoverGlow: 'group-hover:drop-shadow-[0_0_25px_rgba(234,179,8,1)]' },
    { name: 'JavaScript', icon: 'fab fa-js', color: 'text-yellow-300', glowColor: 'drop-shadow-[0_0_15px_rgba(253,224,71,0.8)]', hoverGlow: 'group-hover:drop-shadow-[0_0_25px_rgba(253,224,71,1)]' },
    { name: 'Docker', icon: 'fab fa-docker', color: 'text-blue-400', glowColor: 'drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]', hoverGlow: 'group-hover:drop-shadow-[0_0_25px_rgba(59,130,246,1)]' },
    { name: 'GitHub', icon: 'fab fa-github', color: 'text-gray-300', glowColor: 'drop-shadow-[0_0_15px_rgba(156,163,175,0.8)]', hoverGlow: 'group-hover:drop-shadow-[0_0_25px_rgba(156,163,175,1)]' },
    { name: 'Databases', icon: 'fas fa-database', color: 'text-green-300', glowColor: 'drop-shadow-[0_0_15px_rgba(134,239,172,0.8)]', hoverGlow: 'group-hover:drop-shadow-[0_0_25px_rgba(134,239,172,1)]' }
  ];

  const faqData = [
    {
      question: "What programming languages do you teach?",
      answer: "We focus on Python, JavaScript, and emerging technologies like AI/ML frameworks. Our curriculum adapts to industry trends and member interests."
    },
    {
      question: "Do I need prior coding experience?",
      answer: "Not at all! We welcome beginners and provide mentorship for all skill levels. Our workshops start from basics and progress to advanced topics."
    },
    {
      question: "How often do you hold events?",
      answer: "We organize weekly workshops, monthly hackathons, and regular project showcases. Members also get access to exclusive tech talks and industry connections."
    },
    {
      question: "Is membership free?",
      answer: "Yes, membership is completely free for all IISER Thiruvananthapuram students. We believe in making technology education accessible to everyone."
    }
  ];

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (eventDisplayTimer) {
        clearTimeout(eventDisplayTimer);
      }
    };
  }, [eventDisplayTimer]);

  const stats = [
    { number: '40+', label: 'Active Members' },
    { number: '3+', label: 'Projects & Courses' },
    { number: '5+', label: 'Workshops Held' }
  ];

  const techTags = [
    'Machine Learning',
    'Web Development', 
    'AI Research'
  ];

  return (
    <DashboardLayout>
      <div className="h-full relative">
        {/* Font Awesome CDN */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        
        <div className={`relative z-10 h-full flex items-center justify-center px-4 sm:px-8 py-4 pb-0 transition-all duration-1000 ${
          showMainContent ? 'animate-in fade-in opacity-100' : 'opacity-0'
        }`}>
        <div className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-7xl'} ${isMobile ? 'flex flex-col space-y-8' : 'grid lg:grid-cols-2 gap-12'} items-start`}>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
          
          {/* Left Content */}
          <div className={`space-y-6 sm:space-y-8 ${isMobile ? '' : 'transform -translate-y-4'}`}>
            <div className="space-y-4 sm:space-y-6">
              <h1 className={`${isMobile ? 'text-3xl' : 'text-5xl lg:text-6xl'} font-bold leading-tight text-center sm:text-left`}>
                <span className="text-purple-400">Innovate</span>{' '}
                <span className="text-white">with</span>{' '}
                <span className="text-blue-400">Code</span>
              </h1>
              
              <p className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-100 leading-relaxed ${isMobile ? 'text-center' : 'max-w-lg'}`}>
                Join the coding club at IISER Thiruvananthapuram. We build solutions that{' '}
                <span className="text-purple-400 font-semibold underline decoration-purple-400/50">transform</span>{' '}
                the world through AI, machine learning, and cutting-edge tech.
              </p>
            </div>

            {/* Tech Tags */}
            <div className={`flex flex-wrap gap-2 sm:gap-3 ${isMobile ? 'justify-center' : ''}`}>
              {techTags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 sm:px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 ${isMobile ? 'text-xs' : 'text-sm'} font-medium backdrop-blur-sm`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Merchandise Typewriter Text */}
            <div className={`text-left ${isMobile ? 'pt-4' : 'pt-6'}`} style={{ marginLeft: '80px' }}>
              <button 
                onClick={() => window.location.href = '/merch'}
                className={`${isMobile ? 'text-lg' : 'text-xl'} text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-semibold min-h-[1.5em] flex items-center justify-start hover:scale-105 transition-transform duration-300 cursor-pointer group hover:underline decoration-yellow-400/70 underline-offset-4`}
              >
                <span>
                  {merchandiseText}
                  {showMerchandiseTyping && merchandiseCharIndex < merchandiseFullText.length && (
                    <span className="animate-pulse text-orange-400">|</span>
                  )}
                </span>
                {merchandiseCharIndex >= merchandiseFullText.length && (
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300 text-orange-400">→</span>
                )}
              </button>
            </div>

            {/* Action Buttons */}
            <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'flex-col sm:flex-row gap-4'}`}>
              <button 
                onClick={handleJoinCommunity}
                className={`group bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white ${isMobile ? 'px-6 py-3' : 'px-8 py-4'} rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center space-x-2`}>
                <span>🚀</span>
                <span className={isMobile ? 'text-sm' : ''}>Join Our Community</span>
              </button>
              
              <button 
                onClick={handleExploreTech}
                className={`group bg-white/10 hover:bg-white/20 border border-white/20 hover:border-purple-400/50 text-white ${isMobile ? 'px-6 py-3' : 'px-8 py-4'} rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm flex items-center justify-center space-x-2`}>
                <span>{'</>'}</span>
                <span className={isMobile ? 'text-sm' : ''}>Explore Tech</span>
              </button>
            </div>
          </div>

          {/* Right Content - Terminal */}
          <div className="relative">
            {/* Stats Section - Above Terminal */}
            <div className="mb-4 sm:mb-6">
              <div className={`grid grid-cols-3 ${isMobile ? 'gap-4' : 'gap-8'} text-center`}>
                {stats.map((stat) => (
                  <div key={stat.label} className="space-y-1 sm:space-y-2">
                    <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-300`}>
                      {stat.number}
                    </div>
                    <div className={`text-gray-200 ${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`bg-black/70 border border-purple-500/30 rounded-2xl ${isMobile ? 'p-4' : 'p-6'} shadow-2xl shadow-purple-500/10`}>
              {/* Terminal Header */}
              <div className="flex items-center space-x-2 pb-3 sm:pb-4 border-b border-purple-400/30">
                <div className="flex space-x-2">
                  <div className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} bg-red-500 rounded-full`}></div>
                  <div className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} bg-yellow-500 rounded-full`}></div>
                  <div className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} bg-green-500 rounded-full`}></div>
                </div>
                <div className={`text-purple-400 ${isMobile ? 'text-xs' : 'text-sm'} ml-3 sm:ml-4`}>codingclub@iisertvm:~</div>
              </div>
              
              {/* Terminal Content */}
              <div className={`mt-3 sm:mt-4 font-mono ${isMobile ? 'text-xs h-36' : 'text-sm h-48'} overflow-hidden`}>
                <pre className="text-blue-300 whitespace-pre-wrap leading-relaxed">
                  {displayedText}
                  <span className="animate-pulse text-purple-400">_</span>
                </pre>
                
                {/* View Details Button */}
                {showEvents && showViewDetails && (
                  <div className="mt-2 sm:mt-3">
                    <button
                      onClick={() => handleViewDetails(upcomingEvents[currentEventIndex].pdfUrl)}
                      className={`text-yellow-300 hover:text-yellow-200 underline decoration-yellow-300/50 hover:decoration-yellow-200/70 ${isMobile ? 'text-xs' : 'text-sm'} font-mono transition-colors duration-200`}
                    >
                      &gt; View Details [PDF]
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* FAQ Section - Below Both Containers */}
        <div className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-7xl'} mx-auto px-4 sm:px-8 pt-4 pb-8 transition-all duration-1000 ${
          showMainContent ? 'animate-in fade-in opacity-100' : 'opacity-0'
        }`}>
          <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-white text-center mb-4 sm:mb-6`}>Frequently Asked Questions</h3>
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'}`}>
            {faqData.map((faq, index) => (
              <div key={index} className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left text-white hover:text-purple-300 transition-colors duration-200 group"
                >
                  <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-sm'} pr-2`}>{faq.question}</span>
                  <div className="flex-shrink-0 transition-transform duration-200">
                    {expandedFaq === index ? (
                      <ChevronUp className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-purple-400`} />
                    ) : (
                      <ChevronDown className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-gray-300 group-hover:text-purple-400`} />
                    )}
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedFaq === index 
                    ? 'max-h-40 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}>
                  <p className={`${isMobile ? 'text-sm' : 'text-sm'} text-gray-100 leading-relaxed pl-2 border-l-2 border-purple-400/50`}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Credit Text */}
          <div className="text-center mt-6 sm:mt-8 pt-4 sm:pt-6">
            <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Website created by Antrin Maji
            </p>
          </div>
        </div>

        {/* Tech Stack Section */}
        {showTechSection && (
          <div 
            id="tech-section" 
            className={`min-h-screen bg-black/40 backdrop-blur-lg border-t border-purple-500/30 relative z-20 transition-all duration-700 ${
              isClosingTechSection 
                ? 'animate-out slide-out-to-bottom opacity-0' 
                : 'animate-in slide-in-from-bottom opacity-100'
            }`}
          >
            <div className={`container mx-auto px-4 sm:px-8 py-8 sm:py-16`}>
              {/* Header */}
              <div className="text-center mb-8 sm:mb-12">
                <h2 className={`${isMobile ? 'text-3xl' : 'text-5xl lg:text-6xl'} font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4 sm:mb-6`}>
                  Tech Stack
                </h2>
                <p className={`text-gray-300 ${isMobile ? 'text-base' : 'text-xl'} ${isMobile ? 'mx-auto' : 'max-w-3xl mx-auto'} leading-relaxed`}>
                  We work with cutting-edge technologies to build innovative solutions and advance the frontiers of computing
                </p>
                
                {/* Back to Top Button - Bare */}
                <button
                  onClick={handleScrollToTop}
                  className={`absolute ${isMobile ? 'top-4 right-4' : 'top-8 right-8'} text-gray-400 hover:text-white transition-all duration-300 group hover:scale-110`}
                >
                  <ChevronUp className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} group-hover:translate-y-[-2px] transition-transform duration-300`} />
                </button>
              </div>

              {/* Tech Categories Grid */}
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-8' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16'} mb-8 sm:mb-16`}>
                {techStack.map((tech, index) => (
                  <div
                    key={tech.category}
                    className="text-center group animate-in slide-in-from-bottom hover:scale-105 transition-all duration-500"
                    style={{ animationDelay: `${index * 150}ms`, animationDuration: '600ms' }}
                  >
                    {/* Icon with Glow */}
                    <div className={`mb-4 sm:mb-6 group-hover:scale-110 transition-all duration-300 ${tech.glowColor} ${tech.hoverGlow}`}>
                      <i className={`${tech.icon} ${isMobile ? 'text-6xl' : 'text-8xl'} ${tech.iconColor} group-hover:brightness-125 transition-all duration-300`}></i>
                    </div>
                    
                    {/* Title */}
                    <h3 className={`text-white font-bold mb-3 sm:mb-4 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                      {tech.category}
                    </h3>
                    
                    {/* Description */}
                    <p className={`text-gray-300 leading-relaxed mb-4 sm:mb-6 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                      {tech.description}
                    </p>
                    
                    {/* Progress Bar - No Container */}
                    <div className="w-full bg-gray-700/30 rounded-full h-2 mx-auto">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${tech.color} shadow-lg`}
                        style={{ 
                          width: '100%',
                          filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.6))'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tools Section */}
              <div className="border-t border-white/10 pt-8 sm:pt-12">
                <h3 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-8 sm:mb-12`}>
                  Tools & Technologies
                </h3>
                <div className={`flex flex-wrap justify-center ${isMobile ? 'gap-6' : 'gap-12'} mb-8 sm:mb-12`}>
                  {tools.map((tool, index) => (
                    <div
                      key={tool.name}
                      className="text-center group hover:scale-110 transition-all duration-300 animate-in slide-in-from-bottom"
                      style={{ animationDelay: `${(index * 100) + 800}ms`, animationDuration: '500ms' }}
                    >
                      {/* Icon with Glow */}
                      <div className={`mb-2 sm:mb-3 group-hover:scale-110 transition-all duration-300 ${tool.glowColor} ${tool.hoverGlow}`}>
                        <i className={`${tool.icon} ${isMobile ? 'text-3xl' : 'text-5xl'} ${tool.color} group-hover:brightness-125 transition-all duration-300`}></i>
                      </div>
                      {/* Tool Name */}
                      <span className={`font-semibold ${isMobile ? 'text-sm' : 'text-lg'} ${tool.color}`}>
                        {tool.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}