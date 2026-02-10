// 你是什么猫猫测试 - 10道题

export interface CatQuestion {
  id: string
  text: string
  options: CatOption[]
}

export interface CatOption {
  key: string
  text: string
  scores: Record<string, number> // 猫猫类型得分
}

export const CAT_QUESTIONS: CatQuestion[] = [
  {
    id: 'C1',
    text: '周末你更愿意做什么？',
    options: [
      { key: 'A', text: '在家躺着，享受独处时光', scores: { '布偶猫': 3, '英短': 2, '橘猫': 1 } },
      { key: 'B', text: '和朋友一起出去玩', scores: { '暹罗猫': 3, '美短': 2, '橘猫': 1 } },
      { key: 'C', text: '学习新技能或做感兴趣的事', scores: { '波斯猫': 3, '英短': 2, '布偶猫': 1 } },
      { key: 'D', text: '随意安排，看心情', scores: { '橘猫': 3, '美短': 2, '暹罗猫': 1 } }
    ]
  },
  {
    id: 'C2',
    text: '面对压力时，你的反应是？',
    options: [
      { key: 'A', text: '保持冷静，理性分析', scores: { '英短': 3, '波斯猫': 2, '布偶猫': 1 } },
      { key: 'B', text: '有点焦虑，但会努力应对', scores: { '暹罗猫': 3, '美短': 2, '橘猫': 1 } },
      { key: 'C', text: '先逃避一下，等心情好了再处理', scores: { '橘猫': 3, '布偶猫': 2, '美短': 1 } },
      { key: 'D', text: '完全不在意，随它去', scores: { '波斯猫': 3, '英短': 2, '橘猫': 1 } }
    ]
  },
  {
    id: 'C3',
    text: '你更喜欢什么样的社交方式？',
    options: [
      { key: 'A', text: '和几个亲密朋友深度交流', scores: { '布偶猫': 3, '英短': 2, '波斯猫': 1 } },
      { key: 'B', text: '参加热闹的聚会，认识新朋友', scores: { '暹罗猫': 3, '美短': 2, '橘猫': 1 } },
      { key: 'C', text: '偶尔社交，大部分时间独处', scores: { '波斯猫': 3, '英短': 2, '布偶猫': 1 } },
      { key: 'D', text: '看心情，有时想热闹有时想安静', scores: { '橘猫': 3, '美短': 2, '暹罗猫': 1 } }
    ]
  },
  {
    id: 'C4',
    text: '别人对你的第一印象通常是？',
    options: [
      { key: 'A', text: '温柔、优雅、有气质', scores: { '布偶猫': 3, '波斯猫': 2, '英短': 1 } },
      { key: 'B', text: '活泼、开朗、有趣', scores: { '暹罗猫': 3, '美短': 2, '橘猫': 1 } },
      { key: 'C', text: '稳重、可靠、值得信赖', scores: { '英短': 3, '布偶猫': 2, '波斯猫': 1 } },
      { key: 'D', text: '随和、好相处、没什么架子', scores: { '橘猫': 3, '美短': 2, '暹罗猫': 1 } }
    ]
  },
  {
    id: 'C5',
    text: '你更倾向于如何表达情感？',
    options: [
      { key: 'A', text: '含蓄内敛，不轻易表露', scores: { '波斯猫': 3, '英短': 2, '布偶猫': 1 } },
      { key: 'B', text: '直接表达，喜欢就说', scores: { '暹罗猫': 3, '美短': 2, '橘猫': 1 } },
      { key: 'C', text: '通过行动和细节表达', scores: { '布偶猫': 3, '英短': 2, '波斯猫': 1 } },
      { key: 'D', text: '看情况，有时直接有时含蓄', scores: { '橘猫': 3, '美短': 2, '暹罗猫': 1 } }
    ]
  },
  {
    id: 'C6',
    text: '你更喜欢什么样的生活环境？',
    options: [
      { key: 'A', text: '安静、整洁、有秩序', scores: { '波斯猫': 3, '英短': 2, '布偶猫': 1 } },
      { key: 'B', text: '热闹、有活力、充满变化', scores: { '暹罗猫': 3, '美短': 2, '橘猫': 1 } },
      { key: 'C', text: '舒适、温馨、有安全感', scores: { '布偶猫': 3, '英短': 2, '波斯猫': 1 } },
      { key: 'D', text: '随意，怎么舒服怎么来', scores: { '橘猫': 3, '美短': 2, '暹罗猫': 1 } }
    ]
  },
  {
    id: 'C7',
    text: '面对新事物，你的态度是？',
    options: [
      { key: 'A', text: '谨慎观察，确认安全后再尝试', scores: { '英短': 3, '波斯猫': 2, '布偶猫': 1 } },
      { key: 'B', text: '充满好奇，立即尝试', scores: { '暹罗猫': 3, '美短': 2, '橘猫': 1 } },
      { key: 'C', text: '保持距离，不太感兴趣', scores: { '波斯猫': 3, '英短': 2, '布偶猫': 1 } },
      { key: 'D', text: '看心情，有时好奇有时无所谓', scores: { '橘猫': 3, '美短': 2, '暹罗猫': 1 } }
    ]
  },
  {
    id: 'C8',
    text: '你更看重什么？',
    options: [
      { key: 'A', text: '内心的平静和满足', scores: { '布偶猫': 3, '波斯猫': 2, '英短': 1 } },
      { key: 'B', text: '新鲜刺激的体验', scores: { '暹罗猫': 3, '美短': 2, '橘猫': 1 } },
      { key: 'C', text: '稳定和安全感', scores: { '英短': 3, '布偶猫': 2, '波斯猫': 1 } },
      { key: 'D', text: '快乐和自由', scores: { '橘猫': 3, '美短': 2, '暹罗猫': 1 } }
    ]
  },
  {
    id: 'C9',
    text: '你的日常节奏是？',
    options: [
      { key: 'A', text: '规律作息，生活有序', scores: { '英短': 3, '波斯猫': 2, '布偶猫': 1 } },
      { key: 'B', text: '充满活力，节奏较快', scores: { '暹罗猫': 3, '美短': 2, '橘猫': 1 } },
      { key: 'C', text: '慢节奏，享受悠闲', scores: { '布偶猫': 3, '波斯猫': 2, '英短': 1 } },
      { key: 'D', text: '不固定，看情况调整', scores: { '橘猫': 3, '美短': 2, '暹罗猫': 1 } }
    ]
  },
  {
    id: 'C10',
    text: '你希望别人怎么看待你？',
    options: [
      { key: 'A', text: '优雅、有品味', scores: { '波斯猫': 3, '布偶猫': 2, '英短': 1 } },
      { key: 'B', text: '有趣、有魅力', scores: { '暹罗猫': 3, '美短': 2, '橘猫': 1 } },
      { key: 'C', text: '可靠、值得信任', scores: { '英短': 3, '布偶猫': 2, '波斯猫': 1 } },
      { key: 'D', text: '随和、好相处', scores: { '橘猫': 3, '美短': 2, '暹罗猫': 1 } }
    ]
  }
]

