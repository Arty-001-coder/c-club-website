'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import DashboardLayout from '@/components/DashboardLayout';
import { Github, Linkedin, Mail, Users } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  github?: string;
  linkedin?: string;
  email?: string;
  year: string;
  department: string;
}

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  // Handle member selection with fade transition
  const handleMemberSelect = (member: TeamMember) => {
    if (selectedMember?.id === member.id) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedMember(member);
      setIsTransitioning(false);
    }, 200);
  };

  // Sample team data - replace with your actual team members
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Shreyansh',
      role: 'Club President',
      description: 'Passionate full-stack developer with expertise in React, Node.js, and cloud technologies. Leading the club towards innovative projects and fostering a collaborative learning environment. Currently working on AI-powered educational tools.',
      image: '/images/team/hero-tech.png',
      github: 'https://github.com/arjunk',
      linkedin: 'https://linkedin.com/in/arjunkrishnan',
      email: 'arjun@iisertvm.ac.in',
      year: 'Final Year',
      department: 'Computer Science'
    },
    {
      id: '2',
      name: 'Sarurabh Misra',
      role: 'Technical Lead',
      description: 'Machine learning enthusiast and open-source contributor. Specializes in Python, TensorFlow, and data science. Has contributed to major open-source projects and leads our research initiatives.',
      image: '/images/team/saurabh.jpg',
      github: 'https://github.com/saurab',
      linkedin: 'https://linkedin.com/in/priyasharma',
      email: 'saurabh23@iisertvm.ac.in',
      year: 'Third Year',
      department: 'i^2 Mathematics'
    },
    {
      id: '3',
      name: 'Antrin',
      role: 'Desgin and Technical Lead',
      description: 'Ai and physics enthusiast with a keen eye for design and photography. Currently creating the new club website.',
      image: '/images/team/antrin.jpg',
      github: 'https://github.com/Antrin018',
      linkedin: 'https://linkedin.com/in/antrin-maji-559723343',
      email: 'antrin24@iisertvm.ac.in',
      year: 'Second Year',
      department: 'Physics'
    },
    {
        id: '4',
        name: 'Ayush Siddha',
        role: 'Technical Lead',
        description: 'ML, AI and Automation enthusiast. Just coding The Work, Not Life ^_^',
        image: '/images/team/siddha.png',
        github: 'https://github.com/AyushTheKingSiddha',
        linkedin:'https://www.linkedin.com/in/ayush-siddha-614a14332/',
        email: 'parimal24@iisertvm.ac.in',
        year: 'Second Year',
        department:'Data Science',
      }
  ];

  return (
    <DashboardLayout>
      <div className={`min-h-full transition-all duration-1000 ${
        isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Header Section */}
        <div className={`relative ${isMobile ? 'py-8 px-4' : 'py-16 px-8'} transition-all duration-1000 delay-200 ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className={`${isMobile ? 'max-w-sm' : 'max-w-7xl'} mx-auto text-center`}>
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <h1 className={`${isMobile ? 'text-3xl' : 'text-5xl lg:text-6xl'} font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-white bg-clip-text text-transparent`}>
                Meet Our <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">Team</span>
              </h1>
            </div>
            <p className={`${isMobile ? 'text-base' : 'text-xl'} text-gray-300 leading-relaxed ${isMobile ? 'mx-auto' : 'max-w-3xl mx-auto'}`}>
              The talented minds behind our work. A diverse group of passionate developers, 
              designers, and researchers driving the community.
            </p>
          </div>
        </div>

        <div className={`${isMobile ? 'max-w-sm' : 'max-w-7xl'} mx-auto ${isMobile ? 'px-4 pb-8' : 'px-8 pb-16'} transition-all duration-1000 delay-400 ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          
          {/* Mobile Layout */}
          {isMobile ? (
            <div className="space-y-6">
              {/* Team Members Grid for Mobile */}
              <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 text-center">The Team</h2>
                
                <div className="grid grid-cols-2 gap-3">
                  {teamMembers.map((member, index) => (
                    <div
                      key={member.id}
                      className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        selectedMember?.id === member.id ? 'scale-105' : ''
                      } ${
                        isPageLoaded 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-4'
                      }`}
                      style={{
                        transitionDelay: `${600 + (index * 100)}ms`
                      }}
                      onClick={() => handleMemberSelect(member)}
                    >
                      <div className="flex flex-col items-center p-3 rounded-xl hover:bg-gradient-to-r transition-all duration-200">
                        {/* Circular Photo */}
                        <div className={`relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 transition-all duration-200 mb-2 ${
                          selectedMember?.id === member.id 
                            ? 'border-purple-400 shadow-lg shadow-purple-400/50' 
                            : 'border-white/40 hover:border-purple-400/70'
                        }`}>
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        {/* Name and Role */}
                        <div className="text-center">
                          <h3 className={`font-semibold text-sm transition-colors duration-200 ${
                            selectedMember?.id === member.id ? 'text-purple-300' : 'text-white'
                          }`}>
                            {member.name}
                          </h3>
                          <p className="text-xs text-blue-300">{member.role}</p>
                          <p className="text-xs text-gray-400">{member.year}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Member Details for Mobile */}
              <div className="bg-black/70 border border-white/20 rounded-2xl overflow-hidden">
                {selectedMember ? (
                  <div className={`p-6 transition-all duration-300 ${
                    isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                  }`}>
                    {/* Member Photo - Centered and Smaller */}
                    <div className="flex justify-center mb-6">
                      <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-purple-400/50 shadow-lg shadow-purple-400/30">
                        <Image
                          src={selectedMember.image}
                          alt={selectedMember.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Member Info */}
                    <div>
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-1">
                            {selectedMember.name}
                          </h2>
                          <p className="text-purple-300 text-base font-semibold mb-1">
                            {selectedMember.role}
                          </p>
                          <p className="text-blue-300 text-sm">
                            {selectedMember.year} • {selectedMember.department}
                          </p>
                        </div>
                        
                        <p className="text-gray-300 leading-relaxed text-sm">
                          {selectedMember.description}
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex justify-center space-x-4">
                          {selectedMember.github && (
                            <a
                              href={selectedMember.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                            >
                              <Github size={18} className="text-gray-300 hover:text-white" />
                            </a>
                          )}
                          {selectedMember.linkedin && (
                            <a
                              href={selectedMember.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-blue-600/20 hover:bg-blue-600/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                            >
                              <Linkedin size={18} className="text-blue-400 hover:text-blue-300" />
                            </a>
                          )}
                          {selectedMember.email && (
                            <a
                              href={`mailto:${selectedMember.email}`}
                              className="w-10 h-10 bg-green-600/20 hover:bg-green-600/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                            >
                              <Mail size={18} className="text-green-400 hover:text-green-300" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Default State for Mobile */
                  <div className={`h-64 flex items-center justify-center transition-all duration-300 ${
                    isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                  }`}>
                    <div className="text-center p-6">
                      <Users size={48} className="text-purple-400 mx-auto mb-3" />
                      <h3 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-2">
                        Select a Team Member
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Tap on any team member to learn more about them
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Desktop Layout */
            <div className="grid lg:grid-cols-12 gap-8 h-[700px]">
              
              {/* Left Side - Team Members List */}
              <div className="lg:col-span-4">
                <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 h-full">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6 text-center">The Team</h2>
                  
                  <div className="overflow-y-auto h-[580px] pr-2">
                    <div className="space-y-4">
                      {teamMembers.map((member, index) => (
                        <div
                          key={member.id}
                          className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                            selectedMember?.id === member.id ? 'scale-105' : ''
                          } ${
                            isPageLoaded 
                              ? 'opacity-100 translate-x-0' 
                              : 'opacity-0 -translate-x-4'
                          }`}
                          style={{
                            transitionDelay: `${600 + (index * 100)}ms`
                          }}
                          onClick={() => handleMemberSelect(member)}
                        >
                          <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gradient-to-r transition-all duration-200">
                            {/* Circular Photo */}
                            <div className={`relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                              selectedMember?.id === member.id 
                                ? 'border-purple-400 shadow-lg shadow-purple-400/50' 
                                : 'border-white/40 hover:border-purple-400/70'
                            }`}>
                              <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            
                            {/* Name and Role */}
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-semibold truncate transition-colors duration-200 ${
                                selectedMember?.id === member.id ? 'text-purple-300' : 'text-white'
                              }`}>
                                {member.name}
                              </h3>
                              <p className="text-sm text-blue-300 truncate">{member.role}</p>
                              <p className="text-xs text-gray-400">{member.year} • {member.department}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Selected Member Details */}
              <div className="lg:col-span-8">
                <div className="bg-black/70 border border-white/20 rounded-2xl overflow-hidden h-full">
                  {selectedMember ? (
                    <div className={`grid md:grid-cols-5 h-full transition-all duration-300 ${
                      isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                    }`}>
                      {/* Member Info */}
                      <div className="md:col-span-2 p-8 flex flex-col justify-center">
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-2">
                              {selectedMember.name}
                            </h2>
                            <p className="text-purple-300 text-lg font-semibold mb-1">
                              {selectedMember.role}
                            </p>
                            <p className="text-blue-300 text-sm">
                              {selectedMember.year} • {selectedMember.department}
                            </p>
                          </div>
                          
                          <p className="text-gray-300 leading-relaxed text-sm">
                            {selectedMember.description}
                          </p>
                          
                          {/* Social Links */}
                          <div className="flex space-x-4">
                            {selectedMember.github && (
                              <a
                                href={selectedMember.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                              >
                                <Github size={18} className="text-gray-300 hover:text-white" />
                              </a>
                            )}
                            {selectedMember.linkedin && (
                              <a
                                href={selectedMember.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-blue-600/20 hover:bg-blue-600/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                              >
                                <Linkedin size={18} className="text-blue-400 hover:text-blue-300" />
                              </a>
                            )}
                            {selectedMember.email && (
                              <a
                                href={`mailto:${selectedMember.email}`}
                                className="w-10 h-10 bg-green-600/20 hover:bg-green-600/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                              >
                                <Mail size={18} className="text-green-400 hover:text-green-300" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Large Member Photo */}
                      <div className="md:col-span-3 relative">
                        <Image
                          src={selectedMember.image}
                          alt={selectedMember.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-black/40" />
                      </div>
                    </div>
                  ) : (
                    /* Default State */
                    <div className={`h-full flex items-center justify-center transition-all duration-300 ${
                      isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                    }`}>
                      <div className="text-center">
                        <Users size={64} className="text-purple-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-2">
                          Select a Team Member
                        </h3>
                        <p className="text-gray-400">
                          Click on any team member to learn more about them
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Join Now Button */}
          <div className={`${isMobile ? 'mt-6' : 'mt-8'} text-center transition-all duration-1000 delay-800 ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <button className={`group bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-500 hover:via-blue-500 hover:to-purple-500 text-white font-semibold ${isMobile ? 'py-3 px-6' : 'py-4 px-8'} rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 border border-purple-400/30`}>
              <div className="flex items-center space-x-3">
                <Users size={isMobile ? 20 : 24} className="group-hover:animate-pulse" />
                <span className={isMobile ? 'text-base' : 'text-lg'}>Join Now</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}