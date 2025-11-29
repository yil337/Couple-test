/**
 * 个人画像计算模块
 * 基于 1-23 题的答案计算个人爱情风格、依恋类型、动物类型等
 */

import { 
  QuestionId, 
  PersonalProfile, 
  LoveStyle, 
  Attachment, 
  LoveLanguage,
  AnimalType,
  SternbergDimension,
  GottmanCategory
} from '../types'
import { QUESTIONS } from '../questions'

/**
 * 动物矩阵映射：LoveStyle × Attachment -> AnimalType
 */
const ANIMAL_MATRIX: Record<LoveStyle, Record<Attachment, AnimalType>> = {
  PASSION: {
    SECURE: '海豚',
    AVOIDANT: '猫',
    ANXIOUS: '孔雀',
    FEARFUL: '刺猬'
  },
  GAME: {
    SECURE: '水獭',
    AVOIDANT: '狐狸',
    ANXIOUS: '浣熊',
    FEARFUL: '章鱼'
  },
  FRIENDSHIP: {
    SECURE: '金毛犬',
    AVOIDANT: '乌龟',
    ANXIOUS: '企鹅',
    FEARFUL: '雪貂'
  },
  PRAGMATIC: {
    SECURE: '犀牛',
    AVOIDANT: '猫头鹰',
    ANXIOUS: '海狸',
    FEARFUL: '鹿'
  },
  MANIA: {
    SECURE: '狼',
    AVOIDANT: '马',
    ANXIOUS: '天鹅',
    FEARFUL: '山猫'
  },
  AGAPE: {
    SECURE: '大象',
    AVOIDANT: '树懒',
    ANXIOUS: '仓鼠',
    FEARFUL: '雪兔'
  }
}

/**
 * 从得分对象中找到最高分的键（处理并列情况，随机选择）
 */
function argMaxWithTieBreak<T extends string>(
  scores: Record<T, number>
): T {
  const entries = Object.entries(scores) as [T, number][]
  const maxScore = Math.max(...entries.map(([_, score]) => score))
  
  // 找出所有并列最高分的项
  const ties = entries.filter(([_, score]) => score === maxScore)
  
  // 如果有并列，随机选择一个
  if (ties.length > 1) {
    const randomIndex = Math.floor(Math.random() * ties.length)
    return ties[randomIndex][0]
  }
  
  return ties[0][0]
}

/**
 * 计算个人画像
 * @param answers 答案记录，格式：{ Q1: 'A', Q2: 'B', ... }
 * @returns 个人画像结果
 */
export function computePersonalProfile(
  answers: Record<QuestionId, string>
): PersonalProfile {
  // 初始化得分累加器
  const lsScores: Record<LoveStyle, number> = {
    PASSION: 0,
    GAME: 0,
    FRIENDSHIP: 0,
    PRAGMATIC: 0,
    MANIA: 0,
    AGAPE: 0
  }
  
  const atScores: Record<Attachment, number> = {
    SECURE: 0,
    AVOIDANT: 0,
    ANXIOUS: 0,
    FEARFUL: 0
  }
  
  const llScores: Record<LoveLanguage, number> = {
    WORDS: 0,
    QUALITY_TIME: 0,
    ACTS: 0,
    PHYSICAL_HIGH: 0,
    PHYSICAL_LOW: 0
  }
  
  const sternbergVector = {
    intimacy: 0,
    passion: 0,
    commitment: 0
  }
  
  const gottmanVector: Record<GottmanCategory, number> = {
    HEALTHY: 0,
    CRITICISM: 0,
    DEFENSIVENESS: 0,
    STONEWALLING: 0,
    CONTEMPT: 0
  }
  
  // 遍历 Q1-Q23 题
  for (let i = 1; i <= 23; i++) {
    const questionId = `Q${i}` as QuestionId
    const question = QUESTIONS.find(q => q.id === questionId)
    
    if (!question) continue
    
    const selectedKey = answers[questionId]
    if (!selectedKey) continue
    
    // 找到对应的选项
    const selectedOption = question.options.find(opt => opt.key === selectedKey)
    if (!selectedOption) continue
    
    const mapping = selectedOption.mapping
    
    // 累加 Love Style 得分
    if (mapping.ls) {
      Object.entries(mapping.ls).forEach(([style, score]) => {
        const lsKey = style as LoveStyle
        if (lsScores.hasOwnProperty(lsKey)) {
          lsScores[lsKey] += score
        }
      })
    }
    
    // 累加 Attachment 得分
    if (mapping.at) {
      Object.entries(mapping.at).forEach(([attach, score]) => {
        const atKey = attach as Attachment
        if (atScores.hasOwnProperty(atKey)) {
          atScores[atKey] += score
        }
      })
    }
    
    // 累加 Love Language 得分
    if (mapping.ll) {
      Object.entries(mapping.ll).forEach(([lang, score]) => {
        const llKey = lang as LoveLanguage
        if (llScores.hasOwnProperty(llKey)) {
          llScores[llKey] += score
        }
      })
    }
    
    // 累加 Sternberg 维度得分
    if (mapping.st) {
      Object.entries(mapping.st).forEach(([dim, score]) => {
        const dimKey = dim as SternbergDimension
        if (dimKey === 'INTIMACY') {
          sternbergVector.intimacy += score
        } else if (dimKey === 'PASSION') {
          sternbergVector.passion += score
        } else if (dimKey === 'COMMITMENT') {
          sternbergVector.commitment += score
        }
      })
    }
    
    // 累加 Gottman 得分
    if (mapping.gm) {
      Object.entries(mapping.gm).forEach(([cat, score]) => {
        const gmKey = cat as GottmanCategory
        if (gottmanVector.hasOwnProperty(gmKey)) {
          gottmanVector[gmKey] += score
        }
      })
    }
  }
  
  // 计算主要类型（处理并列情况）
  const primaryLoveStyle = argMaxWithTieBreak(lsScores)
  const primaryAttachment = argMaxWithTieBreak(atScores)
  
  // 根据矩阵获取动物类型
  const animal = ANIMAL_MATRIX[primaryLoveStyle]?.[primaryAttachment] || '海豚'
  
  return {
    primaryLoveStyle,
    primaryAttachment,
    loveLanguageScores: llScores,
    animal,
    sternbergVector,
    gottmanVector,
    loveStyleScores: lsScores,
    attachmentScores: atScores
  }
}