// 猫猫类型描述
export interface CatType {
  name: string
  emoji: string
  description: string
  traits: string[]
  color: string // Tailwind CSS 颜色类
}

export const CAT_TYPES: Record<string, CatType> = {
  '布偶猫': {
    name: '布偶猫',
    emoji: '🐱',
    description: '你就像一只温柔的布偶猫，性格温和、优雅，喜欢安静的环境。你重视情感连接，对亲密关系有很高的需求，但也需要自己的空间。你善于倾听，是朋友眼中的温柔天使。',
    traits: ['温柔优雅', '情感丰富', '喜欢安静', '需要陪伴', '善解人意'],
    color: 'from-blue-300 to-blue-500'
  },
  '英短': {
    name: '英国短毛猫',
    emoji: '🐈',
    description: '你就像一只稳重的英国短毛猫，性格沉稳、可靠，做事有条理。你不太喜欢变化，更倾向于稳定的生活节奏。朋友们都认为你值得信赖，是可靠的伙伴。',
    traits: ['稳重可靠', '有条理', '喜欢稳定', '值得信赖', '不太爱动'],
    color: 'from-gray-400 to-gray-600'
  },
  '暹罗猫': {
    name: '暹罗猫',
    emoji: '🐈‍⬛',
    description: '你就像一只活泼的暹罗猫，性格外向、好奇，充满活力。你喜欢社交，对新事物充满好奇，总是想要探索更多。你的热情和活力感染着周围的人。',
    traits: ['活泼外向', '充满好奇', '喜欢社交', '精力充沛', '热情开朗'],
    color: 'from-purple-400 to-purple-600'
  },
  '橘猫': {
    name: '橘猫',
    emoji: '🐈',
    description: '你就像一只随性的橘猫，性格随和、乐观，很容易满足。你不太在意细节，更享受当下的快乐。你的随性和乐观让周围的人感到轻松愉快。',
    traits: ['随和乐观', '容易满足', '享受当下', '不太在意细节', '轻松愉快'],
    color: 'from-orange-400 to-orange-600'
  },
  '美短': {
    name: '美国短毛猫',
    emoji: '🐱',
    description: '你就像一只友好的美国短毛猫，性格开朗、适应力强，很容易相处。你既喜欢社交也享受独处，能够很好地平衡生活。你的友好和适应力让你在各种环境中都能游刃有余。',
    traits: ['友好开朗', '适应力强', '容易相处', '平衡生活', '游刃有余'],
    color: 'from-green-400 to-green-600'
  },
  '波斯猫': {
    name: '波斯猫',
    emoji: '🐈',
    description: '你就像一只高贵的波斯猫，性格优雅、独立，有自己的节奏。你不太喜欢被打扰，更享受独处的时光。你的优雅和独立让你显得很有魅力。',
    traits: ['优雅高贵', '独立自主', '喜欢独处', '有自己的节奏', '很有魅力'],
    color: 'from-pink-300 to-pink-500'
  }
}

