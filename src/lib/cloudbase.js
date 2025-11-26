import cloudbase from '@cloudbase/js-sdk'

// Initialize CloudBase
let app
let db
let auth
let isInitialized = false
let isAuthenticated = false

// Initialize CloudBase and ensure anonymous login
// Only initialize on client side (browser)
async function initCloudBase() {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    throw new Error('CloudBase can only be initialized in browser environment')
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
      console.log('CloudBase anonymous login successful')
    } catch (authError) {
      console.error('Anonymous login error:', authError)
      // Try to get current user
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new Error('Failed to authenticate with CloudBase')
      }
      isAuthenticated = true
    }

    isInitialized = true
    console.log('CloudBase initialized successfully')
    return { app, db, auth }
  } catch (error) {
    console.error('CloudBase initialization error:', error)
    throw error
  }
}

// Ensure authentication before database operations
async function ensureAuth() {
  // Only run in browser
  if (typeof window === 'undefined') {
    throw new Error('Database operations can only run in browser environment')
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

// Get database instance (ensures auth first)
async function getDb() {
  await ensureAuth()
  return db
}

// Test function: Write to database
export async function testWrite() {
  try {
    const database = await getDb()
    const docId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    await database.collection('test').doc(docId).set({
      hello: 'world',
      timestamp: new Date().toISOString(),
    })
    console.log('Test write successful')
    return { success: true }
  } catch (error) {
    console.error('Test write error:', error)
    return { success: false, error: error.message || error }
  }
}

// Test function: Read from database
export async function testRead() {
  try {
    const database = await getDb()
    const result = await database.collection('test').get()
    const docs = result.data.map((doc) => ({
      id: doc._id,
      ...doc
    }))
    console.log('Test read successful:', docs)
    return { success: true, data: docs }
  } catch (error) {
    console.error('Test read error:', error)
    return { success: false, error: error.message || error }
  }
}

// Generate unique pair ID
// Creates: tests/{pairId} document
export async function generatePairId() {
  // Only run in browser
  if (typeof window === 'undefined') {
    return { success: false, error: 'This function can only run in browser' }
  }

  try {
    const database = await getDb()
    
    // Generate a unique ID
    const pairId = `pair_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // CloudBase MongoDB-style: use add() or insert with _id
    await database.collection('tests').add({
      _id: pairId,
      createdAt: new Date().toISOString(),
    })
    
    return { success: true, pairId }
  } catch (error) {
    console.error('[CloudBase] Generate pair ID error:', error)
    return { success: false, error: error.message || error }
  }
}

// Save userA result to CloudBase
// Structure: tests/{pairId} document with { userA: {...} }
export async function saveUserA(pairId, userData) {
  // Only run in browser
  if (typeof window === 'undefined') {
    return { success: false, error: 'This function can only run in browser' }
  }

  try {
    const database = await getDb()
    
    console.log('[CloudBase] saveUserA - pairId:', pairId)
    console.log('[CloudBase] saveUserA - userData:', userData)
    
    // CloudBase MongoDB-style: use where() to find, then update or add
    try {
      // Try to find existing document
      const existing = await database.collection('tests')
        .where({ _id: pairId })
        .get()
      
      if (existing.data && existing.data.length > 0) {
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
        // Create new document
        await database.collection('tests').add({
          _id: pairId,
          createdAt: new Date().toISOString(),
          userA: {
            ...userData,
            createdAt: new Date().toISOString(),
          }
        })
        console.log('[CloudBase] saveUserA - created new document')
      }
    } catch (error) {
      // Fallback: try direct add with _id
      await database.collection('tests').add({
        _id: pairId,
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
      .where({ _id: pairId })
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
export async function saveUserB(pairId, userData) {
  // Only run in browser
  if (typeof window === 'undefined') {
    return { success: false, error: 'This function can only run in browser' }
  }

  try {
    const database = await getDb()
    
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
export async function getTestResult(testId) {
  // Only run in browser
  if (typeof window === 'undefined') {
    return { success: false, error: 'This function can only run in browser' }
  }

  try {
    const database = await getDb()
    
    // CloudBase MongoDB-style API: use where() to query by _id
    // CloudBase doesn't have doc() method, use where() instead
    const result = await database.collection('tests')
      .where({
        _id: testId
      })
      .get()
    
    console.log('[CloudBase] getTestResult - testId:', testId)
    console.log('[CloudBase] getTestResult - result:', result)
    console.log('[CloudBase] getTestResult - result.data:', result.data)
    
    // CloudBase returns data in result.data as an array
    if (result.data && Array.isArray(result.data) && result.data.length > 0) {
      const docData = result.data[0]
      
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
export async function getPairData(pairId) {
  // Only run in browser
  if (typeof window === 'undefined') {
    return { success: false, error: 'This function can only run in browser' }
  }

  try {
    const database = await getDb()
    
    // CloudBase MongoDB-style: use where() to query by _id
    const result = await database.collection('tests')
      .where({ _id: pairId })
      .get()
    
    console.log('[CloudBase] getPairData - pairId:', pairId)
    console.log('[CloudBase] getPairData - result:', result)
    console.log('[CloudBase] getPairData - result.data:', result.data)
    
    // CloudBase returns data as an array
    if (result.data && Array.isArray(result.data) && result.data.length > 0) {
      const pairDoc = result.data[0]
      
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
