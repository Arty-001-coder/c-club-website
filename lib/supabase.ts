// Clean @/lib/supabase.ts file with no duplicates

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface BlogPost {
  id: string  // Changed from number to string for UUID
  title: string
  excerpt: string
  full_content: string
  author: string
  created_at: string
  updated_at: string
  read_time: string
  category: string
  // Removed is_featured since you said you don't need it
}

// Interface for blog form data
interface BlogFormData {
  title: string;
  excerpt: string;
  full_content: string;
  author: string;
  read_time: string;
  category: string;
}

// EXISTING FUNCTIONS (preserved)
// Function to get image URL from bucket
export const getBlogImageUrl = (id: string, extension: string = 'jpg'): string => {
  const { data } = supabase.storage
    .from('blogs')
    .getPublicUrl(`${id}.${extension}`)
  
  console.log('Generated image URL for UUID:', id, ':', data.publicUrl)
  return data.publicUrl
}

// Function to fetch all blog posts
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }

  console.log('Fetched blog posts:', data)
  return data || []
}

// Function to fetch posts by category
export const fetchPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts by category:', error)
    return []
  }

  return data || []
}

// Optional: Function to get a single blog post by UUID
export const fetchBlogPostById = async (id: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching blog post by ID:', error)
    return null
  }

  return data
}

// NEW FUNCTIONS (for blog creation and management)

/**
 * Create a new blog post in the blog_posts table
 */
export const createBlogPost = async (formData: BlogFormData): Promise<BlogPost> => {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      title: formData.title,
      excerpt: formData.excerpt,
      full_content: formData.full_content,
      author: formData.author,
      read_time: formData.read_time,
      category: formData.category,
      created_at: now,
      updated_at: now
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating blog post:', error);
    throw new Error(`Failed to create blog post: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data returned from blog post creation');
  }

  return data;
}

/**
 * Upload blog image to the blogs bucket
 */
export const uploadBlogImage = async (
  blogId: string, 
  file: File, 
  fileExtension: string
): Promise<string> => {
  const fileName = `${blogId}.${fileExtension}`;
  
  const { data, error } = await supabase.storage
    .from('blogs')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true // This will overwrite if file already exists
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data returned from image upload');
  }

  return data.path;
}

/**
 * Delete a blog post and its associated image
 */
export const deleteBlogPost = async (blogId: string): Promise<void> => {
  // First, try to delete the image from storage
  try {
    // Try different common extensions
    const extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    for (const ext of extensions) {
      const fileName = `${blogId}.${ext}`;
      await supabase.storage
        .from('blogs')
        .remove([fileName]);
    }
  } catch (error) {
    console.warn('Error deleting blog image:', error);
    // Continue with blog post deletion even if image deletion fails
  }

  // Delete the blog post from database
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', blogId);

  if (error) {
    console.error('Error deleting blog post:', error);
    throw new Error(`Failed to delete blog post: ${error.message}`);
  }
}

/**
 * Update an existing blog post
 */
export const updateBlogPost = async (
  blogId: string, 
  updates: Partial<BlogFormData>
): Promise<BlogPost> => {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('blog_posts')
    .update({
      ...updates,
      updated_at: now
    })
    .eq('id', blogId)
    .select()
    .single();

  if (error) {
    console.error('Error updating blog post:', error);
    throw new Error(`Failed to update blog post: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data returned from blog post update');
  }

  return data;
}


export interface Project {
  id: string
  title: string
  description: string
  full_description: string
  category: string
  date: string
  author: string
  author_avatar: string | null
  tags: string[]
  github_link: string | null
  live_demo: string | null
  tech_stack: string[]
  features: string[]
  status: 'Completed' | 'In Progress' | 'Planned'
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  description: string
  full_description: string
  instructor: string
  instructor_avatar: string | null
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  enrolled_students: number
  rating: number
  lessons: number
  join_link: string
  syllabus: string[]
  prerequisites: string[]
  what_you_will_learn: string[]
  start_date: string
  created_at: string
  updated_at: string
}

// Enhanced types with image URLs for the frontend
export interface ProjectWithImage extends Omit<Project, 'author_avatar'> {
  image: string
  authorAvatar: string
  fullDescription: string
  githubLink?: string
  liveDemo?: string
  techStack: string[]
}

