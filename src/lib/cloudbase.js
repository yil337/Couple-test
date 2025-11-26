import cloudbase from '@cloudbase/js-sdk'

// Initialize CloudBase
let app
let db
let auth
let isInitialized = false
let isAuthenticated = false

// Get database instance - STRICT client-side only
// This function MUST only be called from browser (client-side)
// Returns null if called on server or if database is not available
export function getDb() {
  // STRICT: Service-side/Edge Runtime禁止访问
  if (typeof window === 'undefined') {
    console.warn('[CloudBase] getDb() called on server - CloudBase disabled on server')
    return null
  }

  // Initialize CloudBase if not already done
  if (!isInitialized) {
    try {
      app = cloudbase.init({
        env: 'cloud1-1gr3cxva723e4e6e',
        region: 'ap-shanghai'
      })

      auth = app.auth()
      db = app.database()

      // Sign in anonymously (fire and forget for now, will be awaited in ensureAuth)
      auth.signInAnonymously().then(() => {
        isAuthenticated = true
        console.log('[CloudBase] Anonymous login successful')
      }).catch((error) => {
        console.error('[CloudBase] Anonymous login error:', error)
      })

      isInitialized = true
      console.log('[CloudBase] Initialized successfully')
    } catch (error) {
      console.error('[CloudBase] Initialization error:', error)
      return null
    }
  }

  return db
}

// Initialize CloudBase and ensure anonymous login
// Only initialize on client side (browser)
async function initCloudBase() {
  // STRICT: Check if we're in browser environment
  if (typeof window === 'undefined') {
    console.warn('[CloudBase] initCloudBase() called on server - CloudBase disabled on server')
    return { app: null, db: null, auth: null }
  }

  if (isInitialized && app && isAuthenticated) {
    return { app, db, auth }
  }

  try {
    // Initialize CloudBase
    app = cloudbase.init({
      env: 'cloud1-1gr3cxva723e4e6e',
      region: 'ap-shanghai'
    })

    auth = app.auth()
    db = app.database()

    // Sign in anonymously - ensure this happens before any database operations
    try {
      await auth.signInAnonymously()
      isAuthenticated = true
      console.log('[CloudBase] Anonymous login successful')
    } catch (authError) {
      console.error('[CloudBase] Anonymous login error:', authError)
      // Try to get current user
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new Error('Failed to authenticate with CloudBase')
      }
      isAuthenticated = true
    }

    isInitialized = true
    console.log('[CloudBase] Initialized successfully')
    return { app, db, auth }
  } catch (error) {
    console.error('[CloudBase] Initialization error:', error)
    throw error
  }
}

// Ensure authentication before database operations
async function ensureAuth() {
  // STRICT: Only run in browser
  if (typeof window === 'undefined') {
    console.warn('[CloudBase] ensureAuth() called on server - CloudBase disabled on server')
    return
  }

  if (!isInitialized || !isAuthenticated) {
    await initCloudBase()
  }
  
  // Double check authentication status
  if (auth && !auth.currentUser) {
    await auth.signInAnonymously()
    isAuthenticated = true
  }
}

// Legacy getDb function (for backward compatibility)
// Now uses the exported getDb() function
async function getDbLegacy() {
  await ensureAuth()
  return db
}

// Test function: Write to database
export async function testWrite() {
  // STRICT: Only run in browser
  if (typeof window === 'undefined') {
    console.warn('[CloudBase] testWrite() called on server - CloudBase disabled on server')
    return { success: false, error: 'CloudBase can only run in browser' }
  }

  try {
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
    return { success: false, error: error.message || error }
  }
}

// Test function: Read from database
export async function testRead() {
  // STRICT: Only run in browser
  if (typeof window === 'undefined') {
    console.warn('[CloudBase] testRead() called on server - CloudBase disabled on server')
    return { success: false, error: 'CloudBase can only run in browser' }
  }

  try {
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
    return { success: false, error: error.message || error }
  }
}

