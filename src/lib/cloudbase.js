import cloudbase from '@cloudbase/js-sdk'

// CloudBase 初始化 - 严格客户端执行
let app = null
let db = null
let auth = null
let isInitialized = false
let isAuthenticated = false
let initPromise = null

/**
 * 获取 CloudBase App 实例
 * 严格禁止在 SSR/Worker 环境执行
 */
export function getCloudBaseApp() {
  // STRICT: SSR/Edge Runtime 禁止访问
  if (typeof window === 'undefined') {
    console.warn('[CloudBase] getCloudBaseApp() called on server - CloudBase disabled on server')
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
 * 严格禁止在 SSR/Worker 环境执行
 */
export function getDb() {
  const app = getCloudBaseApp()
  if (!app) {
    return null
  }

  if (!db) {
    db = app.database()
  }

  return db
}

/**
 * 确保 CloudBase 已初始化并完成匿名登录
 * 严格禁止在 SSR/Worker 环境执行
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

  // 如果已经初始化并认证，直接返回
  if (isInitialized && isAuthenticated && auth && auth.currentUser) {
    console.log('[CloudBase] Already initialized and authenticated')
    return
  }

  // 开始初始化
  console.log('[CloudBase] Starting initialization...')
  initPromise = (async () => {
    try {
      const appInstance = getCloudBaseApp()
      if (!appInstance) {
        throw new Error('CloudBase app not available')
      }
      console.log('[CloudBase] App instance obtained')

      auth = appInstance.auth()
      db = appInstance.database()
      console.log('[CloudBase] Auth and database instances created')

      // 检查是否已有用户
      const currentUser = auth.currentUser
      if (currentUser) {
        console.log('[CloudBase] Already has current user:', currentUser.uid)
        isAuthenticated = true
        isInitialized = true
        return
      }

      // 匿名登录
      console.log('[CloudBase] Attempting anonymous login...')
      const loginResult = await auth.signInAnonymously()
      console.log('[CloudBase] Anonymous login result:', loginResult)
      
      isAuthenticated = true
      isInitialized = true

      console.log('[CloudBase] Anonymous login successful')
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
      isAuthenticated = false
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
    
    // 获取数据库实例
    const database = getDb()
    if (!database) {
      console.error('[CloudBase] Database not available')
      return { success: false, error: 'Database not available' }
    }
    console.log('[CloudBase] Database instance obtained')
    
    // 检查认证状态
    if (auth && auth.currentUser) {
      console.log('[CloudBase] Current user:', auth.currentUser.uid)
    } else {
      console.warn('[CloudBase] No current user, but proceeding...')
    }
    
    // 生成唯一 ID
    const pairId = `pair_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log('[CloudBase] Generated pairId:', pairId)
    
    // CloudBase: 使用 doc().set() 创建带自定义 ID 的文档
    console.log('[CloudBase] Attempting to create document...')
    const result = await database.collection('tests').doc(pairId).set({
      createdAt: new Date().toISOString(),
    })
    console.log('[CloudBase] Document created successfully:', result)
    
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
    return { 
      success: false, 
      error: error.message || error.code || String(error),
      details: error.stack
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
    throw new Error('saveUserA should only run on client')
  }

  try {
    await ensureAuth()
    
    const database = getDb()
    if (!database) {
      throw new Error('Database not available')
    }
    
    console.log('[CloudBase] saveUserA - pairId:', pairId)
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
    throw new Error('saveUserB should only run on client')
  }

  try {
    await ensureAuth()
    
    const database = getDb()
    if (!database) {
      throw new Error('Database not available')
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
    throw new Error('getTestResult should only run on client')
  }

  try {
    await ensureAuth()
    
    const database = getDb()
    if (!database) {
      throw new Error('Database not available')
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
    throw new Error('getPairData should only run on client')
  }

  try {
    await ensureAuth()
    
    const database = getDb()
    if (!database) {
      throw new Error('Database not available')
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
    throw new Error('testWrite should only run on client')
  }

  try {
    await ensureAuth()
    const database = getDb()
    if (!database) {
      throw new Error('Database not available')
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
    throw new Error('testRead should only run on client')
  }

  try {
    await ensureAuth()
    const database = getDb()
    if (!database) {
      throw new Error('Database not available')
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
