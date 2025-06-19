'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import DashboardLayout from '@/components/DashboardLayout';
import {  Users, ExternalLink, X, Github, Globe, Play, Clock, BookOpen } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  category: string;
  date: string;
  author: string;
  authorAvatar: string;
  tags: string[];
  githubLink?: string;
  liveDemo?: string;
  techStack: string[];
  features: string[];
  status: 'Completed' | 'In Progress' | 'Planned';
}

interface Course {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  instructor: string;
  instructorAvatar: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  enrolledStudents: number;
  rating: number;
  lessons: number;
  joinLink: string;
  syllabus: string[];
  prerequisites: string[];
  whatYouWillLearn: string[];
  startDate: string;
}

export default function ProjectsCoursesPage() {
  const [selectedItem, setSelectedItem] = useState<(Project | Course) | null>(null);
  const [selectedType, setSelectedType] = useState<'project' | 'course' | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  const projects: Project[] = [
    {
      id: '1',
      title: 'AI-Powered Campus Assistant',
      description: 'A comprehensive chatbot system that helps students navigate campus life, from course registration to event information. Built using natural language processing and machine learning.',
      fullDescription: 'An intelligent campus assistant built using natural language processing and machine learning. The system integrates with multiple campus databases to provide real-time information about courses, events, dining, and campus services. Features include voice interaction, multi-language support, and personalized recommendations.',
      image: '/images/courses/hero-tech.png',
      category: 'Artificial Intelligence',
      date: 'Dec 2024',
      author: 'Priya Sharma',
      authorAvatar: '/images/team/priya.jpg',
      tags: ['AI', 'NLP', 'Python', 'React'],
      githubLink: 'https://github.com/codingclub/campus-ai',
      liveDemo: 'https://campus-ai.iisertvm.ac.in',
      techStack: ['Python', 'TensorFlow', 'React', 'Node.js', 'MongoDB'],
      features: [
        'Natural language understanding',
        'Voice interaction support',
        'Multi-language support (English, Hindi, Malayalam)',
        'Integration with campus databases',
        'Personalized recommendations',
        'Real-time event updates'
      ],
      status: 'Completed'
    },
    {
      id: '2',
      title: 'Sustainable Energy Monitor',
      description: 'IoT-based system to monitor and optimize energy consumption across campus buildings with real-time analytics. Uses sensor networks to collect data on electricity usage and solar generation.',
      fullDescription: 'A comprehensive IoT solution for monitoring energy consumption patterns across the campus. The system uses sensor networks to collect real-time data on electricity usage, solar panel generation, and environmental conditions. Advanced analytics help identify optimization opportunities and track sustainability goals.',
      image: '/images/projects/energy-monitor.jpg',
      category: 'IoT & Sustainability',
      date: 'Nov 2024',
      author: 'Arjun Kumar',
      authorAvatar: '/images/team/arjun.jpg',
      tags: ['IoT', 'Sustainability', 'Data Analytics'],
      githubLink: 'https://github.com/codingclub/energy-monitor',
      techStack: ['Arduino', 'Raspberry Pi', 'Python', 'InfluxDB', 'Grafana'],
      features: [
        'Real-time energy monitoring',
        'Solar panel efficiency tracking',
        'Predictive analytics for consumption',
        'Mobile app for administrators',
        'Automated reporting system',
        'Carbon footprint calculations'
      ],
      status: 'In Progress'
    },
    {
      id: '3',
      title: 'Virtual Lab Simulator',
      description: 'Web-based virtual laboratory for physics and chemistry experiments with realistic simulations and data collection. Includes realistic physics engines and collaborative features.',
      fullDescription: 'An immersive virtual laboratory platform that allows students to conduct physics and chemistry experiments in a safe, virtual environment. The simulator includes realistic physics engines, data collection tools, and collaborative features for remote learning.',
      image: '/images/projects/virtual-lab.jpg',
      category: 'Education Technology',
      date: 'Oct 2024',
      author: 'Sneha Patel',
      authorAvatar: '/images/team/sneha.jpg',
      tags: ['Education', '3D Simulation', 'WebGL'],
      githubLink: 'https://github.com/codingclub/virtual-lab',
      liveDemo: 'https://virtuallab.iisertvm.ac.in',
      techStack: ['Three.js', 'WebGL', 'React', 'Node.js', 'PostgreSQL'],
      features: [
        '3D experiment simulations',
        'Real-time collaboration',
        'Data collection and analysis',
        'Progress tracking',
        'Multi-device support',
        'Offline mode capability'
      ],
      status: 'Completed'
    },
    {
      id: '4',
      title: 'Smart Library System',
      description: 'RFID-based automated library management system with book tracking and recommendation engine. Features automated check-in/check-out and intelligent recommendations.',
      fullDescription: 'A modern library management solution using RFID technology for automated book tracking, check-in/check-out processes, and intelligent book recommendations based on user preferences and reading history.',
      image: '/images/projects/smart-library.jpg',
      category: 'Automation',
      date: 'Sep 2024',
      author: 'Vikram Singh',
      authorAvatar: '/images/team/vikram.jpg',
      tags: ['RFID', 'Database', 'Automation'],
      githubLink: 'https://github.com/codingclub/smart-library',
      techStack: ['Python', 'Django', 'PostgreSQL', 'RFID', 'React'],
      features: [
        'Automated book tracking',
        'Self-checkout system',
        'Personalized recommendations',
        'Real-time inventory management',
        'Digital catalog search',
        'Usage analytics dashboard'
      ],
      status: 'Completed'
    },
    {
      id: '5',
      title: 'Campus Navigation App',
      description: 'Mobile application for indoor and outdoor campus navigation with AR features. Provides real-time directions and location-based information for students and visitors.',
      fullDescription: 'An innovative mobile navigation solution that combines GPS and indoor positioning systems to provide seamless navigation across the campus. Features augmented reality overlays, real-time crowd density information, and accessibility features.',
      image: '/images/projects/navigation-app.jpg',
      category: 'Mobile Development',
      date: 'Aug 2024',
      author: 'Rohit Mehta',
      authorAvatar: '/images/team/rohit.jpg',
      tags: ['Mobile', 'AR', 'GPS'],
      githubLink: 'https://github.com/codingclub/campus-nav',
      liveDemo: 'https://play.google.com/store/apps/details?id=com.iisertvm.campusnav',
      techStack: ['React Native', 'ARCore', 'Firebase', 'Google Maps API'],
      features: [
        'Indoor and outdoor navigation',
        'Augmented reality directions',
        'Real-time location sharing',
        'Accessibility features',
        'Event location integration',
        'Offline map support'
      ],
      status: 'Completed'
    }
  ];

  const courses: Course[] = [
    {
      id: '1',
      title: 'Full-Stack Web Development',
      description: 'Master modern web development with React, Node.js, and databases.',
      fullDescription: 'A comprehensive course covering both frontend and backend development. Students will learn to build scalable web applications using modern technologies and best practices.',
      image: '/images/courses/hero-tech.png',
      instructor: 'Rahul Nair',
      instructorAvatar: '/images/team/antrin.jpg',
      duration: '12 weeks',
      level: 'Intermediate',
      enrolledStudents: 45,
      rating: 4.8,
      lessons: 36,
      joinLink: 'https://courses.iisertvm.ac.in/fullstack',
      startDate: 'Jan 15, 2025',
      syllabus: [
        'HTML5, CSS3, and Modern JavaScript',
        'React.js and Component Architecture',
        'State Management with Redux',
        'Node.js and Express.js',
        'Database Design and MongoDB',
        'RESTful API Development',
        'Authentication and Security',
        'Deployment and DevOps',
        'Testing and Best Practices',
        'Final Project Development'
      ],
      prerequisites: ['Basic programming knowledge', 'Familiarity with HTML/CSS', 'Understanding of JavaScript fundamentals'],
      whatYouWillLearn: [
        'Build complete web applications',
        'Master React.js and modern frontend development',
        'Develop RESTful APIs with Node.js',
        'Work with databases and data modeling',
        'Implement authentication and security',
        'Deploy applications to production',
        'Write clean, maintainable code',
        'Follow industry best practices'
      ]
    },
    {
      id: '2',
      title: 'Machine Learning Fundamentals',
      description: 'Learn core ML concepts with Python, from basic algorithms to deep learning.',
      fullDescription: 'An in-depth exploration of machine learning concepts, algorithms, and practical applications. Students will work with real datasets and build ML models for various use cases.',
      image: '/images/courses/machine-learning.jpg',
      instructor: 'Dr. Meera Joshi',
      instructorAvatar: '/images/team/meera.jpg',
      duration: '10 weeks',
      level: 'Beginner',
      enrolledStudents: 62,
      rating: 4.9,
      lessons: 30,
      joinLink: 'https://courses.iisertvm.ac.in/ml-fundamentals',
      startDate: 'Feb 1, 2025',
      syllabus: [
        'Introduction to Machine Learning',
        'Data Preprocessing and Analysis',
        'Supervised Learning Algorithms',
        'Unsupervised Learning Techniques',
        'Model Evaluation and Validation',
        'Feature Engineering',
        'Introduction to Deep Learning',
        'Neural Networks and TensorFlow',
        'Computer Vision Basics',
        'Capstone Project'
      ],
      prerequisites: ['Basic Python programming', 'High school mathematics', 'Statistics fundamentals'],
      whatYouWillLearn: [
        'Understand ML algorithms and concepts',
        'Implement models using Python and scikit-learn',
        'Work with real-world datasets',
        'Evaluate and improve model performance',
        'Apply deep learning techniques',
        'Build end-to-end ML projects',
        'Understand ethical considerations in AI'
      ]
    },
    {
      id: '3',
      title: 'Mobile App Development',
      description: 'Create native iOS and Android apps using React Native and Flutter.',
      fullDescription: 'Learn to build cross-platform mobile applications with modern frameworks. Focus on user experience, performance optimization, and app store deployment.',
      image: '/images/courses/mobile-dev.jpg',
      instructor: 'Karthik Menon',
      instructorAvatar: '/images/team/karthik.jpg',
      duration: '8 weeks',
      level: 'Intermediate',
      enrolledStudents: 38,
      rating: 4.7,
      lessons: 24,
      joinLink: 'https://courses.iisertvm.ac.in/mobile-dev',
      startDate: 'Jan 22, 2025',
      syllabus: [
        'Mobile Development Fundamentals',
        'React Native Basics',
        'Navigation and State Management',
        'UI/UX Design for Mobile',
        'Device APIs and Native Features',
        'Data Storage and Networking',
        'Performance Optimization',
        'App Store Deployment'
      ],
      prerequisites: ['JavaScript proficiency', 'React.js experience', 'Basic mobile design principles'],
      whatYouWillLearn: [
        'Build cross-platform mobile apps',
        'Master React Native and Flutter',
        'Implement native device features',
        'Design responsive mobile interfaces',
        'Optimize app performance',
        'Deploy apps to app stores',
        'Handle offline functionality'
      ]
    },
    {
      id: '4',
      title: 'Data Science with Python',
      description: 'Comprehensive data analysis, visualization, and statistical modeling.',
      fullDescription: 'Master the art of extracting insights from data using Python. Learn statistical analysis, data visualization, and predictive modeling techniques.',
      image: '/images/courses/data-science.jpg',
      instructor: 'Dr. Anita Reddy',
      instructorAvatar: '/images/team/anita.jpg',
      duration: '14 weeks',
      level: 'Beginner',
      enrolledStudents: 55,
      rating: 4.6,
      lessons: 42,
      joinLink: 'https://courses.iisertvm.ac.in/data-science',
      startDate: 'Feb 8, 2025',
      syllabus: [
        'Python Programming Basics',
        'NumPy and Pandas',
        'Data Cleaning and Preprocessing',
        'Exploratory Data Analysis',
        'Data Visualization with Matplotlib',
        'Statistical Analysis',
        'Hypothesis Testing',
        'Regression Analysis',
        'Time Series Analysis',
        'Final Capstone Project'
      ],
      prerequisites: ['Basic mathematics', 'No programming experience required'],
      whatYouWillLearn: [
        'Python programming for data analysis',
        'Statistical analysis techniques',
        'Create compelling data visualizations',
        'Clean and preprocess messy data',
        'Build predictive models',
        'Communicate insights effectively'
      ]
    }
  ];

  const openDetails = (item: Project | Course, type: 'project' | 'course') => {
    setSelectedItem(item);
    setSelectedType(type);
  };

  const closeDetails = () => {
    setSelectedItem(null);
    setSelectedType(null);
  };

  return (
    <DashboardLayout>
      <div className="min-h-full">
        {/* Header */}
        <div className="text-center py-12 px-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            <span className='bg-gradient-to-r from-blue-500 to-purple-400 bg-clip-text text-transparent'>Projects & Resources</span>
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
                              {(selectedItem as Project).category}
                            </span>
                            <h1 className="text-4xl font-bold text-white mt-2 drop-shadow-lg">{selectedItem.title}</h1>
                            <div className="flex items-center space-x-4 mt-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20">
                                  <Image
                                    src={(selectedItem as Project).authorAvatar}
                                    alt={(selectedItem as Project).author}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="text-white font-medium drop-shadow">{(selectedItem as Project).author}</p>
                                  <p className="text-gray-200 text-sm drop-shadow">{(selectedItem as Project).date}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${
                            (selectedItem as Project).status === 'Completed' ? 'bg-green-600/40 text-green-200 border border-green-400/40' :
                            (selectedItem as Project).status === 'In Progress' ? 'bg-blue-600/40 text-blue-200 border border-blue-400/40' :
                            'bg-orange-600/40 text-orange-200 border border-orange-400/40'
                          }`}>
                            {(selectedItem as Project).status}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">About This Project</h3>
                        <p className="text-gray-100 leading-relaxed mb-8 text-lg drop-shadow max-w-4xl">
                          {(selectedItem as Project).fullDescription}
                        </p>

                        <div className="grid md:grid-cols-2 gap-12">
                          <div>
                            <h4 className="text-xl font-semibold text-white mb-4 drop-shadow">Tech Stack</h4>
                            <div className="flex flex-wrap gap-3">
                              {(selectedItem as Project).techStack.map((tech) => (
                                <span key={tech} className="bg-purple-600/40 text-purple-200 px-4 py-2 rounded-full border border-purple-400/40 backdrop-blur-sm drop-shadow">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xl font-semibold text-white mb-4 drop-shadow">Key Features</h4>
                            <ul className="space-y-3">
                              {(selectedItem as Project).features.map((feature) => (
                                <li key={feature} className="text-gray-100 flex items-start drop-shadow">
                                  <span className="text-purple-300 mr-3 mt-1 drop-shadow">•</span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex space-x-4 mt-8">
                          {(selectedItem as Project).githubLink && (
                            <a
                              href={(selectedItem as Project).githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/50 rounded-lg px-6 py-3 transition-all duration-200 backdrop-blur-sm drop-shadow"
                            >
                              <Github size={20} className="text-purple-200" />
                              <span className="text-purple-200 font-medium">View Code</span>
                            </a>
                          )}
                          {(selectedItem as Project).liveDemo && (
                            <a
                              href={(selectedItem as Project).liveDemo}
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
                                    src={(selectedItem as Course).instructorAvatar}
                                    alt={(selectedItem as Course).instructor}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="text-blue-200 font-semibold drop-shadow">{(selectedItem as Course).instructor}</p>
                                  <p className="text-gray-200 text-sm drop-shadow">Instructor</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-white font-semibold drop-shadow">{(selectedItem as Course).duration}</p>
                                <p className="text-gray-200 text-sm drop-shadow">{(selectedItem as Course).lessons} lessons</p>
                              </div>
                              <div>
                                <p className="text-white font-semibold drop-shadow">Starts {(selectedItem as Course).startDate}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-200">
                                  <span className="drop-shadow">{(selectedItem as Course).enrolledStudents} students</span>
                                  <span className="flex items-center space-x-1 drop-shadow">
                                    <span className="text-yellow-300">★</span>
                                    <span>{(selectedItem as Course).rating}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${
                            (selectedItem as Course).level === 'Beginner' ? 'bg-green-600/40 text-green-200 border border-green-400/40' :
                            (selectedItem as Course).level === 'Intermediate' ? 'bg-blue-600/40 text-blue-200 border border-blue-400/40' :
                            'bg-red-600/40 text-red-200 border border-red-400/40'
                          }`}>
                            {(selectedItem as Course).level}
                          </span>
                        </div>

                        <p className="text-gray-100 leading-relaxed mb-8 text-lg drop-shadow max-w-4xl">
                          {(selectedItem as Course).fullDescription}
                        </p>

                        <div className="grid md:grid-cols-2 gap-12">
                          <div>
                            <h4 className="text-xl font-semibold text-white mb-4 drop-shadow">What You&apos;ll Learn</h4>
                            <ul className="space-y-3">
                              {(selectedItem as Course).whatYouWillLearn.map((item) => (
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
                              {(selectedItem as Course).prerequisites.map((prereq) => (
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
                            {(selectedItem as Course).syllabus.map((topic, index) => (
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
                            href={(selectedItem as Course).joinLink}
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
                <h2 className="text-2xl font-bold text-white mb-6 flex-shrink-0">Featured Projects</h2>
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
              </div>

              {/* Courses Section - Right Side (1/3 width) */}
              <div className="flex flex-col min-h-0">
                <h2 className="text-2xl font-bold text-white mb-6 flex-shrink-0">Courses</h2>
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