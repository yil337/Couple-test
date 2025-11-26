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
 * 必须在浏览器环境中初始化
 */
export function getApp() {
  // STRICT: SSR/Edge Runtime 禁止访问
  if (typeof window === 'undefined') {
    console.warn('[CloudBase] getApp() called on server - CloudBase disabled on server')
    return null
  }

  if (!app) {
    console.log('[CloudBase] Initializing CloudBase app...')
    app = cloudbase.init({
      env: 'cloud1-1gr3cxva723e4e6e',
      region: 'ap-shanghai'
    })
    console.log('[CloudBase] CloudBase app initialized')
  }

  return app
}

/**
 * 获取数据库实例
 * 严格禁止在 SSR/Worker 环境执行
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
 * 严格禁止在 SSR/Worker 环境执行
 * 必须在浏览器环境中执行登录
 */
async function ensureAuth() {
  // STRICT: 服务端禁止执行
  if (typeof window === 'undefined') {
    console.error('[CloudBase] ensureAuth called on server')
    throw new Error('ensureAuth should only run on client')
  }

  // 如果已经在初始化中，等待完成
  if (initPromise) {
    console.log('[CloudBase] Waiting for existing initialization...')
    await initPromise
    return
  }

  // 如果已经初始化，检查登录状态
  if (isInitialized && app) {
    // 确保 auth 已初始化
    if (!auth) {
      auth = app.auth({
        persistence: "local"
      })
    }
    if (auth && auth.hasLoginState()) {
      console.log('[CloudBase] Already initialized and has login state')
      return
    }
  }

  // 开始初始化
  console.log('[CloudBase] Starting initialization and anonymous login...')
  initPromise = (async () => {
    try {
      const appInstance = getApp()
      if (!appInstance) {
        throw new Error('CloudBase app not available')
      }
      console.log('[CloudBase] App instance obtained')

      // CloudBase Web SDK: 使用 persistence: "local" 初始化 auth
      auth = appInstance.auth({
        persistence: "local"
      })
      db = appInstance.database()
      console.log('[CloudBase] Auth and database instances created')

      // 检查是否已有登录状态
      if (auth.hasLoginState()) {
        console.log('[CloudBase] Already has login state')
        isInitialized = true
        return
      }

      // CloudBase Web SDK: 在浏览器中执行匿名登录
      // 使用 signInAnonymously() 方法（Web SDK 标准方法）
      console.log('[CloudBase] Attempting anonymous login...')
      const loginResult = await auth.signInAnonymously()
      console.log('[CloudBase] Anonymous login successful:', loginResult)
      
      isInitialized = true
      console.log('[CloudBase] Initialized successfully')
    } catch (error) {
      console.error('[CloudBase] Initialization or Anonymous login error:', error)
      console.error('[CloudBase] Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code,
        fullError: error
      })
      isInitialized = false
      initPromise = null
      throw error
    }
  })()

  await initPromise
}

/**
 * 生成唯一配对 ID
 * 严格禁止在 SSR/Worker 环境执行
 */
