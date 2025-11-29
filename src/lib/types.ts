/**
 * 爱情模型类型定义
 * 基于六大心理学理论模型：
 * 1. Lee's Love Style（爱情风格模型）
 * 2. Adult Attachment Theory（成人依恋理论）
 * 3. Five Love Languages（五种爱的语言）
 * 4. Sternberg's Triangular Theory（爱情三角理论）
 * 5. Gottman Method（戈特曼方法）
 * 6. Social Exchange Theory（社会交换理论）
 */

// ==================== 基础类型 ====================

/**
 * Lee's Love Style - 爱情风格
 */
export type LoveStyle = 
  | 'PASSION'      // 激情型 (Passion)
  | 'GAME'         // 游戏型 (Ludus/Game)
  | 'FRIENDSHIP'   // 友谊型 (Storge/Friendship)
  | 'PRAGMATIC'    // 实用型 (Pragma/Pragmatic)
  | 'MANIA'        // 痴狂型 (Mania)
  | 'AGAPE'        // 利他型 (Agape)

/**
 * Adult Attachment Theory - 成人依恋类型
 */
export type Attachment = 
  | 'SECURE'       // 安全型
  | 'AVOIDANT'     // 回避型
  | 'ANXIOUS'      // 焦虑型
  | 'FEARFUL'      // 恐惧型

/**
 * Love Language - 爱的语言
 */
export type LoveLanguage = 
  | 'WORDS'              // 肯定的言辞
  | 'QUALITY_TIME'       // 精心的时刻
  | 'ACTS'               // 服务的行动
  | 'PHYSICAL_HIGH'      // 身体的接触（高）
  | 'PHYSICAL_LOW'       // 身体的接触（低）

/**
 * Sternberg 三角理论类型
 */
export type SternbergType =
  | 'LIKING'           // 喜欢：亲密
  | 'INFATUATION'      // 迷恋：激情
  | 'EMPTY'            // 空洞：承诺
  | 'ROMANTIC'         // 浪漫：亲密/激情
  | 'COMPANIONATE'     // 伙伴：亲密/承诺
  | 'FOOLISH'          // 愚昧：激情/承诺
  | 'CONSUMMATE'       // 完全：亲密/激情/承诺

/**
 * Gottman 四骑士类型
 */
export type GottmanType =
  | 'NONE'             // 无（健康）
  | 'CRITICISM'        // 批评
  | 'DEFENSIVENESS'    // 防御
  | 'STONEWALLING'     // 冷战
  | 'CONTEMPT'         // 轻蔑

/**
 * Gottman 类别（用于向量计算）
 */
export type GottmanCategory = 
  | 'HEALTHY'          // 健康
  | 'CRITICISM'        // 批评
  | 'DEFENSIVENESS'    // 防御
  | 'STONEWALLING'     // 冷战
  | 'CONTEMPT'         // 轻蔑

/**
 * Sternberg 三角维度
 */
export type SternbergDimension = 
  | 'INTIMACY'         // 亲密
  | 'PASSION'          // 激情
  | 'COMMITMENT'       // 承诺

/**
 * 24 种动物类型
 */
export type AnimalType =
  | '海豚' | '刺猬' | '猫' | '孔雀' | '金毛犬' | '犀牛' | '海狸' | '狼' | '大象'
  | '树懒' | '雪兔' | '乌龟' | '雪貂' | '猫头鹰' | '鹿' | '马' | '山猫'
  | '水獭' | '狐狸' | '浣熊' | '章鱼' | '企鹅' | '仓鼠' | '天鹅'

// ==================== 问卷相关类型 ====================

/**
 * 问题 ID (Q1-Q26)
 */
export type QuestionId = 
  | 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Q5' | 'Q6' | 'Q7' | 'Q8' | 'Q9' | 'Q10'
  | 'Q11' | 'Q12' | 'Q13' | 'Q14' | 'Q15' | 'Q16' | 'Q17' | 'Q18' | 'Q19' | 'Q20'
  | 'Q21' | 'Q22' | 'Q23' | 'Q24' | 'Q25' | 'Q26'