// 计算猫猫类型
export function calculateCatType(answers: Record<string, string>): string {
  const scores: Record<string, number> = {}
  
  // 初始化所有猫猫类型的得分
  Object.keys(CAT_TYPES).forEach(catType => {
    scores[catType] = 0
  })
  
  // 遍历所有答案，累加得分
  CAT_QUESTIONS.forEach(question => {
    const selectedKey = answers[question.id]
    if (!selectedKey) return
    
    const selectedOption = question.options.find(opt => opt.key === selectedKey)
    if (!selectedOption) return
    
    // 累加得分
    Object.entries(selectedOption.scores).forEach(([catType, score]) => {
      scores[catType] = (scores[catType] || 0) + score
    })
  })
  
  // 找到得分最高的猫猫类型
  let maxScore = 0
  let resultType = '橘猫' // 默认值
  
  Object.entries(scores).forEach(([catType, score]) => {
    if (score > maxScore) {
      maxScore = score
      resultType = catType
    }
  })
  
  // 如果出现并列，优先选择：布偶猫 > 英短 > 暹罗猫 > 橘猫 > 美短 > 波斯猫
  const tieBreaker = ['布偶猫', '英短', '暹罗猫', '橘猫', '美短', '波斯猫']
  const maxScoreTypes = Object.entries(scores)
    .filter(([_, score]) => score === maxScore)
    .map(([type, _]) => type)
  
  if (maxScoreTypes.length > 1) {
    for (const type of tieBreaker) {
      if (maxScoreTypes.includes(type)) {
        resultType = type
        break
      }
    }
  }
  
  return resultType
}