// Generate unique pair ID
// Creates: tests/{pairId} document
// STRICT: Must only be called from client-side (browser)
export async function generatePairId() {
  // STRICT: Only run in browser
  if (typeof window === 'undefined') {
    console.warn('[CloudBase] generatePairId() called on server - CloudBase disabled on server')
    return { success: false, error: 'This function can only run in browser' }
  }

  try {
    // Ensure authentication before database operations
    await ensureAuth()
    
    const database = getDb()
    if (!database) {
      return { success: false, error: 'Database not available' }
    }
    
    // Generate a unique ID
    const pairId = `pair_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // CloudBase: use doc().set() to create document with custom ID
    // add() doesn't support custom _id, must use doc().set()
    await database.collection('tests').doc(pairId).set({
      createdAt: new Date().toISOString(),
    })
    
    console.log('[CloudBase] Generated pair ID:', pairId)
    return { success: true, pairId }
  } catch (error) {
    console.error('[CloudBase] Generate pair ID error:', error)
    return { success: false, error: error.message || error }
  }
}

// Save userA result to CloudBase
// Structure: tests/{pairId} document with { userA: {...} }
// STRICT: Must only be called from client-side (browser)
export async function saveUserA(pairId, userData) {
  // STRICT: Only run in browser
  if (typeof window === 'undefined') {
    console.warn('[CloudBase] saveUserA() called on server - CloudBase disabled on server')
    return { success: false, error: 'This function can only run in browser' }
  }

  try {
    // Ensure authentication before database operations
    await ensureAuth()
    
    const database = getDb()
    if (!database) {
      return { success: false, error: 'Database not available' }
    }
    
    console.log('[CloudBase] saveUserA - pairId:', pairId)
    console.log('[CloudBase] saveUserA - userData:', userData)
    
    // CloudBase: use doc().get() to check if document exists, then update or set
    try {
      // Try to get existing document
      const existing = await database.collection('tests')
        .doc(pairId)
        .get()
      
      if (existing.data) {
        // Update existing document
        await database.collection('tests')
          .doc(pairId)
          .update({
            userA: {
              ...userData,
              createdAt: new Date().toISOString(),
            }
          })
        console.log('[CloudBase] saveUserA - updated existing document')
      } else {
        // Create new document with doc().set()
        await database.collection('tests')
          .doc(pairId)
          .set({
            createdAt: new Date().toISOString(),
            userA: {
              ...userData,
              createdAt: new Date().toISOString(),
            }
          })
        console.log('[CloudBase] saveUserA - created new document')
      }
    } catch (error) {
      // Fallback: try direct set with doc()
      await database.collection('tests')
        .doc(pairId)
        .set({
          createdAt: new Date().toISOString(),
          userA: {
            ...userData,
            createdAt: new Date().toISOString(),
          }
        })
      console.log('[CloudBase] saveUserA - created new document (fallback)')
    }
    
    // Verify the save by reading back
    const verifyResult = await database.collection('tests')
      .doc(pairId)
      .get()
    console.log('[CloudBase] saveUserA - verification read:', verifyResult.data)
    
    console.log('[CloudBase] UserA saved successfully to tests/' + pairId)
    return { success: true, pairId }
  } catch (error) {
    console.error('Save userA error:', error)
    return { success: false, error: error.message || error }
  }
}

// Save userB result to CloudBase
// Structure: tests/{pairId} document with { userB: {...} }
// STRICT: Must only be called from client-side (browser)
export async function saveUserB(pairId, userData) {
  // STRICT: Only run in browser
  if (typeof window === 'undefined') {
    console.warn('[CloudBase] saveUserB() called on server - CloudBase disabled on server')
    return { success: false, error: 'This function can only run in browser' }
  }

  try {
    // Ensure authentication before database operations
    await ensureAuth()
    
    const database = getDb()
    if (!database) {
      return { success: false, error: 'Database not available' }
    }
    
    // CloudBase MongoDB-style: use doc() with _id to update
    await database.collection('tests')
      .doc(pairId)
      .update({
        userB: {
          ...userData,
          createdAt: new Date().toISOString(),
        }
      })
    
    console.log('[CloudBase] UserB saved successfully')
    return { success: true, pairId }
  } catch (error) {
    console.error('[CloudBase] Save userB error:', error)
    return { success: false, error: error.message || error }
  }
}

// Get test result from CloudBase (for backward compatibility)
// Structure: tests/{testId} document with { userA: {...} }
// STRICT: Must only be called from client-side (browser)
export async function getTestResult(testId) {
  // STRICT: Only run in browser
  if (typeof window === 'undefined') {
    console.warn('[CloudBase] getTestResult() called on server - CloudBase disabled on server')
    return { success: false, error: 'This function can only run in browser' }
  }

  try {
    // Ensure authentication before database operations
    await ensureAuth()
    
    const database = getDb()
    if (!database) {
      return { success: false, error: 'Database not available' }
    }
    
    // CloudBase: use doc().get() to get document by ID
    const result = await database.collection('tests')
      .doc(testId)
      .get()
    
    console.log('[CloudBase] getTestResult - testId:', testId)
    console.log('[CloudBase] getTestResult - result:', result)
    console.log('[CloudBase] getTestResult - result.data:', result.data)
    
    // CloudBase returns data in result.data as object (not array)
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
    return { success: false, error: error.message || error }
  }
}

// Get pair data (both userA and userB)
// Structure: tests/{pairId} document with { userA: {...}, userB: {...} }
// STRICT: Must only be called from client-side (browser)
export async function getPairData(pairId) {
  // STRICT: Only run in browser
  if (typeof window === 'undefined') {
    console.warn('[CloudBase] getPairData() called on server - CloudBase disabled on server')
    return { success: false, error: 'This function can only run in browser' }
  }

  try {
    // Ensure authentication before database operations
    await ensureAuth()
    
    const database = getDb()
    if (!database) {
      return { success: false, error: 'Database not available' }
    }
    
    // CloudBase: use doc().get() to get document by ID
    const result = await database.collection('tests')
      .doc(pairId)
      .get()
    
    console.log('[CloudBase] getPairData - pairId:', pairId)
    console.log('[CloudBase] getPairData - result:', result)
    console.log('[CloudBase] getPairData - result.data:', result.data)
    
    // CloudBase returns data as object (not array)
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
    return { success: false, error: error.message || error }
  }
}

// Export db for backward compatibility (if needed)
export { db }
