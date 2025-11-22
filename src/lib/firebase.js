import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Validate environment variables
const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0 && typeof window !== 'undefined') {
  console.error('Missing Firebase environment variables:', missingVars)
}

const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey,
  authDomain: requiredEnvVars.authDomain,
  projectId: requiredEnvVars.projectId,
  storageBucket: requiredEnvVars.storageBucket,
  messagingSenderId: requiredEnvVars.messagingSenderId,
  appId: requiredEnvVars.appId,
}

// Initialize Firebase
let app
let db

try {
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
} catch (error) {
  console.error('Firebase initialization error:', error)
  if (typeof window !== 'undefined') {
    console.error('Firebase config:', {
      apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing',
      authDomain: firebaseConfig.authDomain ? 'Set' : 'Missing',
      projectId: firebaseConfig.projectId ? 'Set' : 'Missing',
      storageBucket: firebaseConfig.storageBucket ? 'Set' : 'Missing',
      messagingSenderId: firebaseConfig.messagingSenderId ? 'Set' : 'Missing',
      appId: firebaseConfig.appId ? 'Set' : 'Missing',
    })
  }
  throw error
}

export { db }

// Test function: Write to Firestore
export async function testWrite() {
  const { collection, doc, setDoc } = await import('firebase/firestore')
  try {
    await setDoc(doc(collection(db, 'test')), {
      hello: 'world',
      timestamp: new Date().toISOString(),
    })
    console.log('Test write successful')
    return { success: true }
  } catch (error) {
    console.error('Test write error:', error)
    return { success: false, error }
  }
}

// Test function: Read from Firestore
export async function testRead() {
  const { collection, getDocs } = await import('firebase/firestore')
  try {
    const querySnapshot = await getDocs(collection(db, 'test'))
    const docs = []
    querySnapshot.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() })
    })
    console.log('Test read successful:', docs)
    return { success: true, data: docs }
  } catch (error) {
    console.error('Test read error:', error)
    return { success: false, error }
  }
}

// Generate unique pair ID
export async function generatePairId() {
  const { collection, doc, setDoc, serverTimestamp } = await import('firebase/firestore')
  try {
    const pairRef = doc(collection(db, 'tests'))
    const pairId = pairRef.id
    // Initialize the test document
    await setDoc(pairRef, {
      createdAt: serverTimestamp(),
    })
    return { success: true, pairId }
  } catch (error) {
    console.error('Generate pair ID error:', error)
    return { success: false, error }
  }
}

// Save userA result to Firestore
// Path: tests/{pairId}/userA/{autoId} (4 segments - valid document path)
// Using subcollection with auto-generated document ID
export async function saveUserA(pairId, userData) {
  const { collection, doc, setDoc, serverTimestamp } = await import('firebase/firestore')
  try {
    // Create document reference in subcollection with auto-generated ID
    const userARef = doc(collection(db, 'tests', pairId, 'userA'))
    await setDoc(userARef, {
      ...userData,
      createdAt: serverTimestamp(),
    })
    console.log('UserA saved successfully with ID:', userARef.id)
    return { success: true, pairId, docId: userARef.id }
  } catch (error) {
    console.error('Save userA error:', error)
    return { success: false, error }
  }
}

// Save userB result to Firestore
// Path: tests/{pairId}/userB/{autoId} (4 segments - valid document path)
// Using subcollection with auto-generated document ID
export async function saveUserB(pairId, userData) {
  const { collection, doc, setDoc, serverTimestamp } = await import('firebase/firestore')
  try {
    // Create document reference in subcollection with auto-generated ID
    const userBRef = doc(collection(db, 'tests', pairId, 'userB'))
    await setDoc(userBRef, {
      ...userData,
      createdAt: serverTimestamp(),
    })
    console.log('UserB saved successfully with ID:', userBRef.id)
    return { success: true, pairId, docId: userBRef.id }
  } catch (error) {
    console.error('Save userB error:', error)
    return { success: false, error }
  }
}

// Get test result from Firestore (for backward compatibility)
// Path: tests/{testId}/userA/{autoId} - query subcollection to get latest document
export async function getTestResult(testId) {
  const { collection, getDocs, query, orderBy, limit } = await import('firebase/firestore')
  try {
    // Query the userA subcollection to get the latest document
    const userACollection = collection(db, 'tests', testId, 'userA')
    const q = query(userACollection, orderBy('createdAt', 'desc'), limit(1))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return { success: true, data: doc.data() }
    } else {
      return { success: false, error: 'Document not found' }
    }
  } catch (error) {
    console.error('Get test result error:', error)
    return { success: false, error }
  }
}

// Get pair data (both userA and userB)
// Path: tests/{pairId}/userA/{autoId} and tests/{pairId}/userB/{autoId}
// Query subcollections to get latest documents
export async function getPairData(pairId) {
  const { collection, getDocs, query, orderBy, limit } = await import('firebase/firestore')
  try {
    // Query both subcollections to get the latest documents
    const userACollection = collection(db, 'tests', pairId, 'userA')
    const userBCollection = collection(db, 'tests', pairId, 'userB')
    
    const [userAQuery, userBQuery] = await Promise.all([
      getDocs(query(userACollection, orderBy('createdAt', 'desc'), limit(1))),
      getDocs(query(userBCollection, orderBy('createdAt', 'desc'), limit(1)))
    ])

    const result = {
      userA: !userAQuery.empty ? userAQuery.docs[0].data() : null,
      userB: !userBQuery.empty ? userBQuery.docs[0].data() : null,
    }

    if (!result.userA && !result.userB) {
      return { success: false, error: 'Pair not found' }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error('Get pair data error:', error)
    return { success: false, error }
  }
}

