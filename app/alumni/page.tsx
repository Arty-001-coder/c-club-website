'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import DashboardLayout from '@/components/DashboardLayout';
import { ChevronLeft, ChevronRight, Linkedin, Mail } from 'lucide-react';

interface AlumniMember {
  id: string;
  name: string;
  role: string;
  company: string;
  batch: string;
  passoutYear: string;
  image: string;
  linkedin?: string;
  email?: string;
  description: string;
}

export default function AlumniPage() {
  const [currentIndex, setCurrentIndex] = useState(2); // Start with middle item
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Page load animation
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const alumniMembers: AlumniMember[] = [
    {
      id: '1',
      name: 'Asutosh Kumar',
      role: 'Senior Software Engineer',
      company: 'Google',
      batch: 'CS 2016-2020',
      passoutYear: '2020',
      image: '/images/alumni/alumni_ashutosh.jpg',
      linkedin: 'https://linkedin.com/in/aditisharma',
      email: 'aditi.sharma@gmail.com',
      description: 'Leading mobile development initiatives at Google, specializing in Android architecture and performance optimization. Passionate about mentoring young developers and contributing to open-source projects.'
    },
    {
      id: '2',
      name: 'Krishna Kumar Singh',
      role: 'Data Scientist',
      company: 'Microsoft',
      batch: 'Physics 2015-2019',
      passoutYear: '2019',
      image: '/images/alumni/alumni_krishna.jpg',
      linkedin: 'https://linkedin.com/in/rajeshkumar',
      email: 'rajesh.kumar@microsoft.com',
      description: 'Building ML models for Azure cognitive services, focusing on natural language processing and computer vision. Published researcher with 10+ papers in top-tier conferences.'
    },
    {
      id: '3',
      name: 'Ashwin Nair',
      role: 'Product Manager',
      company: 'Meta',
      batch: 'Mathematics 2014-2018',
      passoutYear: '2018',
      image: '/images/alumni/ashwin.jpeg',
      linkedin: 'https://linkedin.com/in/priyanair',
      email: 'priya.nair@meta.com',
      description: 'Managing WhatsApp Business API products, driving strategy for emerging markets and small business growth. Featured in Forbes 30 Under 30 for her innovative product leadership.'
    },
    
  ];

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + alumniMembers.length) % alumniMembers.length);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % alumniMembers.length);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const getVisibleItems = () => {
    if (isMobile) {
      // For mobile, show only 1 item: current
      const items = [];
      const index = currentIndex;
      items.push({
        ...alumniMembers[index],
        position: 0,
        isCenter: true
      });
      return items;
    } else {
      // Desktop version shows 5 items
      const items = [];
      for (let i = -2; i <= 2; i++) {
        const index = (currentIndex + i + alumniMembers.length) % alumniMembers.length;
        items.push({
          ...alumniMembers[index],
          position: i,
          isCenter: i === 0
        });
      }
      return items;
    }
  };

  const visibleItems = getVisibleItems();
  const centerAlumni = visibleItems.find(item => item.isCenter);

  return (
    <DashboardLayout>
      <div className={`min-h-full ${isMobile ? 'py-8' : 'py-16'} transition-all duration-1000 ${
        isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Header */}
        <div className={`text-center ${isMobile ? 'mb-8 px-4' : 'mb-16'} transition-all duration-1000 delay-200 ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} uppercase tracking-widest mb-3 sm:mb-4`}>
            YOUR SUCCESS STORIES START HERE
          </p>
          <h1 className={`${isMobile ? 'text-3xl' : 'text-5xl lg:text-6xl'} font-bold text-white mb-4 sm:mb-6`}>
            MEET OUR <span className="text-purple-400">ALUMNI</span>
          </h1>
          <p className={`text-gray-400 ${isMobile ? 'text-base px-2' : 'text-lg max-w-3xl mx-auto'} leading-relaxed`}>
            Discover the incredible journeys of our graduates who are making significant impact 
            across leading technology companies and innovative startups worldwide.
          </p>
        </div>

        {/* Alumni Carousel */}
        <div className={`relative ${isMobile ? 'max-w-sm' : 'max-w-7xl'} mx-auto ${isMobile ? 'px-4' : 'px-8'} transition-all duration-1000 delay-400 ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Navigation Buttons */}
          {!isMobile && (
            <>
              <button
                onClick={prevSlide}
                disabled={isTransitioning}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              
              <button
                onClick={nextSlide}
                disabled={isTransitioning}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <ChevronRight size={24} className="text-white" />
              </button>
            </>
          )}

          {/* Alumni Images */}
          <div className={`${isMobile ? 'relative' : ''} flex items-end justify-center ${isMobile ? 'space-x-2' : 'space-x-4'} ${isMobile ? 'mb-6' : 'mb-12'}`}>
            
            {/* Mobile Navigation Buttons - Positioned around center image */}
            {isMobile && (
              <>
                <button
                  onClick={prevSlide}
                  disabled={isTransitioning}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <ChevronLeft size={20} className="text-white" />
                </button>
                
                <button
                  onClick={nextSlide}
                  disabled={isTransitioning}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <ChevronRight size={20} className="text-white" />
                </button>
              </>
            )}
            {visibleItems.map((alumni) => {
              const isCenter = alumni.position === 0;
              const isAdjacent = Math.abs(alumni.position) === 1;
              const isFar = Math.abs(alumni.position) === 2;
              
              // Mobile sizing
              const mobileSize = 'w-48 h-64'; // Only center image on mobile
              // Desktop sizing
              const desktopSize = isCenter 
                ? 'w-80 h-96' 
                : isAdjacent 
                  ? 'w-64 h-80' 
                  : 'w-48 h-64';
              
              return (
                <div
                  key={`${alumni.id}-${alumni.position}`}
                  className={`relative transition-all duration-500 ease-in-out cursor-pointer ${
                    isMobile ? mobileSize : desktopSize
                  } ${
                    isFar ? 'opacity-60' : 'opacity-100'
                  } ${
                    isTransitioning ? 'transform' : ''
                  }`}
                  style={{
                    transform: isTransitioning ? `translateX(${alumni.position * (isMobile ? -10 : -15)}px)` : 'translateX(0px)',
                    transitionProperty: 'all, transform',
                    transitionDuration: '500ms, 400ms',
                    transitionTimingFunction: 'ease-in-out'
                  }}
                  onClick={() => {
                    if (!isCenter && !isTransitioning) {
                      const steps = alumni.position;
                      let newIndex = currentIndex;
                      for (let i = 0; i < Math.abs(steps); i++) {
                        if (steps > 0) {
                          newIndex = (newIndex + 1) % alumniMembers.length;
                        } else {
                          newIndex = (newIndex - 1 + alumniMembers.length) % alumniMembers.length;
                        }
                      }
                      setIsTransitioning(true);
                      setCurrentIndex(newIndex);
                      setTimeout(() => setIsTransitioning(false), 400);
                    }
                  }}
                >
                  <div className="relative w-full h-full overflow-hidden rounded-2xl group">
                    <Image
                      src={alumni.image}
                      alt={alumni.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300 ${
                      isCenter 
                        ? 'from-black/60 via-transparent to-transparent' 
                        : 'from-black/80 via-black/40 to-transparent'
                    }`} />
                    
                    {/* Name and Year for non-center items - Desktop only */}
                    {!isCenter && !isMobile && (
                      <div className="absolute bottom-4 left-4 right-4 text-center">
                        <h3 className="text-white font-bold text-lg mb-1">{alumni.name}</h3>
                        <p className="text-gray-300 text-sm">Class of {alumni.passoutYear}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center Alumni Details */}
          {centerAlumni && (
            <div className={`bg-black/50 backdrop-blur-lg border border-white/20 rounded-3xl ${isMobile ? 'p-4' : 'p-8'} ${isMobile ? 'max-w-xs' : 'max-w-4xl'} mx-auto transition-all duration-400 ease-in-out ${
              isTransitioning ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
            }`}>
              <div className="text-center space-y-4 sm:space-y-6">
                <div>
                  <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold text-white mb-2`}>
                    {centerAlumni.name}
                  </h2>
                  <p className={`text-purple-400 ${isMobile ? 'text-base' : 'text-xl'} font-semibold mb-1`}>
                    {centerAlumni.role}
                  </p>
                  <p className={`text-blue-400 ${isMobile ? 'text-sm' : 'text-lg'} font-medium mb-3 sm:mb-4`}>
                    {centerAlumni.company}
                  </p>
                </div>

                <div className={`flex items-center justify-center ${isMobile ? 'space-x-4 text-sm' : 'space-x-8'} text-gray-300`}>
                  <div>
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Batch:</span>
                    <p className={`text-white font-semibold ${isMobile ? 'text-sm' : ''}`}>{centerAlumni.batch}</p>
                  </div>
                  <div>
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Graduated:</span>
                    <p className={`text-white font-semibold ${isMobile ? 'text-sm' : ''}`}>{centerAlumni.passoutYear}</p>
                  </div>
                </div>

                <p className={`text-gray-300 leading-relaxed ${isMobile ? 'text-sm max-w-sm' : 'max-w-3xl'} mx-auto`}>
                  {centerAlumni.description}
                </p>

                {/* Social Links */}
                <div className={`flex items-center justify-center ${isMobile ? 'space-x-4' : 'space-x-6'}`}>
                  {centerAlumni.linkedin && (
                    <a
                      href={centerAlumni.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} bg-blue-600/20 hover:bg-blue-600/40 border border-blue-400/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110`}
                    >
                      <Linkedin size={isMobile ? 16 : 20} className="text-blue-400" />
                    </a>
                  )}
                  {centerAlumni.email && (
                    <a
                      href={`mailto:${centerAlumni.email}`}
                      className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} bg-purple-600/20 hover:bg-purple-600/40 border border-purple-400/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110`}
                    >
                      <Mail size={isMobile ? 16 : 20} className="text-purple-400" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Indicators */}
          <div className={`flex justify-center space-x-2 ${isMobile ? 'mt-4' : 'mt-8'}`}>
            {alumniMembers.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true);
                    setCurrentIndex(index);
                    setTimeout(() => setIsTransitioning(false), 400);
                  }
                }}
                disabled={isTransitioning}
                className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} rounded-full transition-all duration-300 disabled:cursor-not-allowed ${
                  index === currentIndex 
                    ? `bg-purple-400 ${isMobile ? 'w-6' : 'w-8'}` 
                    : 'bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className={`${isMobile ? 'mt-10 max-w-sm px-4' : 'mt-20 max-w-4xl px-8'} mx-auto transition-all duration-1000 delay-600 ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-2 md:grid-cols-4 gap-8'} text-center`}>
            <div>
              <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-purple-400 mb-2`}>100+</div>
              <div className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>Alumni Worldwide</div>
            </div>
            <div>
              <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-blue-400 mb-2`}>50+</div>
              <div className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>Top Companies</div>
            </div>
            <div>
              <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-purple-400 mb-2`}>15+</div>
              <div className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>Countries</div>
            </div>
            <div>
              <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-blue-400 mb-2`}>25+</div>
              <div className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>Startups Founded</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}