export interface CourseWithImage extends Omit<Course, 'instructor_avatar' | 'join_link' | 'start_date'> {
  image: string
  instructorAvatar: string
  fullDescription: string
  joinLink: string
  startDate: string
  whatYouWillLearn: string[]
  enrolledStudents: number
}

// Utility function to get image URL from storage
export const getImageUrl = (bucket: string, folder: string, id: string, extension: string = 'jpg'): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(`${folder}/${id}.${extension}`)
  
  return data.publicUrl
}

// Function to detect image extension by trying different formats for images in folders
export const getImageUrlWithFallback = async (bucket: string, folder: string, id: string): Promise<string> => {
  const extensions = ['jpg', 'jpeg', 'png', 'webp']
  
  for (const ext of extensions) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(`${folder}/${id}.${ext}`)
      
      if (data && !error) {
        return getImageUrl(bucket, folder, id, ext)
      }
    } catch (error) {
      console.log(`Failed to check ${folder}/${id}.${ext}:`, error)
      // Continue to next extension
    }
  }
  
  // Fallback to a default image or return a placeholder
  return `/images/placeholder.jpg`
}

// Function to get avatar image from root of images bucket - improved approach
export const getAvatarUrlWithFallback = async (id: string): Promise<string> => {
  if (!id) {
    return '/images/default-avatar.jpg'
  }

  const extensions = ['jpg', 'jpeg', 'png', 'webp']
  
  // Try to list files in the bucket to find the actual file
  try {
    const { data: files, error } = await supabase.storage
      .from('images')
      .list('', {
        limit: 1000,
        search: id
      })
    
    if (!error && files && files.length > 0) {
      // Find the file that matches our ID
      const matchedFile = files.find(file => 
        file.name.startsWith(id + '.') && 
        extensions.some(ext => file.name.endsWith('.' + ext))
      )
      
      if (matchedFile) {
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(matchedFile.name)
        
        return data.publicUrl
      }
    }
  } catch (error) {
    console.warn('Error listing files for avatar:', error)
  }
  
  // Fallback: try common extensions
  for (const ext of extensions) {
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(`${id}.${ext}`)
    
    // Return the first URL (jpg by default) - browser will handle 404s
    return data.publicUrl
  }
  
  // Final fallback
  return '/images/default-avatar.jpg'
}

// Synchronous version that just tries the most common extension first
export const getAvatarUrlSync = (id: string, extension: string = 'jpg'): string => {
  if (!id) {
    return '/images/default-avatar.jpg'
  }

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(`${id}.${extension}`)
  
  return data.publicUrl || '/images/default-avatar.jpg'
}

// Alternative approach: Generate multiple possible URLs and let the frontend handle fallbacks
export const getAvatarUrlsWithFallbacks = (id: string): string[] => {
  const extensions = ['jpg', 'jpeg', 'png', 'webp']
  const urls: string[] = []
  
  if (!id) {
    return ['/images/default-avatar.jpg']
  }
  
  for (const ext of extensions) {
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(`${id}.${ext}`)
    
    if (data.publicUrl) {
      urls.push(data.publicUrl)
    }
  }
  
  // Add default fallback
  urls.push('/images/default-avatar.jpg')
  
  return urls
}