/**
 * 选项映射配置
 * 每个选项可以映射到多个维度，支持权重分配
 */
export interface OptionMapping {
  /** Love Style 映射（支持权重，如 { PASSION: 0.7, GAME: 0.3 }） */
  ls?: Partial<Record<LoveStyle, number>>
  
  /** Attachment 映射 */
  at?: Partial<Record<Attachment, number>>
  
  /** Love Language 映射 */
  ll?: Partial<Record<LoveLanguage, number>>
  
  /** Sternberg 三角维度映射 */
  st?: Partial<Record<SternbergDimension, number>>
  
  /** Gottman 类别映射 */
  gm?: Partial<Record<GottmanCategory, number>>
}

/**
 * 问题选项
 */
export interface QuestionOption {
  /** 选项键（'A' | 'B' | 'C' | 'D' | ...） */
  key: string
  
  /** 选项文本 */
  text: string
  
  /** 选项映射配置 */
  mapping: OptionMapping
}

/**
 * 问题配置
 */
export interface Question {
  /** 问题 ID */
  id: QuestionId
  
  /** 问题文本 */
  text: string
  
  /** 选项列表 */
  options: QuestionOption[]
}

// ==================== 个人画像类型 ====================

/**
 * 个人画像结果
 */
export interface PersonalProfile {
  /** 主要爱情风格 */
  primaryLoveStyle: LoveStyle
  
  /** 主要依恋类型 */
  primaryAttachment: Attachment
  
  /** 爱的语言得分 */
  loveLanguageScores: Record<LoveLanguage, number>
  
  /** 动物类型 */
  animal: AnimalType
  
  /** Sternberg 三角向量 */
  sternbergVector: {
    intimacy: number
    passion: number
    commitment: number
  }
  
  /** Gottman 向量 */
  gottmanVector: Record<GottmanCategory, number>
  
  /** 所有爱情风格得分（用于显示） */
  loveStyleScores: Record<LoveStyle, number>
  
  /** 所有依恋类型得分（用于显示） */
  attachmentScores: Record<Attachment, number>
}

/**
 * 完整用户画像（包含 Social Exchange 答案）
 */
export interface FullProfile extends PersonalProfile {
  /** Social Exchange 答案 (Q24-Q26) */
  socialExchange: {
    q24: number  // 谁更投入 (1-5)
    q25: number  // 关系是否对等 (1-5)
    q26: number  // 满意度 (1-5)
  }
}

// ==================== 匹配度类型 ====================

/**
 * 匹配度详细结果
 */
export interface MatchScoreDetail {
  /** Sternberg 匹配度 */
  sternberg: {
    raw: number           // 原始分数 (0-1)
    weight: number        // 权重 (30)
    contribution: number  // 贡献值 (raw * weight)
  }
  
  /** Gottman 匹配度 */
  gottman: {
    raw: number
    weight: number        // 权重 (30)
    contribution: number
  }
  
  /** Social Exchange 匹配度 */
  socialExchange: {
    raw: number
    weight: number        // 权重 (25)
    contribution: number
  }
  
  /** 动物爱情匹配度 */
  animalLove: {
    raw: number
    weight: number        // 权重 (15)
    contribution: number
  }
  
  /** 总匹配度 (0-100) */
  total: number
}

/**
 * 匹配结果（包含详细信息）
 */
export interface MatchResult extends MatchScoreDetail {
  /** 用户A的动物 */
  animalA: AnimalType
  
  /** 用户B的动物 */
  animalB: AnimalType
  
  /** CP 名称 */
  cpName: string
  
  /** 昵称 */
  nickname: string
  
  /** 用户A的 Sternberg 类型 */
  sternbergTypeA: SternbergType
  
  /** 用户B的 Sternberg 类型 */
  sternbergTypeB: SternbergType
  
  /** 用户A的 Gottman 类型 */
  gottmanTypeA: GottmanType
  
  /** 用户B的 Gottman 类型 */
  gottmanTypeB: GottmanType
}