export async function generatePairId() {
  // STRICT: 服务端禁止执行
  if (typeof window === 'undefined') {
    console.error('[CloudBase] generatePairId called on server')
    return { success: false, error: 'generatePairId should only run on client' }
  }

  try {
    console.log('[CloudBase] Starting generatePairId...')
    
    // 确保认证
    console.log('[CloudBase] Ensuring authentication...')
    await ensureAuth()
    console.log('[CloudBase] Authentication ensured')
    
    // 验证登录状态
    if (auth && !auth.hasLoginState()) {
      console.error('[CloudBase] No login state after ensureAuth')
      return { success: false, error: 'Authentication failed - no login state' }
    }
    console.log('[CloudBase] Login state verified')
    
    // 获取数据库实例
    const database = getDb()
    if (!database) {
      console.error('[CloudBase] Database not available')
      return { success: false, error: 'Database not available' }
    }
    console.log('[CloudBase] Database instance obtained')
    
    // 生成唯一 ID
    const pairId = `pair_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log('[CloudBase] Generated pairId:', pairId)
    
    // CloudBase: 使用 doc().set() 创建带自定义 ID 的文档
    console.log('[CloudBase] Attempting to create document...')
    await database.collection('tests').doc(pairId).set({
      createdAt: new Date().toISOString(),
    })
    console.log('[CloudBase] Document created successfully')
    
    console.log('[CloudBase] Generated pair ID:', pairId)
    return { success: true, pairId }
  } catch (error) {
    console.error('[CloudBase] Generate pair ID error:', error)
    console.error('[CloudBase] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      fullError: error
    })
    // 确保返回字符串格式的错误信息，避免 [object Object]
    let errorMessage = 'Unknown error'
    if (error && typeof error === 'object') {
      errorMessage = error.message || error.code || error.toString() || JSON.stringify(error)
    } else if (error) {
      errorMessage = String(error)
    }
    return { 
      success: false, 
      error: errorMessage,
      details: error.stack || error.toString()
    }
  }
}

/**
 * 保存用户A的结果
 * 严格禁止在 SSR/Worker 环境执行
 */
export async function saveUserA(pairId, userData) {
  // STRICT: 服务端禁止执行
  if (typeof window === 'undefined') {
    console.error('[CloudBase] saveUserA called on server')
    return { success: false, error: 'saveUserA should only run on client' }
  }

  try {
    console.log('[CloudBase] saveUserA - pairId:', pairId)
    
    await ensureAuth()
    
    // 验证登录状态
    if (auth && !auth.hasLoginState()) {
      console.error('[CloudBase] No login state in saveUserA')
      return { success: false, error: 'Authentication failed - no login state' }
    }
    
    const database = getDb()
    if (!database) {
      return { success: false, error: 'Database not available' }
    }
    
    console.log('[CloudBase] saveUserA - userData:', userData)
    
    // 检查文档是否存在
    const existing = await database.collection('tests').doc(pairId).get()
    
    if (existing.data) {
      // 更新现有文档
      await database.collection('tests').doc(pairId).update({
        userA: {
          ...userData,
          createdAt: new Date().toISOString(),
        }
      })
      console.log('[CloudBase] saveUserA - updated existing document')
    } else {
      // 创建新文档
      await database.collection('tests').doc(pairId).set({
        createdAt: new Date().toISOString(),
        userA: {
          ...userData,
          createdAt: new Date().toISOString(),
        }
      })
      console.log('[CloudBase] saveUserA - created new document')
    }
    
    // 验证保存
    const verifyResult = await database.collection('tests').doc(pairId).get()
    console.log('[CloudBase] saveUserA - verification read:', verifyResult.data)
    
    console.log('[CloudBase] UserA saved successfully to tests/' + pairId)
    return { success: true, pairId }
  } catch (error) {
    console.error('[CloudBase] Save userA error:', error)
    return { success: false, error: error.message || String(error) }
  }
}

/**
 * 保存用户B的结果
 * 严格禁止在 SSR/Worker 环境执行
 */
export async function saveUserB(pairId, userData) {
  // STRICT: 服务端禁止执行
  if (typeof window === 'undefined') {
    console.error('[CloudBase] saveUserB called on server')
    return { success: false, error: 'saveUserB should only run on client' }
  }

  try {
    await ensureAuth()
    
    // 验证登录状态
    if (auth && !auth.hasLoginState()) {
      console.error('[CloudBase] No login state in saveUserB')
      return { success: false, error: 'Authentication failed - no login state' }
    }
    
    const database = getDb()
    if (!database) {
      return { success: false, error: 'Database not available' }
    }
    
    // 更新文档，添加 userB 字段
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
    return { success: false, error: error.message || String(error) }
  }
}

/**
 * 获取测试结果（用户A）
 * 严格禁止在 SSR/Worker 环境执行
 */
export async function getTestResult(testId) {
  // STRICT: 服务端禁止执行
  if (typeof window === 'undefined') {
    console.error('[CloudBase] getTestResult called on server')
    return { success: false, error: 'getTestResult should only run on client' }
  }

  try {
    await ensureAuth()
    
    const database = getDb()
    if (!database) {
      return { success: false, error: 'Database not available' }
    }
    
    // 获取文档
    const result = await database.collection('tests').doc(testId).get()
    
    console.log('[CloudBase] getTestResult - testId:', testId)
    console.log('[CloudBase] getTestResult - result.data:', result.data)
    
    if (result.data) {
      const docData = result.data
      
      if (docData && docData.userA) {
        console.log('[CloudBase] getTestResult - found userA:', docData.userA)
        return { success: true, data: docData.userA }
      } else {
        console.log('[CloudBase] getTestResult - userA not found in docData:', docData)
        return { success: false, error: 'userA not found in document' }
      }
    } else {
      console.log('[CloudBase] getTestResult - document not found')
      return { success: false, error: 'Document not found' }
    }
  } catch (error) {
    console.error('[CloudBase] Get test result error:', error)
    return { success: false, error: error.message || String(error) }
  }
}

/**
 * 获取配对数据（用户A和用户B）
 * 严格禁止在 SSR/Worker 环境执行
 */
export async function getPairData(pairId) {
  // STRICT: 服务端禁止执行
  if (typeof window === 'undefined') {
    console.error('[CloudBase] getPairData called on server')
    return { success: false, error: 'getPairData should only run on client' }
  }

  try {
    await ensureAuth()
    
    const database = getDb()
    if (!database) {
      return { success: false, error: 'Database not available' }
    }
    
    // 获取文档
    const result = await database.collection('tests').doc(pairId).get()
    
    console.log('[CloudBase] getPairData - pairId:', pairId)
    console.log('[CloudBase] getPairData - result.data:', result.data)
    
    if (result.data) {
      const pairDoc = result.data
      
      const pairResult = {
        userA: pairDoc.userA || null,
        userB: pairDoc.userB || null,
      }

      console.log('[CloudBase] getPairData - pairResult:', pairResult)

      if (!pairResult.userA && !pairResult.userB) {
        return { success: false, error: 'Pair data not found' }
      }

      return { success: true, data: pairResult }
    } else {
      console.log('[CloudBase] getPairData - document not found')
      return { success: false, error: 'Pair not found' }
    }
  } catch (error) {
    console.error('[CloudBase] Get pair data error:', error)
    return { success: false, error: error.message || String(error) }
  }
}

// 测试函数：写入数据库
export async function testWrite() {
  if (typeof window === 'undefined') {
    return { success: false, error: 'testWrite should only run on client' }
  }

  try {
    await ensureAuth()
    const database = getDb()
    if (!database) {
      return { success: false, error: 'Database not available' }
    }
    const docId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    await database.collection('test').doc(docId).set({
      hello: 'world',
      timestamp: new Date().toISOString(),
    })
    console.log('[CloudBase] Test write successful')
    return { success: true }
  } catch (error) {
    console.error('[CloudBase] Test write error:', error)
    return { success: false, error: error.message || String(error) }
  }
}

// 测试函数：读取数据库
export async function testRead() {
  if (typeof window === 'undefined') {
    return { success: false, error: 'testRead should only run on client' }
  }

  try {
    await ensureAuth()
    const database = getDb()
    if (!database) {
      return { success: false, error: 'Database not available' }
    }
    const result = await database.collection('test').get()
    const docs = result.data.map((doc) => ({
      id: doc._id,
      ...doc
    }))
    console.log('[CloudBase] Test read successful:', docs)
    return { success: true, data: docs }
  } catch (error) {
    console.error('[CloudBase] Test read error:', error)
    return { success: false, error: error.message || String(error) }
  }
}