// Helper function to extract clean author/instructor ID
const extractPersonId = (person: string, avatarField?: string | null): string => {
  if (avatarField) {
    // Extract ID from existing avatar path
    return avatarField.replace(/\/images\/team\/|\/images\/|\.jpg|\.jpeg|\.png|\.webp/g, '')
  }
  
  // Generate ID from person name
  return person.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// Projects API functions
export const projectsApi = {
  // Get all projects with images
  async getAll(): Promise<ProjectWithImage[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Transform data and add image URLs
    const projectsWithImages = await Promise.all(
      data.map(async (project): Promise<ProjectWithImage> => {
        const imageUrl = await getImageUrlWithFallback('images', 'projects', project.id)
        
        // Get author avatar using the improved function
        const authorId = extractPersonId(project.author, project.author_avatar)
        const authorAvatarUrl = await getAvatarUrlWithFallback(authorId)
        
        return {
          ...project,
          image: imageUrl,
          authorAvatar: authorAvatarUrl,
          fullDescription: project.full_description,
          githubLink: project.github_link || undefined,
          liveDemo: project.live_demo || undefined,
          techStack: project.tech_stack
        }
      })
    )
    
    return projectsWithImages
  },

  // Get project by ID
  async getById(id: string): Promise<ProjectWithImage | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    if (!data) return null
    
    const imageUrl = await getImageUrlWithFallback('images', 'projects', data.id)
    
    // Get author avatar using the improved function
    const authorId = extractPersonId(data.author, data.author_avatar)
    const authorAvatarUrl = await getAvatarUrlWithFallback(authorId)
    
    return {
      ...data,
      image: imageUrl,
      authorAvatar: authorAvatarUrl,
      fullDescription: data.full_description,
      githubLink: data.github_link || undefined,
      liveDemo: data.live_demo || undefined,
      techStack: data.tech_stack
    }
  },

  // Get projects by category
  async getByCategory(category: string): Promise<ProjectWithImage[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    const projectsWithImages = await Promise.all(
      data.map(async (project): Promise<ProjectWithImage> => {
        const imageUrl = await getImageUrlWithFallback('images', 'projects', project.id)
        
        // Get author avatar using the improved function
        const authorId = extractPersonId(project.author, project.author_avatar)
        const authorAvatarUrl = await getAvatarUrlWithFallback(authorId)
        
        return {
          ...project,
          image: imageUrl,
          authorAvatar: authorAvatarUrl,
          fullDescription: project.full_description,
          githubLink: project.github_link || undefined,
          liveDemo: project.live_demo || undefined,
          techStack: project.tech_stack
        }
      })
    )
    
    return projectsWithImages
  },

  // Get projects by status
  async getByStatus(status: Project['status']): Promise<ProjectWithImage[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    const projectsWithImages = await Promise.all(
      data.map(async (project): Promise<ProjectWithImage> => {
        const imageUrl = await getImageUrlWithFallback('images', 'projects', project.id)
        
        // Get author avatar using the improved function
        const authorId = extractPersonId(project.author, project.author_avatar)
        const authorAvatarUrl = await getAvatarUrlWithFallback(authorId)
        
        return {
          ...project,
          image: imageUrl,
          authorAvatar: authorAvatarUrl,
          fullDescription: project.full_description,
          githubLink: project.github_link || undefined,
          liveDemo: project.live_demo || undefined,
          techStack: project.tech_stack
        }
      })
    )
    
    return projectsWithImages
  }
}

