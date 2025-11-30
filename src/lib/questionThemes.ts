/**
 * 题目理论模型分类和颜色主题
 * 为每个题目分配轻微的颜色主题，用于选项卡片的视觉区分
 */

import { QuestionId, Question } from './types'
import { QUESTIONS } from './questions'

/**
 * 理论模型颜色主题配置
 */
export const THEME_COLORS = {
  LOVE_STYLE: {
    border: 'border-l-4 border-purple-200',
    bg: 'bg-purple-50',
    description: 'Lee爱情风格模型'
  },
  ATTACHMENT: {
    border: 'border-l-4 border-blue-200',
    bg: 'bg-blue-50',
    description: '成人依恋理论'
  },
  LOVE_LANGUAGE: {
    border: 'border-l-4 border-yellow-200',
    bg: 'bg-yellow-50',
    description: '五种爱的语言'
  },
  STERNBERG: {
    border: 'border-l-4 border-green-200',
    bg: 'bg-green-50',
    description: 'Sternberg三角理论'
  },
  GOTTMAN: {
    border: 'border-l-4 border-orange-200',
    bg: 'bg-orange-50',
    description: 'Gottman方法'
  },
  SOCIAL_EXCHANGE: {
    border: 'border-l-4 border-indigo-200',
    bg: 'bg-indigo-50',
    description: '社会交换理论'
  },
  MIXED: {
    border: 'border-l-4 border-gray-200',
    bg: 'bg-gray-50',
    description: '混合模型'
  }
}

/**
 * 判断题目主要属于哪个理论模型
 * 根据选项映射中哪个维度出现频率最高
 */
export function getQuestionTheme(questionId: QuestionId): typeof THEME_COLORS[keyof typeof THEME_COLORS] {
  const question = QUESTIONS.find(q => q.id === questionId)
  if (!question) return THEME_COLORS.MIXED

  // Q24-Q26 属于 Social Exchange Theory
  if (questionId === 'Q24' || questionId === 'Q25' || questionId === 'Q26') {
    return THEME_COLORS.SOCIAL_EXCHANGE
  }

  // 统计所有选项中各维度的出现频率
  const dimensionCounts = {
    ls: 0,  // Love Style
    at: 0,  // Attachment
    ll: 0,  // Love Language
    st: 0,  // Sternberg
    gm: 0   // Gottman
  }

  question.options.forEach(option => {
    if (option.mapping.ls) dimensionCounts.ls++
    if (option.mapping.at) dimensionCounts.at++
    if (option.mapping.ll) dimensionCounts.ll++
    if (option.mapping.st) dimensionCounts.st++
    if (option.mapping.gm) dimensionCounts.gm++
  })

  // 找出出现频率最高的维度
  const maxCount = Math.max(...Object.values(dimensionCounts))
  
  // 如果所有维度都出现，或者没有明显的主要维度，返回混合
  if (maxCount === 0 || Object.values(dimensionCounts).filter(c => c === maxCount).length > 1) {
    return THEME_COLORS.MIXED
  }

  // 根据主要维度返回对应主题
  if (dimensionCounts.ls === maxCount) return THEME_COLORS.LOVE_STYLE
  if (dimensionCounts.at === maxCount) return THEME_COLORS.ATTACHMENT
  if (dimensionCounts.ll === maxCount) return THEME_COLORS.LOVE_LANGUAGE
  if (dimensionCounts.st === maxCount) return THEME_COLORS.STERNBERG
  if (dimensionCounts.gm === maxCount) return THEME_COLORS.GOTTMAN

  return THEME_COLORS.MIXED
}

/**
 * 获取题目的颜色主题类名（用于选项卡片）
 */
export function getQuestionThemeClass(questionId: QuestionId): string {
  const theme = getQuestionTheme(questionId)
  // 只返回边框颜色，非常轻微
  return theme.border
}


