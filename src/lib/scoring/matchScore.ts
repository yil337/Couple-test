/**
 * 情侣匹配度计算模块
 * 综合 Sternberg、Gottman、Social Exchange、动物爱情四个维度
 */

import { 
  FullProfile, 
  MatchScoreDetail, 
  MatchResult,
  SternbergType,
  GottmanType,
  AnimalType
} from '../types'
import { classifySternberg, classifyGottman } from './relationshipTypes'

/**
 * Sternberg 七类型匹配矩阵（7×7）
 * 数值来自 PDF 中的匹配度表格，已转换为 0-1 范围
 */
const STERNBERG_MATCH_MATRIX: Record<SternbergType, Record<SternbergType, number>> = {
  LIKING: {
    LIKING: 0.95,
    INFATUATION: 0.55,
    EMPTY: 0.60,
    ROMANTIC: 0.80,
    COMPANIONATE: 0.90,
    FOOLISH: 0.70,
    CONSUMMATE: 0.85
  },
  INFATUATION: {
    LIKING: 0.55,
    INFATUATION: 0.95,
    EMPTY: 0.45,
    ROMANTIC: 0.90,
    COMPANIONATE: 0.65,
    FOOLISH: 0.85,
    CONSUMMATE: 0.80
  },
  EMPTY: {
    LIKING: 0.60,
    INFATUATION: 0.45,
    EMPTY: 0.95,
    ROMANTIC: 0.65,
    COMPANIONATE: 0.85,
    FOOLISH: 0.90,
    CONSUMMATE: 0.75
  },
  ROMANTIC: {
    LIKING: 0.80,
    INFATUATION: 0.90,
    EMPTY: 0.65,
    ROMANTIC: 0.95,
    COMPANIONATE: 0.85,
    FOOLISH: 0.80,
    CONSUMMATE: 0.90
  },
  COMPANIONATE: {
    LIKING: 0.90,
    INFATUATION: 0.65,
    EMPTY: 0.85,
    ROMANTIC: 0.85,
    COMPANIONATE: 0.95,
    FOOLISH: 0.75,
    CONSUMMATE: 0.90
  },
  FOOLISH: {
    LIKING: 0.70,
    INFATUATION: 0.85,
    EMPTY: 0.90,
    ROMANTIC: 0.80,
    COMPANIONATE: 0.75,
    FOOLISH: 0.95,
    CONSUMMATE: 0.85
  },
  CONSUMMATE: {
    LIKING: 0.85,
    INFATUATION: 0.80,
    EMPTY: 0.75,
    ROMANTIC: 0.90,
    COMPANIONATE: 0.90,
    FOOLISH: 0.85,
    CONSUMMATE: 1.00
  }
}

/**
 * Gottman 五类型匹配矩阵（5×5）
 * 数值来自 PDF 中的匹配度表格，已转换为 0-1 范围
 */
const GOTTMAN_MATCH_MATRIX: Record<GottmanType, Record<GottmanType, number>> = {
  NONE: {
    NONE: 1.00,
    CRITICISM: 0.85,
    DEFENSIVENESS: 0.80,
    STONEWALLING: 0.75,
    CONTEMPT: 0.60
  },
  CRITICISM: {
    NONE: 0.85,
    CRITICISM: 0.80,
    DEFENSIVENESS: 0.70,
    STONEWALLING: 0.65,
    CONTEMPT: 0.55
  },
  DEFENSIVENESS: {
    NONE: 0.80,
    CRITICISM: 0.70,
    DEFENSIVENESS: 0.75,
    STONEWALLING: 0.65,
    CONTEMPT: 0.50
  },
  STONEWALLING: {
    NONE: 0.75,
    CRITICISM: 0.65,
    DEFENSIVENESS: 0.65,
    STONEWALLING: 0.70,
    CONTEMPT: 0.45
  },
  CONTEMPT: {
    NONE: 0.60,
    CRITICISM: 0.55,
    DEFENSIVENESS: 0.50,
    STONEWALLING: 0.45,
    CONTEMPT: 0.40
  }
}

/**
 * 动物到 Sternberg 类型的映射
 * 根据 PDF 中的动物与爱情七类型对应关系
 */
const ANIMAL_TO_STERNBERG_TYPE: Record<AnimalType, SternbergType> = {
  // 喜欢（亲密）
  '乌龟': 'LIKING',
  '树懒': 'LIKING',
  '雪兔': 'LIKING',
  
  // 迷恋（激情）
  '刺猬': 'INFATUATION',
  '猫': 'INFATUATION',
  '马': 'INFATUATION',
  '山猫': 'INFATUATION',
  
  // 空洞（承诺）
  '雪貂': 'EMPTY',
  '猫头鹰': 'EMPTY',
  '鹿': 'EMPTY',
  
  // 浪漫（亲密/激情）
  '孔雀': 'ROMANTIC',
  '企鹅': 'ROMANTIC',
  '天鹅': 'ROMANTIC',
  '浣熊': 'ROMANTIC',
  '水獭': 'ROMANTIC',
  
  // 伙伴（亲密/承诺）
  '金毛犬': 'COMPANIONATE',
  '犀牛': 'COMPANIONATE',
  '仓鼠': 'COMPANIONATE',
  
  // 愚昧（激情/承诺）
  '海狸': 'FOOLISH',
  '狼': 'FOOLISH',
  
  // 完全（亲密/激情/承诺）
  '海豚': 'CONSUMMATE',
  '大象': 'CONSUMMATE',
  '狐狸': 'CONSUMMATE',
  '章鱼': 'CONSUMMATE'
}

