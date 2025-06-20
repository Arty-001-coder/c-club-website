'use client';

import { useState, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Plus, 
  Save, 
  X, 
  Check, 
  AlertCircle,
  BookOpen,
  Code,
  Trash2,
  FileImage
} from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface ProjectFormData {
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  author: string;
  tags: string[];
  githubLink: string;
  liveDemo: string;
  techStack: string[];
  features: string[];
  status: 'Completed' | 'In Progress' | 'Planned';
  date: string; // Added date field
}

interface CourseFormData {
  title: string;
  description: string;
  fullDescription: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: number;
  joinLink: string;
  syllabus: string[];
  prerequisites: string[];
  whatYouWillLearn: string[];
  startDate: string;
}

export default function AdminDataEntryPage() {
  const [activeTab, setActiveTab] = useState<'projects' | 'courses'>('projects');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // File input refs
  const projectImageInputRef = useRef<HTMLInputElement>(null);
  const courseImageInputRef = useRef<HTMLInputElement>(null);
  const authorAvatarInputRef = useRef<HTMLInputElement>(null);

  // Image preview states
  const [projectImagePreview, setProjectImagePreview] = useState<string | null>(null);
  const [courseImagePreview, setCourseImagePreview] = useState<string | null>(null);
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
  const [courseImageFile, setCourseImageFile] = useState<File | null>(null);
  // Author avatar states
  const [authorAvatarPreview, setAuthorAvatarPreview] = useState<string | null>(null);
  const [authorAvatarFile, setAuthorAvatarFile] = useState<File | null>(null);

  // Project form state
  const [projectForm, setProjectForm] = useState<ProjectFormData>({
    title: '',
    description: '',
    fullDescription: '',
    category: '',
    author: '',
    tags: [],
    githubLink: '',
    liveDemo: '',
    techStack: [],
    features: [],
    status: 'In Progress',
    date: new Date().toISOString().split('T')[0] // Default to today's date
  });

  // Course form state
  const [courseForm, setCourseForm] = useState<CourseFormData>({
    title: '',
    description: '',
    fullDescription: '',
    instructor: '',
    duration: '',
    level: 'Beginner',
    lessons: 0,
    joinLink: '',
    syllabus: [],
    prerequisites: [],
    whatYouWillLearn: [],
    startDate: ''
  });

  // Tag input states
  const [newProjectTag, setNewProjectTag] = useState('');
  const [newSyllabus, setNewSyllabus] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newLearningOutcome, setNewLearningOutcome] = useState('');
  const [newTechStack, setNewTechStack] = useState('');
  const [newFeature, setNewFeature] = useState('');

  // Helper functions for managing arrays
  const addToArray = (array: string[], newItem: string, setter: (items: string[]) => void) => {
    if (newItem.trim() && !array.includes(newItem.trim())) {
      setter([...array, newItem.trim()]);
    }
  };

  const removeFromArray = (array: string[], itemToRemove: string, setter: (items: string[]) => void) => {
    setter(array.filter(item => item !== itemToRemove));
  };

  // Handle file selection for preview
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'projects' | 'courses' | 'avatar') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setSubmitStatus('error');
      setSubmitMessage('Please select a valid image file (JPEG, PNG, or WebP)');
      setTimeout(() => setSubmitStatus('idle'), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSubmitStatus('error');
      setSubmitMessage('Image size must be less than 5MB');
      setTimeout(() => setSubmitStatus('idle'), 3000);
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    if (type === 'projects') {
      setProjectImageFile(file);
      setProjectImagePreview(previewUrl);
    } else if (type === 'courses') {
      setCourseImageFile(file);
      setCourseImagePreview(previewUrl);
    } else if (type === 'avatar') {
      setAuthorAvatarFile(file);
      setAuthorAvatarPreview(previewUrl);
    }
  };

  // Remove image preview
  const removeImagePreview = (type: 'projects' | 'courses' | 'avatar') => {
    if (type === 'projects') {
      if (projectImagePreview) {
        URL.revokeObjectURL(projectImagePreview);
      }
      setProjectImageFile(null);
      setProjectImagePreview(null);
      if (projectImageInputRef.current) {
        projectImageInputRef.current.value = '';
      }
    } else if (type === 'courses') {
      if (courseImagePreview) {
        URL.revokeObjectURL(courseImagePreview);
      }
      setCourseImageFile(null);
      setCourseImagePreview(null);
      if (courseImageInputRef.current) {
        courseImageInputRef.current.value = '';
      }
    } else if (type === 'avatar') {
      if (authorAvatarPreview) {
        URL.revokeObjectURL(authorAvatarPreview);
      }
      setAuthorAvatarFile(null);
      setAuthorAvatarPreview(null);
      if (authorAvatarInputRef.current) {
        authorAvatarInputRef.current.value = '';
      }
    }
  };

  // Upload image to Supabase storage
  const uploadImageToSupabase = async (file: File, projectId: string, folderName: string) => {
    setIsUploadingImage(true);
    
    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${projectId}.${fileExtension}`;
      const filePath = `${folderName}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Upload avatar to Supabase storage (root of images bucket)
  const uploadAvatarToSupabase = async (file: File, projectId: string) => {
    setIsUploadingImage(true);
    
    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${projectId}_avatar.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Avatar upload failed:', error);
      throw error;
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Project form handlers
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Insert project data first to get the UUID
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert([
          {
            title: projectForm.title,
            description: projectForm.description,
            full_description: projectForm.fullDescription,
            category: projectForm.category,
            author: projectForm.author,
            tags: projectForm.tags,
            github_link: projectForm.githubLink || null,
            live_demo: projectForm.liveDemo || null,
            tech_stack: projectForm.techStack,
            features: projectForm.features,
            status: projectForm.status,
            date: projectForm.date,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select('id')
        .single();

      if (projectError) {
        throw projectError;
      }

      const projectId = projectData.id;

      // Upload project image if provided
      if (projectImageFile && projectId) {
        await uploadImageToSupabase(projectImageFile, projectId, 'projects');
      }

      // Upload author avatar if provided
      if (authorAvatarFile && projectId) {
        await uploadAvatarToSupabase(authorAvatarFile, projectId);
      }

      setSubmitStatus('success');
      setSubmitMessage('Project added successfully!');
      
      // Reset form
      setProjectForm({
        title: '',
        description: '',
        fullDescription: '',
        category: '',
        author: '',
        tags: [],
        githubLink: '',
        liveDemo: '',
        techStack: [],
        features: [],
        status: 'In Progress',
        date: new Date().toISOString().split('T')[0]
      });
      
      // Reset image
      removeImagePreview('projects');
      removeImagePreview('avatar');
      
    } catch (submitError) {
      console.error('Submit failed:', submitError);
      setSubmitStatus('error');
      setSubmitMessage('Failed to add project. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  // Course form handlers
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Insert course data first to get the UUID
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert([
          {
            title: courseForm.title,
            description: courseForm.description,
            full_description: courseForm.fullDescription,
            instructor: courseForm.instructor,
            duration: courseForm.duration,
            level: courseForm.level,
            lessons: courseForm.lessons,
            join_link: courseForm.joinLink,
            syllabus: courseForm.syllabus,
            prerequisites: courseForm.prerequisites,
            what_you_will_learn: courseForm.whatYouWillLearn,
            start_date: courseForm.startDate
          }
        ])
        .select('id')
        .single();

      if (courseError) {
        throw courseError;
      }

      const courseId = courseData.id;

      // Upload course image if provided
      if (courseImageFile && courseId) {
        await uploadImageToSupabase(courseImageFile, courseId, 'courses');
      }

      setSubmitStatus('success');
      setSubmitMessage('Course added successfully!');
      
      // Reset form
      setCourseForm({
        title: '',
        description: '',
        fullDescription: '',
        instructor: '',
        duration: '',
        level: 'Beginner',
        lessons: 0,
        joinLink: '',
        syllabus: [],
        prerequisites: [],
        whatYouWillLearn: [],
        startDate: ''
      });
      
      // Reset image
      removeImagePreview('courses');
      
    } catch (submitError) {
      console.error('Submit failed:', submitError);
      setSubmitStatus('error');
      setSubmitMessage('Failed to add course. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  // Image upload component
  const ImageUploadArea = ({ 
    type, 
    imagePreview, 
    onFileSelect, 
    onRemove, 
    inputRef 
  }: {
    type: 'projects' | 'courses' | 'avatar';
    imagePreview?: string | null;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
  }) => (
    <div className="space-y-4">
      <label className="block text-white font-medium mb-2">
        {type === 'projects' ? 'Project Image' : type === 'courses' ? 'Course Image' : 'Author Avatar'}
      </label>
      
      {imagePreview ? (
        <div className="relative">
          <div className="bg-white/10 border border-white/20 rounded-lg p-4 flex items-center space-x-4">
            <Image 
              src={imagePreview} 
              alt="Upload preview" 
              width={80}
              height={80}
              className={`object-cover ${type === 'avatar' ? 'rounded-full' : 'rounded-lg'}`}
            />
            <div className="flex-1">
              <p className="text-white font-medium">Image selected</p>
              <p className="text-gray-400 text-sm">
                Ready to upload
              </p>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="bg-red-600/20 hover:bg-red-600/40 text-red-400 p-2 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white/10 p-4 rounded-full">
              <FileImage size={32} className="text-gray-400" />
            </div>
            <div>
              <p className="text-white font-medium mb-2">
                Upload {type === 'projects' ? 'project image' : type === 'courses' ? 'course image' : 'author avatar'}
              </p>
              <p className="text-gray-400 text-sm">
                Click to browse or drag and drop
              </p>
              <p className="text-gray-500 text-xs mt-1">
                JPEG, PNG, WebP up to 5MB
              </p>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={onFileSelect}
            className="hidden"
          />
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="min-h-full">
        {/* Header */}
        <div className="text-center py-16 px-8">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Admin <span className="text-purple-400">Panel</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Add new projects and courses to the platform
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-8 pb-16">
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl p-2 flex">
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'projects'
                    ? 'bg-purple-600/40 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Code size={20} />
                <span>Add Project</span>
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'courses'
                    ? 'bg-blue-600/40 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <BookOpen size={20} />
                <span>Add Course</span>
              </button>
            </div>
          </div>

          {/* Success/Error Message */}
          {submitStatus !== 'idle' && (
            <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
              submitStatus === 'success' 
                ? 'bg-green-600/20 border border-green-400/30' 
                : 'bg-red-600/20 border border-red-400/30'
            }`}>
              {submitStatus === 'success' ? (
                <Check size={20} className="text-green-400" />
              ) : (
                <AlertCircle size={20} className="text-red-400" />
              )}
              <span className={submitStatus === 'success' ? 'text-green-400' : 'text-red-400'}>
                {submitMessage}
              </span>
            </div>
          )}

          {/* Project Form */}
          {activeTab === 'projects' && (
            <form onSubmit={handleProjectSubmit} className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl p-8 space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Add New Project</h2>
              
              {/* Image Upload */}
              <ImageUploadArea
                type="projects"
                imagePreview={projectImagePreview}
                onFileSelect={(e) => handleFileSelect(e, 'projects')}
                onRemove={() => removeImagePreview('projects')}
                inputRef={projectImageInputRef}
              />

              {/* Author Avatar Upload */}
              <ImageUploadArea
                type="avatar"
                imagePreview={authorAvatarPreview}
                onFileSelect={(e) => handleFileSelect(e, 'avatar')}
                onRemove={() => removeImagePreview('avatar')}
                inputRef={authorAvatarInputRef}
              />

              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="Enter project title"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Category *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="e.g., Artificial Intelligence"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Author *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.author}
                    onChange={(e) => setProjectForm({...projectForm, author: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="Project author name"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Status</label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({...projectForm, status: e.target.value as ProjectFormData['status']})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400 transition-colors"
                  >
                    <option value="Planned" className="bg-gray-800">Planned</option>
                    <option value="In Progress" className="bg-gray-800">In Progress</option>
                    <option value="Completed" className="bg-gray-800">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={projectForm.date}
                    onChange={(e) => setProjectForm({...projectForm, date: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-white font-medium mb-2">Short Description *</label>
                <textarea
                  required
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                  placeholder="Brief description for project cards"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Full Description *</label>
                <textarea
                  required
                  value={projectForm.fullDescription}
                  onChange={(e) => setProjectForm({...projectForm, fullDescription: e.target.value})}
                  rows={5}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                  placeholder="Detailed description for project details page"
                />
              </div>

              {/* Links */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">GitHub Link</label>
                  <input
                    type="url"
                    value={projectForm.githubLink}
                    onChange={(e) => setProjectForm({...projectForm, githubLink: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="https://github.com/..."
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Live Demo</label>
                  <input
                    type="url"
                    value={projectForm.liveDemo}
                    onChange={(e) => setProjectForm({...projectForm, liveDemo: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="https://demo.example.com"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-white font-medium mb-2">Tags</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newProjectTag}
                    onChange={(e) => setNewProjectTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray(projectForm.tags, newProjectTag, (tags) => 
                          setProjectForm({...projectForm, tags})
                        );
                        setNewProjectTag('');
                      }
                    }}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="Add a tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addToArray(projectForm.tags, newProjectTag, (tags) => 
                        setProjectForm({...projectForm, tags})
                      );
                      setNewProjectTag('');
                    }}
                    className="bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {projectForm.tags.map((tag) => (
                    <span key={tag} className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeFromArray(projectForm.tags, tag, (tags) => 
                          setProjectForm({...projectForm, tags})
                        )}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-white font-medium mb-2">Tech Stack</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newTechStack}
                    onChange={(e) => setNewTechStack(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray(projectForm.techStack, newTechStack, (techStack) => 
                          setProjectForm({...projectForm, techStack})
                        );
                        setNewTechStack('');
                      }
                    }}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="Add technology and press Enter"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addToArray(projectForm.techStack, newTechStack, (techStack) => 
                        setProjectForm({...projectForm, techStack})
                      );
                      setNewTechStack('');
                    }}
                    className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {projectForm.techStack.map((tech) => (
                    <span key={tech} className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => removeFromArray(projectForm.techStack, tech, (techStack) => 
                          setProjectForm({...projectForm, techStack})
                        )}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-white font-medium mb-2">Key Features</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray(projectForm.features, newFeature, (features) => 
                          setProjectForm({...projectForm, features})
                        );
                        setNewFeature('');
                      }
                    }}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="Add feature and press Enter"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addToArray(projectForm.features, newFeature, (features) => 
                        setProjectForm({...projectForm, features})
                      );
                      setNewFeature('');
                    }}
                    className="bg-green-600/20 hover:bg-green-600/40 text-green-400 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  {projectForm.features.map((feature) => (
                    <div key={feature} className="bg-green-600/10 border border-green-600/20 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-green-400 text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFromArray(projectForm.features, feature, (features) => 
                          setProjectForm({...projectForm, features})
                        )}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Adding Project...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Add Project</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Course Form */}
          {activeTab === 'courses' && (
            <form onSubmit={handleCourseSubmit} className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl p-8 space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Add New Course</h2>
              
              {/* Image Upload */}
              <ImageUploadArea
                type="courses"
                imagePreview={courseImagePreview}
                onFileSelect={(e) => handleFileSelect(e, 'courses')}
                onRemove={() => removeImagePreview('courses')}
                inputRef={courseImageInputRef}
              />
              
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Enter course title"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Instructor *</label>
                  <input
                    type="text"
                    required
                    value={courseForm.instructor}
                    onChange={(e) => setCourseForm({...courseForm, instructor: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Instructor name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Short Description *</label>
                <textarea
                  required
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                  placeholder="Brief description of the course"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Full Description *</label>
                <textarea
                  required
                  value={courseForm.fullDescription}
                  onChange={(e) => setCourseForm({...courseForm, fullDescription: e.target.value})}
                  rows={5}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                  placeholder="Detailed description of the course"
                />
              </div>

              {/* Course Details */}
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Duration *</label>
                  <input
                    type="text"
                    required
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="e.g., 8 weeks"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Level</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({...courseForm, level: e.target.value as CourseFormData['level']})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                  >
                    <option value="Beginner" className="bg-gray-800">Beginner</option>
                    <option value="Intermediate" className="bg-gray-800">Intermediate</option>
                    <option value="Advanced" className="bg-gray-800">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Lessons *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={courseForm.lessons}
                    onChange={(e) => setCourseForm({...courseForm, lessons: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Number of lessons"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    value={courseForm.startDate}
                    onChange={(e) => setCourseForm({...courseForm, startDate: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Join Link *</label>
                <input
                  type="url"
                  required
                  value={courseForm.joinLink}
                  onChange={(e) => setCourseForm({...courseForm, joinLink: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="https://example.com/course"
                />
              </div>

              {/* Syllabus */}
              <div>
                <label className="block text-white font-medium mb-2">Course Syllabus</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newSyllabus}
                    onChange={(e) => setNewSyllabus(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray(courseForm.syllabus, newSyllabus, (syllabus) => 
                          setCourseForm({...courseForm, syllabus})
                        );
                        setNewSyllabus('');
                      }
                    }}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Add syllabus topic and press Enter"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addToArray(courseForm.syllabus, newSyllabus, (syllabus) => 
                        setCourseForm({...courseForm, syllabus})
                      );
                      setNewSyllabus('');
                    }}
                    className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  {courseForm.syllabus.map((topic, index) => (
                    <div key={topic} className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-blue-400 text-sm">{index + 1}. {topic}</span>
                      <button
                        type="button"
                        onClick={() => removeFromArray(courseForm.syllabus, topic, (syllabus) => 
                          setCourseForm({...courseForm, syllabus})
                        )}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prerequisites */}
              <div>
                <label className="block text-white font-medium mb-2">Prerequisites</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newPrerequisite}
                    onChange={(e) => setNewPrerequisite(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray(courseForm.prerequisites, newPrerequisite, (prerequisites) => 
                          setCourseForm({...courseForm, prerequisites})
                        );
                        setNewPrerequisite('');
                      }
                    }}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Add prerequisite and press Enter"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addToArray(courseForm.prerequisites, newPrerequisite, (prerequisites) => 
                        setCourseForm({...courseForm, prerequisites})
                      );
                      setNewPrerequisite('');
                    }}
                    className="bg-orange-600/20 hover:bg-orange-600/40 text-orange-400 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {courseForm.prerequisites.map((prereq) => (
                    <span key={prereq} className="bg-orange-600/20 text-orange-400 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                      <span>{prereq}</span>
                      <button
                        type="button"
                        onClick={() => removeFromArray(courseForm.prerequisites, prereq, (prerequisites) => 
                          setCourseForm({...courseForm, prerequisites})
                        )}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* What You Will Learn */}
              <div>
                <label className="block text-white font-medium mb-2">What You Will Learn</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newLearningOutcome}
                    onChange={(e) => setNewLearningOutcome(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addToArray(courseForm.whatYouWillLearn, newLearningOutcome, (whatYouWillLearn) => 
                          setCourseForm({...courseForm, whatYouWillLearn})
                        );
                        setNewLearningOutcome('');
                      }
                    }}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Add learning outcome and press Enter"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addToArray(courseForm.whatYouWillLearn, newLearningOutcome, (whatYouWillLearn) => 
                        setCourseForm({...courseForm, whatYouWillLearn})
                      );
                      setNewLearningOutcome('');
                    }}
                    className="bg-green-600/20 hover:bg-green-600/40 text-green-400 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  {courseForm.whatYouWillLearn.map((outcome) => (
                    <div key={outcome} className="bg-green-600/10 border border-green-600/20 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-green-400 text-sm">✓ {outcome}</span>
                      <button
                        type="button"
                        onClick={() => removeFromArray(courseForm.whatYouWillLearn, outcome, (whatYouWillLearn) => 
                          setCourseForm({...courseForm, whatYouWillLearn})
                        )}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Adding Course...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Add Course</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}