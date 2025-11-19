import { ANIMAL_MAP } from './types'

/**
 * Calculate match score between two users
 * @param {string} aKey - userA resultKey (e.g., "P-X")
 * @param {string} bKey - userB resultKey (e.g., "G-S")
 * @returns {Object} Match result with score, animals, and analysis
 */
export function calculateMatch(aKey, bKey) {
  if (!aKey || !bKey) {
    return null
  }

  const [aStyle, aAttach] = aKey.split('-')
  const [bStyle, bAttach] = bKey.split('-')

  // Calculate LoveStyle score
  const styleOrder = ['P', 'G', 'F', 'U', 'C', 'A']
  const aStyleIndex = styleOrder.indexOf(aStyle)
  const bStyleIndex = styleOrder.indexOf(bStyle)

  let styleScore = 0
  if (aStyle === bStyle) {
    styleScore = 20
  } else {
    const diff = Math.abs(aStyleIndex - bStyleIndex)
    if (diff === 1) {
      // Adjacent
      styleScore = 10
    } else {
      // Distant
      styleScore = 5
    }
  }

  // Calculate Attachment score
  let attachScore = 0
  if (aAttach === 'S' && bAttach === 'S') {
    attachScore = 30
  } else if (
    (aAttach === 'S' && (bAttach === 'A' || bAttach === 'X')) ||
    (bAttach === 'S' && (aAttach === 'A' || aAttach === 'X'))
  ) {
    attachScore = 25
  } else if (
    (aAttach === 'S' && bAttach === 'F') ||
    (bAttach === 'S' && aAttach === 'F')
  ) {
    attachScore = 20
  } else if (
    (aAttach === 'A' && bAttach === 'X') ||
    (aAttach === 'X' && bAttach === 'A')
  ) {
    attachScore = 15
  } else if (
    (aAttach === 'X' && bAttach === 'F') ||
    (aAttach === 'F' && bAttach === 'X')
  ) {
    attachScore = 10
  } else if (
    (aAttach === 'A' && bAttach === 'F') ||
    (aAttach === 'F' && bAttach === 'A')
  ) {
    attachScore = 5
  } else {
    attachScore = 5
  }

  // Final score (cap at 96%)
  const finalScore = Math.min(styleScore + attachScore, 96)

  // Get animals
  const animalA = ANIMAL_MAP[aKey] || '未知'
  const animalB = ANIMAL_MAP[bKey] || '未知'

  // Generate CP name
  const cpName = `${animalA} × ${animalB}`

  // Generate nickname
  let nickname = ''
  if (aStyle === bStyle) {
    nickname = '同族共鸣'
  } else if (Math.abs(aStyleIndex - bStyleIndex) === 1) {
    nickname = '互补流动'
  } else {
    nickname = '异质张力'
  }

  return {
    score: finalScore,
    animalA,
    animalB,
    cpName,
    nickname,
    styleScore,
    attachScore,
  }
}

/**
 * Generate relationship dynamics text
 */
export function getDynamics(aKey, bKey) {
  return `你们的关系核心动力来自 ${aKey} 与 ${bKey} 的交互。`
}

/**
 * Generate strengths list
 */
export function getStrengths(aAttach, bAttach) {
  return [
    '在关键场景中能形成互补',
    '双方的投入方式具有可协调性',
    '存在自然的吸引或稳定力量'
  ]
}

/**
 * Generate risks list
 */
export function getRisks(aAttach, bAttach) {
  return [
    '在压力下可能触发回避-焦虑循环',
    '双方情绪节奏不同可能造成误解'
  ]
}

/**
 * Generate advice list
 */
export function getAdvice(aAttach, bAttach) {
  return [
    '建立情绪银行：增加高质量的正向互动',
    '减少 Gottman 四骑士行为（批评、防御、轻蔑、冷战）',
    '使用 Social Exchange 视角检视双方资源交换是否平衡'
  ]
}