/**
 * 计算 Social Exchange 匹配度
 * @param userA Social Exchange 答案
 * @param userB Social Exchange 答案
 * @returns 0-1 范围的匹配度
 */
function computeSocialExchangeScore(
  userA: { q24: number; q25: number; q26: number },
  userB: { q24: number; q25: number; q26: number }
): number {
  // Q24: 谁更投入（1-5）
  // 差异越大，匹配度越低
  const q24Diff = Math.abs(userA.q24 - userB.q24)
  const q24Score = 1 - (q24Diff / 4) // 最大差异是4，归一化到0-1
  
  // Q25: 关系是否对等（1-5）
  // 差异越大，匹配度越低
  const q25Diff = Math.abs(userA.q25 - userB.q25)
  const q25Score = 1 - (q25Diff / 4)
  
  // Q26: 满意度（1-5）
  // 高满意度 = 高匹配的加分项
  // 取双方满意度的平均值，归一化到0-1
  const avgSatisfaction = (userA.q26 + userB.q26) / 2
  const q26Score = (avgSatisfaction - 1) / 4 // 1->0, 5->1
  
  // 关系感知差异越大 = 匹配度越低
  const perceptionDiff = (q24Diff + q25Diff) / 2
  const perceptionScore = 1 - (perceptionDiff / 4)
  
  // 综合计算：满意度权重更高，感知差异权重较低
  const totalScore = (q26Score * 0.6) + (perceptionScore * 0.4)
  
  return Math.max(0, Math.min(1, totalScore))
}

/**
 * 计算匹配度
 * @param userA 用户A的完整画像
 * @param userB 用户B的完整画像
 * @returns 匹配度详细结果
 */
export function computeMatchScore(
  userA: FullProfile,
  userB: FullProfile
): MatchResult {
  // 1. 分类 Sternberg 和 Gottman 类型
  const sternbergTypeA = classifySternberg(userA.sternbergVector)
  const sternbergTypeB = classifySternberg(userB.sternbergVector)
  const gottmanTypeA = classifyGottman(userA.gottmanVector)
  const gottmanTypeB = classifyGottman(userB.gottmanVector)
  
  // 2. 计算 Sternberg 匹配度
  const sternbergRaw = STERNBERG_MATCH_MATRIX[sternbergTypeA][sternbergTypeB]
  const W_STERNBERG = 30
  const sternbergContribution = sternbergRaw * W_STERNBERG
  
  // 3. 计算 Gottman 匹配度
  const gottmanRaw = GOTTMAN_MATCH_MATRIX[gottmanTypeA][gottmanTypeB]
  const W_GOTTMAN = 30
  const gottmanContribution = gottmanRaw * W_GOTTMAN
  
  // 4. 计算 Social Exchange 匹配度
  const socialRaw = computeSocialExchangeScore(userA.socialExchange, userB.socialExchange)
  const W_SOCIAL = 25
  const socialContribution = socialRaw * W_SOCIAL
  
  // 5. 计算动物爱情匹配度
  // 将动物映射到 Sternberg 类型，再用 7×7 矩阵计算
  const animalSternbergTypeA = ANIMAL_TO_STERNBERG_TYPE[userA.animal] || 'LIKING'
  const animalSternbergTypeB = ANIMAL_TO_STERNBERG_TYPE[userB.animal] || 'LIKING'
  const animalRaw = STERNBERG_MATCH_MATRIX[animalSternbergTypeA][animalSternbergTypeB]
  const W_ANIMAL = 15
  const animalContribution = animalRaw * W_ANIMAL
  
  // 6. 计算总匹配度
  const total = sternbergContribution + gottmanContribution + socialContribution + animalContribution
  
  // 7. 生成 CP 名称和昵称
  const cpName = `${userA.animal} × ${userB.animal}`
  
  // 根据匹配度生成昵称
  let nickname = ''
  if (total >= 90) {
    nickname = '完美契合'
  } else if (total >= 80) {
    nickname = '高度匹配'
  } else if (total >= 70) {
    nickname = '良好匹配'
  } else if (total >= 60) {
    nickname = '中等匹配'
  } else {
    nickname = '需要磨合'
  }
  
  return {
    sternberg: {
      raw: sternbergRaw,
      weight: W_STERNBERG,
      contribution: sternbergContribution
    },
    gottman: {
      raw: gottmanRaw,
      weight: W_GOTTMAN,
      contribution: gottmanContribution
    },
    socialExchange: {
      raw: socialRaw,
      weight: W_SOCIAL,
      contribution: socialContribution
    },
    animalLove: {
      raw: animalRaw,
      weight: W_ANIMAL,
      contribution: animalContribution
    },
    total: Math.round(total * 100) / 100, // 保留两位小数
    animalA: userA.animal,
    animalB: userB.animal,
    cpName,
    nickname,
    sternbergTypeA,
    sternbergTypeB,
    gottmanTypeA,
    gottmanTypeB
  }
}

