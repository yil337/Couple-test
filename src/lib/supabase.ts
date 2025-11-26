import { v4 as uuidv4 } from 'uuid'
import { getSupabaseClient } from './supabaseClient'

/**
 * 生成唯一配对 ID
 */
export async function generatePairId() {
  if (typeof window === 'undefined') {
    return { success: false, error: 'generatePairId should only run on client' }
  }

  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return { success: false, error: 'Supabase client not available' }
    }

    const pairId = uuidv4()
    
    // 创建测试记录（只创建 ID，不插入数据）
    const { error } = await ((supabase
      .from('test_results') as any)
      .insert({
        id: pairId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single())

    if (error) {
      console.error('[Supabase] Create test error:', error)
      console.error('[Supabase] Error details:', JSON.stringify(error, null, 2))
      return { success: false, error: error.message || error.code || String(error) }
    }

    console.log('[Supabase] Generated pair ID:', pairId)
    return { success: true, pairId }
  } catch (error: any) {
    console.error('[Supabase] Generate pair ID error:', error)
    return { 
      success: false, 
      error: error?.message || error?.toString() || 'Unknown error'
    }
  }
}

/**
 * 保存用户A的结果
 */
export async function saveUserA(pairId: string, userData: any) {
  if (typeof window === 'undefined') {
    return { success: false, error: 'saveUserA should only run on client' }
  }

  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return { success: false, error: 'Supabase client not available' }
    }

    // 确保 userData 是有效的 JSON 对象
    const userDataJson = JSON.parse(JSON.stringify(userData))
    
    console.log('[Supabase] Saving userA data:', JSON.stringify(userDataJson, null, 2))
    
    // 直接更新记录（记录应该已经由 generatePairId 创建）
    const { error } = await ((supabase
      .from('test_results') as any)
      .update({
        user_a: userDataJson,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pairId)
      .select()
      .single())

    if (error) {
      // 如果更新失败（记录不存在），尝试创建新记录
        if (error.code === 'PGRST116') {
        // 确保 userData 是有效的 JSON 对象
        const userDataJson = JSON.parse(JSON.stringify(userData))
        
        const { error: insertError } = await ((supabase
          .from('test_results') as any)
          .insert({
            id: pairId,
            user_a: userDataJson,
            created_at: new Date().toISOString(),
          })
          .select()
          .single())

        if (insertError) {
          console.error('[Supabase] Insert userA error:', insertError)
          console.error('[Supabase] Insert error details:', JSON.stringify(insertError, null, 2))
          return { success: false, error: insertError.message || insertError.code || String(insertError) }
        }
      } else {
        console.error('[Supabase] Update userA error:', error)
        console.error('[Supabase] Update error details:', JSON.stringify(error, null, 2))
        return { success: false, error: error.message || error.code || String(error) }
      }
    }

    console.log('[Supabase] UserA saved successfully')
    return { success: true, pairId }
  } catch (error: any) {
    console.error('[Supabase] Save userA error:', error)
    return { 
      success: false, 
      error: error?.message || error?.toString() || 'Unknown error'
    }
  }
}

/**
 * 保存用户B的结果
 */
export async function saveUserB(pairId: string, userData: any) {
  if (typeof window === 'undefined') {
    return { success: false, error: 'saveUserB should only run on client' }
  }

  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return { success: false, error: 'Supabase client not available' }
    }

    // 确保 userData 是有效的 JSON 对象
    const userDataJson = JSON.parse(JSON.stringify(userData))
    
    console.log('[Supabase] Saving userB data:', JSON.stringify(userDataJson, null, 2))
    
    const { error } = await ((supabase
      .from('test_results') as any)
      .update({
        user_b: userDataJson,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pairId)
      .select()
      .single())

    if (error) {
      console.error('[Supabase] Save userB error:', error)
      console.error('[Supabase] Save userB error details:', JSON.stringify(error, null, 2))
      return { success: false, error: error.message || error.code || String(error) }
    }

    console.log('[Supabase] UserB saved successfully')
    return { success: true, pairId }
  } catch (error: any) {
    console.error('[Supabase] Save userB error:', error)
    return { 
      success: false, 
      error: error?.message || error?.toString() || 'Unknown error'
    }
  }
}

/**
 * 获取测试结果（用户A）
 */
export async function getTestResult(testId: string) {
  if (typeof window === 'undefined') {
    return { success: false, error: 'getTestResult should only run on client' }
  }

  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return { success: false, error: 'Supabase client not available' }
    }

    const { data, error } = await ((supabase
      .from('test_results') as any)
      .select('user_a')
      .eq('id', testId)
      .single())

    if (error) {
      console.error('[Supabase] Get test result error:', error)
      return { success: false, error: error.message }
    }

    if (data && data.user_a) {
      return { success: true, data: data.user_a }
    } else {
      return { success: false, error: 'userA not found' }
    }
  } catch (error: any) {
    console.error('[Supabase] Get test result error:', error)
    return { 
      success: false, 
      error: error?.message || error?.toString() || 'Unknown error'
    }
  }
}

/**
 * 获取配对数据（用户A和用户B）
 */
export async function getPairData(pairId: string) {
  if (typeof window === 'undefined') {
    return { success: false, error: 'getPairData should only run on client' }
  }

  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return { success: false, error: 'Supabase client not available' }
    }

    const { data, error } = await ((supabase
      .from('test_results') as any)
      .select('user_a, user_b')
      .eq('id', pairId)
      .single())

    if (error) {
      console.error('[Supabase] Get pair data error:', error)
      return { success: false, error: error.message }
    }

    if (data) {
      const pairResult = {
        userA: data.user_a || null,
        userB: data.user_b || null,
      }

      if (!pairResult.userA && !pairResult.userB) {
        return { success: false, error: 'Pair data not found' }
      }

      return { success: true, data: pairResult }
    } else {
      return { success: false, error: 'Pair not found' }
    }
  } catch (error: any) {
    console.error('[Supabase] Get pair data error:', error)
    return { 
      success: false, 
      error: error?.message || error?.toString() || 'Unknown error'
    }
  }
}

