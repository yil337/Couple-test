import { createClient } from '@supabase/supabase-js'

// Supabase 客户端单例
let supabaseClient: ReturnType<typeof createClient> | null = null

// Supabase 客户端初始化（单例模式）
// 严格客户端执行
export function getSupabaseClient() {
  // SSR/Edge Runtime 禁止访问
  if (typeof window === 'undefined') {
    return null
  }

  // 如果已经创建，直接返回
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Supabase] Missing environment variables')
    console.error('[Supabase] NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
    console.error('[Supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing')
    console.error('[Supabase] Current environment:', process.env.NODE_ENV)
    console.error('[Supabase] All NEXT_PUBLIC_ vars:', Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_')))
    return null
  }

  // 创建单例客户端
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

