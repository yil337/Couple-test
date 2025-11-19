import { TYPE_MAP } from './types'

/**
 * Calculate user's personality type based on answers
 * @param {Array} answers - Array of selected options from questions
 * @returns {Object} { typeKey, typeName, typeDesc, styleScores, attachScores }
 */
export function calculateType(answers) {
  // Initialize score counters
  const styleScores = {
    P: 0, // Passion
    G: 0, // Playful
    F: 0, // Friendship
    U: 0, // Pragmatic
    C: 0, // Mania
    A: 0  // Altruistic
  }

  const attachScores = {
    S: 0, // Secure
    A: 0, // Avoidant
    X: 0, // Anxious
    F: 0  // Fearful
  }

  // Count scores from answers
  answers.forEach(answer => {
    if (answer && answer.style) {
      styleScores[answer.style] = (styleScores[answer.style] || 0) + 1
    }
    if (answer && answer.attach) {
      attachScores[answer.attach] = (attachScores[answer.attach] || 0) + 1
    }
  })

  // Find highest scoring style
  const highestStyle = Object.keys(styleScores).reduce((a, b) => 
    styleScores[a] > styleScores[b] ? a : b
  )

  // Find highest scoring attachment
  const highestAttach = Object.keys(attachScores).reduce((a, b) => 
    attachScores[a] > attachScores[b] ? a : b
  )

  // Build type key (e.g., "P-X")
  const typeKey = `${highestStyle}-${highestAttach}`

  // Get type info from TYPE_MAP
  const typeInfo = TYPE_MAP[typeKey] || { 
    name: "未知型", 
    desc: "无法确定类型" 
  }

  return {
    typeKey,
    typeName: typeInfo.name,
    typeDesc: typeInfo.desc,
    styleScores,
    attachScores
  }
}

