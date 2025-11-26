import { createClient } from '@supabase/supabase-js'

// Supabase 客户端初始化
// 严格客户端执行
export function getSupabaseClient() {
  // SSR/Edge Runtime 禁止访问
  if (typeof window === 'undefined') {
    return null
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Supabase] Missing environment variables')
    console.error('[Supabase] NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
    console.error('[Supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing')
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

