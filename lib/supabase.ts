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