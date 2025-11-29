/**
 * Sternberg 和 Gottman 类型归类模块
 */

import { SternbergType, GottmanType, GottmanCategory } from '../types'

/**
 * 将 Sternberg 三维向量归一化并分类为 7 种类型
 * @param v Sternberg 向量 { intimacy, passion, commitment }
 * @returns Sternberg 类型
 */
export function classifySternberg(v: {
  intimacy: number
  passion: number
  commitment: number
}): SternbergType {
  // 归一化到 [0, 1]
  const max = Math.max(v.intimacy, v.passion, v.commitment, 1)
  const i = v.intimacy / max
  const p = v.passion / max
  const c = v.commitment / max
  
  // 阈值：如果得分 > 0.5，则认为该维度存在
  const hasIntimacy = i > 0.5
  const hasPassion = p > 0.5
  const hasCommitment = c > 0.5
  
  // 根据 Sternberg 三角理论分类
  if (hasIntimacy && hasPassion && hasCommitment) {
    return 'CONSUMMATE'  // 完全：亲密/激情/承诺
  } else if (hasIntimacy && hasPassion && !hasCommitment) {
    return 'ROMANTIC'    // 浪漫：亲密/激情
  } else if (hasIntimacy && !hasPassion && hasCommitment) {
    return 'COMPANIONATE' // 伙伴：亲密/承诺
  } else if (!hasIntimacy && hasPassion && hasCommitment) {
    return 'FOOLISH'     // 愚昧：激情/承诺
  } else if (hasIntimacy && !hasPassion && !hasCommitment) {
    return 'LIKING'      // 喜欢：亲密
  } else if (!hasIntimacy && hasPassion && !hasCommitment) {
    return 'INFATUATION' // 迷恋：激情
  } else if (!hasIntimacy && !hasPassion && hasCommitment) {
    return 'EMPTY'       // 空洞：承诺
  } else {
    // 如果都没有，选择得分最高的维度
    if (i >= p && i >= c) return 'LIKING'
    if (p >= i && p >= c) return 'INFATUATION'
    return 'EMPTY'
  }
}

/**
 * 将 Gottman 向量分类为 5 种类型
 * @param v Gottman 向量
 * @returns Gottman 类型
 */
export function classifyGottman(v: Record<GottmanCategory, number>): GottmanType {
  // 找出得分最高的类别（排除 HEALTHY）
  const categories: GottmanCategory[] = ['CRITICISM', 'DEFENSIVENESS', 'STONEWALLING', 'CONTEMPT']
  const scores = categories.map(cat => ({ cat, score: v[cat] }))
  scores.sort((a, b) => b.score - a.score)
  
  // 如果所有"四骑士"得分都低于阈值，返回 NONE（健康）
  const threshold = 0.3
  if (scores[0].score < threshold) {
    return 'NONE'
  }
  
  // 返回得分最高的类别
  return scores[0].cat as GottmanType
}

