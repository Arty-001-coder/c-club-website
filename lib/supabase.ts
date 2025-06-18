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