'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import DashboardLayout from '@/components/DashboardLayout';
import { Users, ExternalLink, X, Github, Globe, Play, Clock, BookOpen, Loader2 } from 'lucide-react';
import { projectsApi, coursesApi, ProjectWithImage, CourseWithImage } from '@/lib/supabase';

export default function ProjectsCoursesPage() {
  const [selectedItem, setSelectedItem] = useState<(ProjectWithImage | CourseWithImage) | null>(null);
  const [selectedType, setSelectedType] = useState<'project' | 'course' | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [projects, setProjects] = useState<ProjectWithImage[]>([]);
  const [courses, setCourses] = useState<CourseWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    loadData();
  }, []);

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
      <div className="min-h-full">
        {/* Header */}
        <div className="text-center py-12 px-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-blue-400 mb-4"><span  className='bg-gradient-to-r from-blue-500 to-blue-200 bg-clip-text text-transparent drop-shadow-xl'>Projects</span> 
            <span className='bg-gradient-to-r from-white to-purple-500 bg-clip-text text-transparent drop-shadow-xl'> & Resources</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Explore our innovative projects and join our comprehensive courses to advance your skills
          </p>
        </div>

        {/* Split Layout Container */}
        <div className="max-w-7xl mx-auto px-8 pb-16">
          {selectedItem && selectedType ? (
            /* Expanded Detail View */
            <div className="space-y-8">
              {/* Back button */}
              <button
                onClick={closeDetails}
                className="flex items-center space-x-2 text-white hover:text-purple-400 transition-colors"
              >
                <X size={20} />
                <span>Back to {selectedType === 'project' ? 'Projects' : 'Courses'}</span>
              </button>

              <div className="relative bg-black/60 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden">
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
                    <div className="relative z-10 p-8 space-y-8">
                      <div>
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <span className="text-sm text-purple-400 font-medium uppercase tracking-wide drop-shadow">
                              {(selectedItem as ProjectWithImage).category}
                            </span>
                            <h1 className="text-4xl font-bold text-white mt-2 drop-shadow-lg">{selectedItem.title}</h1>
                            <div className="flex items-center space-x-4 mt-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20">
                                  <Image
                                    src={(selectedItem as ProjectWithImage).authorAvatar}
                                    alt={(selectedItem as ProjectWithImage).author}
                                    width={32}
                                    height={32}
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
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${
                            (selectedItem as ProjectWithImage).status === 'Completed' ? 'bg-green-600/40 text-green-200 border border-green-400/40' :
                            (selectedItem as ProjectWithImage).status === 'In Progress' ? 'bg-blue-600/40 text-blue-200 border border-blue-400/40' :
                            'bg-orange-600/40 text-orange-200 border border-orange-400/40'
                          }`}>
                            {(selectedItem as ProjectWithImage).status}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">About This Project</h3>
                        <p className="text-gray-100 leading-relaxed mb-8 text-lg drop-shadow max-w-4xl">
                          {(selectedItem as ProjectWithImage).fullDescription}
                        </p>

                        <div className="grid md:grid-cols-2 gap-12">
                          <div>
                            <h4 className="text-xl font-semibold text-white mb-4 drop-shadow">Tech Stack</h4>
                            <div className="flex flex-wrap gap-3">
                              {(selectedItem as ProjectWithImage).techStack.map((tech) => (
                                <span key={tech} className="bg-purple-600/40 text-purple-200 px-4 py-2 rounded-full border border-purple-400/40 backdrop-blur-sm drop-shadow">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xl font-semibold text-white mb-4 drop-shadow">Key Features</h4>
                            <ul className="space-y-3">
                              {(selectedItem as ProjectWithImage).features.map((feature) => (
                                <li key={feature} className="text-gray-100 flex items-start drop-shadow">
                                  <span className="text-purple-300 mr-3 mt-1 drop-shadow">•</span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex space-x-4 mt-8">
                          {(selectedItem as ProjectWithImage).githubLink && (
                            <a
                              href={(selectedItem as ProjectWithImage).githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/50 rounded-lg px-6 py-3 transition-all duration-200 backdrop-blur-sm drop-shadow"
                            >
                              <Github size={20} className="text-purple-200" />
                              <span className="text-purple-200 font-medium">View Code</span>
                            </a>
                          )}
                          {(selectedItem as ProjectWithImage).liveDemo && (
                            <a
                              href={(selectedItem as ProjectWithImage).liveDemo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 bg-blue-600/40 hover:bg-blue-600/60 border border-blue-400/50 rounded-lg px-6 py-3 transition-all duration-200 backdrop-blur-sm drop-shadow"
                            >
                              <Globe size={20} className="text-blue-200" />
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
                    <div className="relative z-10 p-8 space-y-8">
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">{selectedItem.title}</h1>
                            <div className="flex items-center space-x-6">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20">
                                  <Image
                                    src={(selectedItem as CourseWithImage).instructorAvatar}
                                    alt={(selectedItem as CourseWithImage).instructor}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="text-blue-200 font-semibold drop-shadow">{(selectedItem as CourseWithImage).instructor}</p>
                                  <p className="text-gray-200 text-sm drop-shadow">Instructor</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-white font-semibold drop-shadow">{(selectedItem as CourseWithImage).duration}</p>
                                <p className="text-gray-200 text-sm drop-shadow">{(selectedItem as CourseWithImage).lessons} lessons</p>
                              </div>
                              <div>
                                <p className="text-white font-semibold drop-shadow">Starts {(selectedItem as CourseWithImage).startDate}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-200">
                                  <span className="drop-shadow">{(selectedItem as CourseWithImage).enrolledStudents} students</span>
                                  <span className="flex items-center space-x-1 drop-shadow">
                                    <span className="text-yellow-300">★</span>
                                    <span>{(selectedItem as CourseWithImage).rating}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${
                            (selectedItem as CourseWithImage).level === 'Beginner' ? 'bg-green-600/40 text-green-200 border border-green-400/40' :
                            (selectedItem as CourseWithImage).level === 'Intermediate' ? 'bg-blue-600/40 text-blue-200 border border-blue-400/40' :
                            'bg-red-600/40 text-red-200 border border-red-400/40'
                          }`}>
                            {(selectedItem as CourseWithImage).level}
                          </span>
                        </div>

                        <p className="text-gray-100 leading-relaxed mb-8 text-lg drop-shadow max-w-4xl">
                          {(selectedItem as CourseWithImage).fullDescription}
                        </p>

                        <div className="grid md:grid-cols-2 gap-12">
                          <div>
                            <h4 className="text-xl font-semibold text-white mb-4 drop-shadow">What You&apos;ll Learn</h4>
                            <ul className="space-y-3">
                              {(selectedItem as CourseWithImage).whatYouWillLearn.map((item) => (
                                <li key={item} className="text-gray-100 flex items-start drop-shadow">
                                  <span className="text-blue-300 mr-3 mt-1 drop-shadow">✓</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-xl font-semibold text-white mb-4 drop-shadow">Prerequisites</h4>
                            <ul className="space-y-3">
                              {(selectedItem as CourseWithImage).prerequisites.map((prereq) => (
                                <li key={prereq} className="text-gray-100 flex items-start drop-shadow">
                                  <span className="text-purple-300 mr-3 mt-1 drop-shadow">•</span>
                                  {prereq}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-12">
                          <h4 className="text-xl font-semibold text-white mb-6 drop-shadow">Course Syllabus</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            {(selectedItem as CourseWithImage).syllabus.map((topic, index) => (
                              <div key={topic} className="flex items-center space-x-3 p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 drop-shadow">
                                <span className="w-8 h-8 bg-blue-600/40 text-blue-200 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 border border-blue-400/40">
                                  {index + 1}
                                </span>
                                <span className="text-gray-100">{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-8">
                          <a
                            href={(selectedItem as CourseWithImage).joinLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-700/80 hover:to-purple-700/80 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 backdrop-blur-sm border border-white/30 drop-shadow"
                          >
                            <Play size={20} />
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
            <div className="grid lg:grid-cols-3 gap-8 h-[calc(100vh-300px)]">
              
              {/* Projects Section - Left Side (2/3 width) */}
              <div className="lg:col-span-2 flex flex-col min-h-0">
                <h2 className="text-2xl font-bold text-white mb-6 flex-shrink-0">
                  Featured Projects ({projects.length})
                </h2>
                
                {projects.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-400 text-center">No projects found</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto pr-4 space-y-6 projects-scrollbar min-h-0">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="group cursor-pointer"
                        onClick={() => openDetails(project, 'project')}
                      >
                        <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:bg-black/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
                          <div className="flex">
                            {/* Project Image - Left */}
                            <div className="w-1/3 relative">
                              <div className="aspect-square">
                                <Image
                                  src={project.image}
                                  alt={project.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              </div>
                            </div>

                            {/* Project Content - Right */}
                            <div className="w-2/3 p-6 flex flex-col justify-between">
                              <div>
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <span className="text-xs text-purple-400 font-medium uppercase tracking-wide">
                                      {project.category}
                                    </span>
                                    <h3 className="text-xl font-bold text-white mt-1 group-hover:text-purple-400 transition-colors">
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
                                  {project.tags.slice(0, 4).map((tag) => (
                                    <span key={tag} className="bg-white/10 text-gray-300 px-2 py-1 rounded text-xs">
                                      {tag}
                                    </span>
                                  ))}
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

              {/* Courses Section - Right Side (1/3 width) */}
              <div className="flex flex-col min-h-0">
                <h2 className="text-2xl font-bold text-white mb-6 flex-shrink-0">
                  Courses ({courses.length})
                </h2>
                
                {courses.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-400 text-center">No courses found</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-6 courses-scrollbar min-h-0">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="group cursor-pointer"
                        onClick={() => openDetails(course, 'course')}
                      >
                        <div className="relative rounded-2xl overflow-hidden bg-black/60 backdrop-blur-lg border border-white/10 hover:bg-black/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                          {/* Course Image with Overlay */}
                          <div className="relative h-[470px]">
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
                            <div className="absolute top-4 left-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                course.level === 'Beginner' ? 'bg-green-600/80 text-white' :
                                course.level === 'Intermediate' ? 'bg-blue-600/80 text-white' :
                                'bg-red-600/80 text-white'
                              }`}>
                                {course.level}
                              </span>
                            </div>

                            {/* Course Content Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">
                                {course.title}
                              </h3>
                              
                              <p className="text-gray-200 mb-4 text-sm leading-relaxed">
                                {course.description}
                              </p>

                              <div className="space-y-2 mb-4">
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
                                
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center space-x-1 text-gray-300">
                                    <Users size={12} />
                                    <span>{course.enrolledStudents} students</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <span className="text-yellow-400">★</span>
                                    <span className="text-gray-300">{course.rating}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 rounded-full overflow-hidden">
                                    <Image
                                      src={course.instructorAvatar}
                                      alt={course.instructor}
                                      width={24}
                                      height={24}
                                      className="object-cover"
                                    />
                                  </div>
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
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
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
      `}</style>
    </DashboardLayout>
  );
}