// Courses API functions
export const coursesApi = {
  // Get all courses with images
  async getAll(): Promise<CourseWithImage[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    // Transform data and add image URLs
    const coursesWithImages = await Promise.all(
      data.map(async (course): Promise<CourseWithImage> => {
        const imageUrl = await getImageUrlWithFallback('images', 'courses', course.id)
        
        // Get instructor avatar using the improved function
        const instructorId = extractPersonId(course.instructor, course.instructor_avatar)
        const instructorAvatarUrl = await getAvatarUrlWithFallback(instructorId)
        
        return {
          ...course,
          image: imageUrl,
          instructorAvatar: instructorAvatarUrl,
          fullDescription: course.full_description,
          joinLink: course.join_link,
          startDate: course.start_date,
          whatYouWillLearn: course.what_you_will_learn,
          enrolledStudents: course.enrolled_students
        }
      })
    )
    
    return coursesWithImages
  },

  // Get course by ID
  async getById(id: string): Promise<CourseWithImage | null> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    if (!data) return null
    
    const imageUrl = await getImageUrlWithFallback('images', 'courses', data.id)
    
    // Get instructor avatar using the improved function
    const instructorId = extractPersonId(data.instructor, data.instructor_avatar)
    const instructorAvatarUrl = await getAvatarUrlWithFallback(instructorId)
    
    return {
      ...data,
      image: imageUrl,
      instructorAvatar: instructorAvatarUrl,
      fullDescription: data.full_description,
      joinLink: data.join_link,
      startDate: data.start_date,
      whatYouWillLearn: data.what_you_will_learn,
      enrolledStudents: data.enrolled_students
    }
  },

  // Get courses by level
  async getByLevel(level: Course['level']): Promise<CourseWithImage[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('level', level)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    const coursesWithImages = await Promise.all(
      data.map(async (course): Promise<CourseWithImage> => {
        const imageUrl = await getImageUrlWithFallback('images', 'courses', course.id)
        
        // Get instructor avatar using the improved function
        const instructorId = extractPersonId(course.instructor, course.instructor_avatar)
        const instructorAvatarUrl = await getAvatarUrlWithFallback(instructorId)
        
        return {
          ...course,
          image: imageUrl,
          instructorAvatar: instructorAvatarUrl,
          fullDescription: course.full_description,
          joinLink: course.join_link,
          startDate: course.start_date,
          whatYouWillLearn: course.what_you_will_learn,
          enrolledStudents: course.enrolled_students
        }
      })
    )
    
    return coursesWithImages
  },

  // Get top-rated courses
  async getTopRated(limit: number = 10): Promise<CourseWithImage[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('rating', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    
    const coursesWithImages = await Promise.all(
      data.map(async (course): Promise<CourseWithImage> => {
        const imageUrl = await getImageUrlWithFallback('images', 'courses', course.id)
        
        // Get instructor avatar using the improved function
        const instructorId = extractPersonId(course.instructor, course.instructor_avatar)
        const instructorAvatarUrl = await getAvatarUrlWithFallback(instructorId)
        
        return {
          ...course,
          image: imageUrl,
          instructorAvatar: instructorAvatarUrl,
          fullDescription: course.full_description,
          joinLink: course.join_link,
          startDate: course.start_date,
          whatYouWillLearn: course.what_you_will_learn,
          enrolledStudents: course.enrolled_students
        }
      })
    )
    
    return coursesWithImages
  },

  // Get most popular courses (by enrollment)
  async getMostPopular(limit: number = 10): Promise<CourseWithImage[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('enrolled_students', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    
    const coursesWithImages = await Promise.all(
      data.map(async (course): Promise<CourseWithImage> => {
        const imageUrl = await getImageUrlWithFallback('images', 'courses', course.id)
        
        // Get instructor avatar using the improved function
        const instructorId = extractPersonId(course.instructor, course.instructor_avatar)
        const instructorAvatarUrl = await getAvatarUrlWithFallback(instructorId)
        
        return {
          ...course,
          image: imageUrl,
          instructorAvatar: instructorAvatarUrl,
          fullDescription: course.full_description,
          joinLink: course.join_link,
          startDate: course.start_date,
          whatYouWillLearn: course.what_you_will_learn,
          enrolledStudents: course.enrolled_students
        }
      })
    )
    
    return coursesWithImages
  }
}

// Search functions
export const searchApi = {
  // Search projects
  async searchProjects(query: string): Promise<ProjectWithImage[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    const projectsWithImages = await Promise.all(
      data.map(async (project): Promise<ProjectWithImage> => {
        const imageUrl = await getImageUrlWithFallback('images', 'projects', project.id)
        
        // Get author avatar using the improved function
        const authorId = extractPersonId(project.author, project.author_avatar)
        const authorAvatarUrl = await getAvatarUrlWithFallback(authorId)
        
        return {
          ...project,
          image: imageUrl,
          authorAvatar: authorAvatarUrl,
          fullDescription: project.full_description,
          githubLink: project.github_link || undefined,
          liveDemo: project.live_demo || undefined,
          techStack: project.tech_stack
        }
      })
    )
    
    return projectsWithImages
  },

  // Search courses
  async searchCourses(query: string): Promise<CourseWithImage[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,instructor.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    const coursesWithImages = await Promise.all(
      data.map(async (course): Promise<CourseWithImage> => {
        const imageUrl = await getImageUrlWithFallback('images', 'courses', course.id)
        
        // Get instructor avatar using the improved function
        const instructorId = extractPersonId(course.instructor, course.instructor_avatar)
        const instructorAvatarUrl = await getAvatarUrlWithFallback(instructorId)
        
        return {
          ...course,
          image: imageUrl,
          instructorAvatar: instructorAvatarUrl,
          fullDescription: course.full_description,
          joinLink: course.join_link,
          startDate: course.start_date,
          whatYouWillLearn: course.what_you_will_learn,
          enrolledStudents: course.enrolled_students
        }
      })
    )
    
    return coursesWithImages
  }
}