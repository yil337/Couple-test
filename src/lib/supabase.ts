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

    // 确保 userData 是有效的 JSON 对象，移除任何 undefined 值
    const cleanUserData = JSON.parse(JSON.stringify(userData, (key, value) => {
      // 移除 undefined 值
      if (value === undefined) {
        return null
      }
      return value
    }))
    
    console.log('[Supabase] Saving userA data (cleaned):', JSON.stringify(cleanUserData, null, 2))
    console.log('[Supabase] userA data type:', typeof cleanUserData)
    console.log('[Supabase] userA is array?', Array.isArray(cleanUserData))
    
    // 提取关键字段（如果存在）用于顶层存储（便于查询）
    const personalProfile = cleanUserData.personalProfile || {}
    const updateData: any = {
      user_a: cleanUserData,
      updated_at: new Date().toISOString(),
    }
    
    // 如果存在个人画像数据，同时更新顶层字段
    if (personalProfile.animal) {
      updateData.animal = personalProfile.animal
    }
    if (personalProfile.primaryLoveStyle) {
      updateData.ls_type = personalProfile.primaryLoveStyle
    }
    if (personalProfile.primaryAttachment) {
      updateData.at_type = personalProfile.primaryAttachment
    }
    if (cleanUserData.sternbergType) {
      updateData.sternberg_type = cleanUserData.sternbergType
    }
    if (cleanUserData.gottmanType) {
      updateData.gottman_type = cleanUserData.gottmanType
    }
    if (personalProfile) {
      updateData.scores_json = personalProfile
    }
    
    // 直接更新记录（记录应该已经由 generatePairId 创建）
    const { error } = await ((supabase
      .from('test_results') as any)
      .update(updateData)
      .eq('id', pairId)
      .select()
      .single())

    if (error) {
      // 如果更新失败（记录不存在），尝试创建新记录
        if (error.code === 'PGRST116') {
        // 确保 userData 是有效的 JSON 对象，移除任何 undefined 值
        const cleanUserData = JSON.parse(JSON.stringify(userData, (key, value) => {
          // 移除 undefined 值
          if (value === undefined) {
            return null
          }
          return value
        }))
        
        // 提取关键字段用于顶层存储
        const personalProfile = cleanUserData.personalProfile || {}
        const insertData: any = {
          id: pairId,
          user_a: cleanUserData,
          created_at: new Date().toISOString(),
        }
        
        if (personalProfile.animal) {
          insertData.animal = personalProfile.animal
        }
        if (personalProfile.primaryLoveStyle) {
          insertData.ls_type = personalProfile.primaryLoveStyle
        }
        if (personalProfile.primaryAttachment) {
          insertData.at_type = personalProfile.primaryAttachment
        }
        if (cleanUserData.sternbergType) {
          insertData.sternberg_type = cleanUserData.sternbergType
        }
        if (cleanUserData.gottmanType) {
          insertData.gottman_type = cleanUserData.gottmanType
        }
        if (personalProfile) {
          insertData.scores_json = personalProfile
        }
        
        const { error: insertError } = await ((supabase
          .from('test_results') as any)
          .insert(insertData)
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

    // 确保 userData 是有效的 JSON 对象，移除任何 undefined 值
    const cleanUserData = JSON.parse(JSON.stringify(userData, (key, value) => {
      // 移除 undefined 值
      if (value === undefined) {
        return null
      }
      return value
    }))
    
    console.log('[Supabase] Saving userB data (cleaned):', JSON.stringify(cleanUserData, null, 2))
    console.log('[Supabase] userB data type:', typeof cleanUserData)
    console.log('[Supabase] userB is array?', Array.isArray(cleanUserData))
    
    // 提取关键字段（如果存在）用于顶层存储
    const personalProfile = cleanUserData.personalProfile || {}
    const updateData: any = {
      user_b: cleanUserData,
      updated_at: new Date().toISOString(),
    }
    
    // 注意：userB 的顶层字段可以用于查询，但主要数据在 user_b JSONB 中
    // 如果需要，可以在这里添加 userB 的顶层字段更新
    
    const { error } = await ((supabase
      .from('test_results') as any)
      .update(updateData)
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
      // 解析 JSONB 数据（Supabase 可能返回字符串或对象）
      let userA = null
      let userB = null
      
      if (data.user_a) {
        userA = typeof data.user_a === 'string' 
          ? JSON.parse(data.user_a) 
          : data.user_a
        console.log('[Supabase] Parsed userA:', userA)
      }
      
      if (data.user_b) {
        userB = typeof data.user_b === 'string' 
          ? JSON.parse(data.user_b) 
          : data.user_b
        console.log('[Supabase] Parsed userB:', userB)
      }
      
      const pairResult = {
        userA: userA,
        userB: userB,
      }

      console.log('[Supabase] Pair result:', pairResult)

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

