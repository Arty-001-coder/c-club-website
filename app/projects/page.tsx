'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { ExternalLink, X, Github, Globe, Play, Clock, BookOpen, Loader2, ChevronLeft, Plus } from 'lucide-react';
import { projectsApi, coursesApi, ProjectWithImage, CourseWithImage } from '@/lib/supabase';

export default function ProjectsCoursesPage() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<(ProjectWithImage | CourseWithImage) | null>(null);
  const [selectedType, setSelectedType] = useState<'project' | 'course' | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [projects, setProjects] = useState<ProjectWithImage[]>([]);
  const [courses, setCourses] = useState<CourseWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    setIsClient(true);
    loadData();
  }, []);

  // Page load animation - trigger after data is loaded
  useEffect(() => {
    if (!loading) {
      // Small delay to ensure smooth transition from loading state
      const timer = setTimeout(() => {
        setIsPageLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projectsData, coursesData] = await Promise.all([
        projectsApi.getAll(),
        coursesApi.getAll()
      ]);
      
      setProjects(projectsData);
      setCourses(coursesData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToAdmin = () => {
    router.push('/admin');
  };

  if (!isClient) {
    return null;
  }

  const openDetails = (item: ProjectWithImage | CourseWithImage, type: 'project' | 'course') => {
    setSelectedItem(item);
    setSelectedType(type);
  };

  const closeDetails = () => {
    setSelectedItem(null);
    setSelectedType(null);
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-full flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
            <p className="text-white text-lg">Loading projects and courses...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">⚠️ Error</div>
            <p className="text-white text-lg mb-4">{error}</p>
            <button 
              onClick={loadData}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={`min-h-full transition-all duration-1000 ${
        isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Header */}
        <div className={`text-center py-8 lg:py-12 px-4 lg:px-8 transition-all duration-1000 delay-200 ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className='text-blue-400 bg-clip-text drop-shadow-xl'>Projects</span> 
            <span className='text-white bg-clip-text drop-shadow-xl'> & </span>
            <span className='text-purple-400 bg-clip-text drop-shadow-xl'>Resources</span>
          </h1>
          <p className="text-gray-400 text-base lg:text-lg max-w-3xl mx-auto">
            Explore our innovative projects and join our comprehensive courses to advance your skills
          </p>
        </div>

        {/* Split Layout Container */}
        <div className={`max-w-7xl mx-auto px-4 lg:px-8 pb-8 lg:pb-16 transition-all duration-1000 delay-400 ${
          isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {selectedItem && selectedType ? (
            /* Expanded Detail View */
            <div className="space-y-6 lg:space-y-8">
              {/* Back button */}
              <button
                onClick={closeDetails}
                className="flex items-center space-x-2 text-white hover:text-purple-400 transition-colors p-2 lg:p-0"
              >
                <ChevronLeft size={isMobile ? 24 : 20} className="lg:hidden" />
                <X size={20} className="hidden lg:block" />
                <span className="text-sm lg:text-base">Back to {selectedType === 'project' ? 'Projects' : 'Courses'}</span>
              </button>

              <div className="relative bg-black/60 backdrop-blur-lg border border-white/10 rounded-2xl lg:rounded-3xl overflow-hidden">
                {selectedType === 'project' ? (
                  /* Project Details */
                  <div className="relative min-h-screen">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={selectedItem.image}
                        alt={selectedItem.title}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                      />
                      {/* Dark overlay for text readability */}
                      <div className="absolute inset-0 bg-black/70"></div>
                    </div>

                    {/* Content overlay */}
                    <div className="relative z-10 p-4 lg:p-8 space-y-6 lg:space-y-8">
                      <div>
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 space-y-4 lg:space-y-0">
                          <div className="flex-1">
                            <span className="text-xs lg:text-sm text-purple-400 font-medium uppercase tracking-wide drop-shadow">
                              {(selectedItem as ProjectWithImage).category}
                            </span>
                            <h1 className="text-2xl lg:text-4xl font-bold text-white mt-2 drop-shadow-lg">{selectedItem.title}</h1>
                            
                            {/* Author info - Mobile: stacked, Desktop: inline */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-4 space-y-3 sm:space-y-0">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 lg:w-8 lg:h-8 rounded-full overflow-hidden border-2 border-white/20">
                                  <Image
                                    src={(selectedItem as ProjectWithImage).authorAvatar}
                                    alt={(selectedItem as ProjectWithImage).author}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="text-white font-medium drop-shadow">{(selectedItem as ProjectWithImage).author}</p>
                                  <p className="text-gray-200 text-sm drop-shadow">{(selectedItem as ProjectWithImage).date}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <span className={`px-3 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-semibold backdrop-blur-sm self-start ${
                            (selectedItem as ProjectWithImage).status === 'Completed' ? 'bg-green-600/40 text-green-200 border border-green-400/40' :
                            (selectedItem as ProjectWithImage).status === 'In Progress' ? 'bg-blue-600/40 text-blue-200 border border-blue-400/40' :
                            'bg-orange-600/40 text-orange-200 border border-orange-400/40'
                          }`}>
                            {(selectedItem as ProjectWithImage).status}
                          </span>
                        </div>

                        <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 drop-shadow-lg">About This Project</h3>
                        <p className="text-gray-100 leading-relaxed mb-6 lg:mb-8 text-base lg:text-lg drop-shadow max-w-4xl">
                          {(selectedItem as ProjectWithImage).fullDescription}
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                          <div>
                            <h4 className="text-lg lg:text-xl font-semibold text-white mb-4 drop-shadow">Tech Stack</h4>
                            <div className="flex flex-wrap gap-2 lg:gap-3">
                              {(selectedItem as ProjectWithImage).techStack.map((tech) => (
                                <span key={tech} className="bg-purple-600/40 text-purple-200 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-purple-400/40 backdrop-blur-sm drop-shadow text-sm">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-lg lg:text-xl font-semibold text-white mb-4 drop-shadow">Key Features</h4>
                            <ul className="space-y-2 lg:space-y-3">
                              {(selectedItem as ProjectWithImage).features.map((feature) => (
                                <li key={feature} className="text-gray-100 flex items-start drop-shadow text-sm lg:text-base">
                                  <span className="text-purple-300 mr-2 lg:mr-3 mt-1 drop-shadow">•</span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 mt-6 lg:mt-8">
                          {(selectedItem as ProjectWithImage).githubLink && (
                            <a
                              href={(selectedItem as ProjectWithImage).githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center space-x-2 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/50 rounded-lg px-4 lg:px-6 py-3 transition-all duration-200 backdrop-blur-sm drop-shadow"
                            >
                              <Github size={18} className="text-purple-200" />
                              <span className="text-purple-200 font-medium">View Code</span>
                            </a>
                          )}
                          {(selectedItem as ProjectWithImage).liveDemo && (
                            <a
                              href={(selectedItem as ProjectWithImage).liveDemo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center space-x-2 bg-blue-600/40 hover:bg-blue-600/60 border border-blue-400/50 rounded-lg px-4 lg:px-6 py-3 transition-all duration-200 backdrop-blur-sm drop-shadow"
                            >
                              <Globe size={18} className="text-blue-200" />
                              <span className="text-blue-200 font-medium">Live Demo</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Course Details */
                  <div className="relative min-h-screen">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={selectedItem.image}
                        alt={selectedItem.title}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                      />
                      {/* Dark overlay for text readability */}
                      <div className="absolute inset-0 bg-black/70"></div>
                    </div>

                    {/* Content overlay */}
                    <div className="relative z-10 p-4 lg:p-8 space-y-6 lg:space-y-8">
                      <div>
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
                          <div className="flex-1">
                            <h1 className="text-2xl lg:text-4xl font-bold text-white mb-4 drop-shadow-lg">{selectedItem.title}</h1>
                            
                            {/* Course metadata - Stack vertically on mobile */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
                              <div className="flex items-center space-x-3">
                                <div>
                                  <p className="text-blue-200 font-semibold drop-shadow">{(selectedItem as CourseWithImage).instructor}</p>
                                  <p className="text-gray-200 text-sm drop-shadow">Instructor</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 sm:flex sm:space-x-6 sm:gap-0">
                                <div>
                                  <p className="text-white font-semibold drop-shadow">{(selectedItem as CourseWithImage).duration}</p>
                                  <p className="text-gray-200 text-sm drop-shadow">{(selectedItem as CourseWithImage).lessons} lessons</p>
                                </div>
                                <div>
                                  <p className="text-white font-semibold drop-shadow">Starts {(selectedItem as CourseWithImage).startDate}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <span className={`px-3 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-semibold backdrop-blur-sm self-start ${
                            (selectedItem as CourseWithImage).level === 'Beginner' ? 'bg-green-600/40 text-green-200 border border-green-400/40' :
                            (selectedItem as CourseWithImage).level === 'Intermediate' ? 'bg-blue-600/40 text-blue-200 border border-blue-400/40' :
                            'bg-red-600/40 text-red-200 border border-red-400/40'
                          }`}>
                            {(selectedItem as CourseWithImage).level}
                          </span>
                        </div>

                        <p className="text-gray-100 leading-relaxed mb-6 lg:mb-8 text-base lg:text-lg drop-shadow max-w-4xl">
                          {(selectedItem as CourseWithImage).fullDescription}
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                          <div>
                            <h4 className="text-lg lg:text-xl font-semibold text-white mb-4 drop-shadow">What You&apos;ll Learn</h4>
                            <ul className="space-y-2 lg:space-y-3">
                              {(selectedItem as CourseWithImage).whatYouWillLearn.map((item) => (
                                <li key={item} className="text-gray-100 flex items-start drop-shadow text-sm lg:text-base">
                                  <span className="text-blue-300 mr-2 lg:mr-3 mt-1 drop-shadow">✓</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-lg lg:text-xl font-semibold text-white mb-4 drop-shadow">Prerequisites</h4>
                            <ul className="space-y-2 lg:space-y-3">
                              {(selectedItem as CourseWithImage).prerequisites.map((prereq) => (
                                <li key={prereq} className="text-gray-100 flex items-start drop-shadow text-sm lg:text-base">
                                  <span className="text-purple-300 mr-2 lg:mr-3 mt-1 drop-shadow">•</span>
                                  {prereq}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-8 lg:mt-12">
                          <h4 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6 drop-shadow">Course Syllabus</h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                            {(selectedItem as CourseWithImage).syllabus.map((topic, index) => (
                              <div key={topic} className="flex items-center space-x-3 p-3 lg:p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 drop-shadow">
                                <span className="w-7 h-7 lg:w-8 lg:h-8 bg-blue-600/40 text-blue-200 rounded-full flex items-center justify-center text-xs lg:text-sm font-semibold flex-shrink-0 border border-blue-400/40">
                                  {index + 1}
                                </span>
                                <span className="text-gray-100 text-sm lg:text-base">{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 lg:mt-8">
                          <a
                            href={(selectedItem as CourseWithImage).joinLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-700/80 hover:to-purple-700/80 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 backdrop-blur-sm border border-white/30 drop-shadow w-full sm:w-auto"
                          >
                            <Play size={18} />
                            <span>Enroll Now</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Main listing view - responsive layout */
            <div className={`${
              isMobile 
                ? 'space-y-8' 
                : 'grid lg:grid-cols-3 gap-8 h-[calc(100vh-300px)]'
            }`}>
              
              {/* Projects Section */}
              <div className={`${
                isMobile 
                  ? 'flex flex-col' 
                  : 'lg:col-span-2 flex flex-col min-h-0'
              }`}>
                <h2 className={`text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6 flex-shrink-0 transition-all duration-1000 delay-500 ${
                  isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}>
                  Featured Projects ({projects.length})
                </h2>
                
                {projects.length === 0 ? (
                  <div className={`flex-1 flex items-center justify-center transition-all duration-1000 delay-600 ${
                    isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    <p className="text-gray-400 text-center">No projects found</p>
                  </div>
                ) : (
                  <div className={`${
                    isMobile 
                      ? 'space-y-4' 
                      : 'flex-1 overflow-y-auto pr-4 space-y-6 projects-scrollbar min-h-0'
                  }`}>
                    {projects.map((project, index) => (
                      <div
                        key={project.id}
                        className={`group cursor-pointer transition-all duration-1000 ${
                          isPageLoaded 
                            ? 'opacity-100 translate-x-0' 
                            : 'opacity-0 -translate-x-8'
                        }`}
                        style={{
                          transitionDelay: `${600 + (index * 100)}ms`
                        }}
                        onClick={() => openDetails(project, 'project')}
                      >
                        <div className="bg-black/70 border border-white/10 rounded-xl lg:rounded-2xl overflow-hidden hover:bg-black/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
                          {/* Mobile: Stack vertically, Desktop: Side by side */}
                          <div className={`${
                            isMobile 
                              ? 'flex flex-col' 
                              : 'flex'
                          }`}>
                            {/* Project Image */}
                            <div className={`${
                              isMobile 
                                ? 'relative h-48' 
                                : 'w-1/3 relative'
                            }`}>
                              <div className={`${
                                isMobile 
                                  ? 'h-full' 
                                  : 'aspect-square'
                              }`}>
                                <Image
                                  src={project.image}
                                  alt={project.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              </div>
                            </div>

                            {/* Project Content */}
                            <div className={`${
                              isMobile 
                                ? 'p-4' 
                                : 'w-2/3 p-6 flex flex-col justify-between'
                            }`}>
                              <div>
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <span className="text-xs text-purple-400 font-medium uppercase tracking-wide">
                                      {project.category}
                                    </span>
                                    <h3 className={`${
                                      isMobile 
                                        ? 'text-lg' 
                                        : 'text-xl'
                                    } font-bold text-white mt-1 group-hover:text-purple-400 transition-colors`}>
                                      {project.title}
                                    </h3>
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ml-4 ${
                                    project.status === 'Completed' ? 'bg-green-600/20 text-green-400' :
                                    project.status === 'In Progress' ? 'bg-blue-600/20 text-blue-400' :
                                    'bg-orange-600/20 text-orange-400'
                                  }`}>
                                    {project.status}
                                  </span>
                                </div>
                                
                                <p className="text-gray-300 mb-4 leading-relaxed text-sm">
                                  {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                  {project.tags.slice(0, isMobile ? 3 : 4).map((tag) => (
                                    <span key={tag} className="bg-white/10 text-gray-300 px-2 py-1 rounded text-xs">
                                      {tag}
                                    </span>
                                  ))}
                                  {isMobile && project.tags.length > 3 && (
                                    <span className="bg-white/10 text-gray-300 px-2 py-1 rounded text-xs">
                                      +{project.tags.length - 3}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-6 h-6 rounded-full overflow-hidden">
                                    <Image
                                      src={project.authorAvatar}
                                      alt={project.author}
                                      width={24}
                                      height={24}
                                      className="object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-white text-xs font-medium">{project.author}</p>
                                    <p className="text-gray-400 text-xs">{project.date}</p>
                                  </div>
                                </div>

                                <div className="flex space-x-2">
                                  {project.githubLink && (
                                    <Github size={14} className="text-gray-400" />
                                  )}
                                  {project.liveDemo && (
                                    <ExternalLink size={14} className="text-gray-400" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Courses Section */}
              <div className={`${
                isMobile 
                  ? 'flex flex-col' 
                  : 'flex flex-col min-h-0'
              }`}>
                <h2 className={`text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6 flex-shrink-0 transition-all duration-1000 delay-500 ${
                  isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}>
                  Courses ({courses.length})
                </h2>
                
                {courses.length === 0 ? (
                  <div className={`flex-1 flex items-center justify-center transition-all duration-1000 delay-600 ${
                    isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    <p className="text-gray-400 text-center">No courses found</p>
                  </div>
                ) : (
                  <div className={`${
                    isMobile 
                      ? 'space-y-4' 
                      : 'flex-1 overflow-y-auto space-y-6 courses-scrollbar min-h-0'
                  }`}>
                    {courses.map((course, index) => (
                      <div
                        key={course.id}
                        className={`group cursor-pointer transition-all duration-1000 ${
                          isPageLoaded 
                            ? 'opacity-100 translate-x-0' 
                            : 'opacity-0 translate-x-8'
                        }`}
                        style={{
                          transitionDelay: `${600 + (index * 100)}ms`
                        }}
                        onClick={() => openDetails(course, 'course')}
                      >
                        <div className="relative rounded-xl lg:rounded-2xl overflow-hidden bg-black/60 backdrop-blur-lg border border-white/10 hover:bg-black/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                          {/* Course Image with Overlay */}
                          <div className={`relative ${
                            isMobile 
                              ? 'h-64' 
                              : 'h-[470px]'
                          }`}>
                            <Image
                              src={course.image}
                              alt={course.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {/* Dark overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            
                            {/* Level badge */}
                            <div className="absolute top-3 lg:top-4 left-3 lg:left-4">
                              <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-semibold ${
                                course.level === 'Beginner' ? 'bg-green-600/80 text-white' :
                                course.level === 'Intermediate' ? 'bg-blue-600/80 text-white' :
                                'bg-red-600/80 text-white'
                              }`}>
                                {course.level}
                              </span>
                            </div>

                            {/* Course Content Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 text-white">
                              <h3 className={`${
                                isMobile 
                                  ? 'text-base' 
                                  : 'text-lg'
                              } font-bold mb-2 group-hover:text-blue-400 transition-colors`}>
                                {course.title}
                              </h3>
                              
                              <p className="text-gray-200 mb-3 lg:mb-4 text-sm leading-relaxed">
                                {course.description}
                              </p>

                              <div className="space-y-2 mb-3 lg:mb-4">
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center space-x-1 text-gray-300">
                                    <Clock size={12} />
                                    <span>{course.duration}</span>
                                  </div>
                                  <div className="flex items-center space-x-1 text-gray-300">
                                    <BookOpen size={12} />
                                    <span>{course.lessons} lessons</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div>
                                    <p className="text-white text-xs font-medium">{course.instructor}</p>
                                  </div>
                                </div>
                                <p className="text-gray-300 text-xs">Starts {course.startDate}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin Button - Only show when not in detail view */}
        {!selectedItem && (
          <div className={`flex justify-center pb-8 transition-all duration-1000 delay-800 ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <button
              onClick={navigateToAdmin}
              className="group bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 border-2 border-purple-400/30 hover:border-purple-400/60 backdrop-blur-lg rounded-full p-4 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:shadow-purple-500/20"
              aria-label="Add new project or course"
            >
              <Plus 
                size={24} 
                className="text-purple-400 group-hover:text-white transition-colors duration-300" 
              />
            </button>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles - Hidden on mobile */}
      <style jsx global>{`
        @media (min-width: 1024px) {
          .projects-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(147, 51, 234, 0.5) rgba(255, 255, 255, 0.1);
          }
          
          .projects-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .projects-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
          }
          
          .projects-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(147, 51, 234, 0.5);
            border-radius: 3px;
          }
          
          .projects-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(147, 51, 234, 0.7);
          }

          .courses-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(59, 130, 246, 0.5) rgba(255, 255, 255, 0.1);
          }
          
          .courses-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .courses-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
          }
          
          .courses-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(59, 130, 246, 0.5);
            border-radius: 3px;
          }
          
          .courses-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(59, 130, 246, 0.7);
          }
        }
      `}</style>
    </DashboardLayout>
  );
}