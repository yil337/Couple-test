import cloudbase from '@cloudbase/js-sdk'

// CloudBase 初始化 - 严格客户端执行
let app = null
let db = null
let auth = null
let isInitialized = false
let initPromise = null

/**
 * 获取 CloudBase App 实例
 * 严格禁止在 SSR/Worker 环境执行
 */
export function getApp() {
  if (typeof window === 'undefined') {
    return null
  }

  if (!app) {
    app = cloudbase.init({
      env: 'cloud1-1gr3cxva723e4e6e',
      region: 'ap-shanghai'
    })
  }

  return app
}

/**
 * 获取数据库实例
 */
export function getDb() {
  const appInstance = getApp()
  if (!appInstance) {
    return null
  }

  if (!db) {
    db = appInstance.database()
  }

  return db
}

/**
 * 确保 CloudBase 已初始化并完成匿名登录
 * 使用最简单的 CloudBase Web SDK 方式
 */
async function ensureAuth() {
  if (typeof window === 'undefined') {
    throw new Error('ensureAuth should only run on client')
  }

  // 如果已经在初始化中，等待完成
  if (initPromise) {
    await initPromise
    return
  }

  // 如果已经初始化，直接返回
  if (isInitialized && auth) {
    return
  }

  // 开始初始化
  initPromise = (async () => {
    try {
      const appInstance = getApp()
      if (!appInstance) {
        throw new Error('CloudBase app not available')
      }

      // 初始化 auth 和 database
      auth = appInstance.auth()
      db = appInstance.database()

      // 检查是否已有登录状态
      try {
        const loginState = await auth.getLoginState()
        if (loginState && loginState.loginType) {
          console.log('[CloudBase] Already logged in:', loginState.loginType)
          isInitialized = true
          return
        }
      } catch (e) {
        // 没有登录状态，继续匿名登录
        console.log('[CloudBase] No existing login state')
      }

      // 执行匿名登录 - 使用最简单的直接方法
      console.log('[CloudBase] Starting anonymous login...')
      
      // 方法：直接调用 signInAnonymously（如果存在）
      if (typeof auth.signInAnonymously === 'function') {
        await auth.signInAnonymously()
        console.log('[CloudBase] Anonymous login successful (signInAnonymously)')
      }
      // 备用方法：通过 oauthInstance
      else if (auth.oauthInstance && typeof auth.oauthInstance.signInAnonymously === 'function') {
        await auth.oauthInstance.signInAnonymously()
        console.log('[CloudBase] Anonymous login successful (oauthInstance.signInAnonymously)')
      }
      // 如果都不存在，尝试直接使用数据库（某些配置可能不需要登录）
      else {
        console.warn('[CloudBase] No anonymous login method found, proceeding without explicit login')
        // 某些 CloudBase 配置允许匿名访问，直接继续
      }

      isInitialized = true
      console.log('[CloudBase] Initialized successfully')
    } catch (error) {
      console.error('[CloudBase] Initialization error:', error)
      isInitialized = false
      initPromise = null
      throw error
    }
  })()

  await initPromise
}

/**
 * 生成唯一配对 ID
 */
export async function generatePairId() {
  if (typeof window === 'undefined') {
    return { success: false, error: 'generatePairId should only run on client' }
  }

  try {
    await ensureAuth()
    
    const database = getDb()
    if (!database) {
      return { success: false, error: 'Database not available' }
    }
    
    const pairId = `pair_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    await database.collection('tests').doc(pairId).set({
      createdAt: new Date().toISOString(),
    })
    
    console.log('[CloudBase] Generated pair ID:', pairId)
    return { success: true, pairId }
  } catch (error) {
    console.error('[CloudBase] Generate pair ID error:', error)
    return { 
      success: false, 
      error: error?.message || error?.toString() || 'Unknown error'
    }
  }
}

/**
 * 保存用户A的结果
 */
export async function saveUserA(pairId, userData) {
  if (typeof window === 'undefined') {
    return { success: false, error: 'saveUserA should only run on client' }
  }

  try {
    await ensureAuth()
    
    const database = getDb()
    if (!database) {
      return { success: false, error: 'Database not available' }
    }
    
    const existing = await database.collection('tests').doc(pairId).get()
    
    if (existing.data) {
      await database.collection('tests').doc(pairId).update({
        userA: {
          ...userData,
          createdAt: new Date().toISOString(),
        }
      })
    } else {
      await database.collection('tests').doc(pairId).set({
        createdAt: new Date().toISOString(),
        userA: {
          ...userData,
          createdAt: new Date().toISOString(),
        }
      })
    }
    
    console.log('[CloudBase] UserA saved successfully')
    return { success: true, pairId }
  } catch (error) {
    console.error('[CloudBase] Save userA error:', error)
    return { 
      success: false, 
      error: error?.message || error?.toString() || 'Unknown error'
    }
  }
}

/**
 * 保存用户B的结果
 */
export async function saveUserB(pairId, userData) {
  if (typeof window === 'undefined') {
    return { success: false, error: 'saveUserB should only run on client' }
  }

  try {
    await ensureAuth()
    
    const database = getDb()
    if (!database) {
      return { success: false, error: 'Database not available' }
    }
    
    await database.collection('tests').doc(pairId).update({
      userB: {
        ...userData,
        createdAt: new Date().toISOString(),
      }
    })
    
    console.log('[CloudBase] UserB saved successfully')
    return { success: true, pairId }
  } catch (error) {
    console.error('[CloudBase] Save userB error:', error)
    return { 
      success: false, 
      error: error?.message || error?.toString() || 'Unknown error'
    }
  }
}

/**
 * 获取测试结果（用户A）
 */
export async function getTestResult(testId) {
  if (typeof window === 'undefined') {
    return { success: false, error: 'getTestResult should only run on client' }
  }

  try {
    await ensureAuth()
    
    const database = getDb()
    if (!database) {
      return { success: false, error: 'Database not available' }
    }
    
    const result = await database.collection('tests').doc(testId).get()
    
    if (result.data && result.data.userA) {
      return { success: true, data: result.data.userA }
    } else {
      return { success: false, error: 'Document or userA not found' }
    }
  } catch (error) {
    console.error('[CloudBase] Get test result error:', error)
    return { 
      success: false, 
      error: error?.message || error?.toString() || 'Unknown error'
    }
  }
}

/**
 * 获取配对数据（用户A和用户B）
 */
export async function getPairData(pairId) {
  if (typeof window === 'undefined') {
    return { success: false, error: 'getPairData should only run on client' }
  }

  try {
    await ensureAuth()
    
    const database = getDb()
    if (!database) {
      return { success: false, error: 'Database not available' }
    }
    
    const result = await database.collection('tests').doc(pairId).get()
    
    if (result.data) {
      const pairResult = {
        userA: result.data.userA || null,
        userB: result.data.userB || null,
      }

      if (!pairResult.userA && !pairResult.userB) {
        return { success: false, error: 'Pair data not found' }
      }

      return { success: true, data: pairResult }
    } else {
      return { success: false, error: 'Pair not found' }
    }
  } catch (error) {
    console.error('[CloudBase] Get pair data error:', error)
    return { 
      success: false, 
      error: error?.message || error?.toString() || 'Unknown error'
    }
  }
}
