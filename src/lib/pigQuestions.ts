// 你是什么猪猪测试 - 10道题

export interface PigQuestion {
  id: string
  text: string
  options: PigOption[]
}

export interface PigOption {
  key: string
  text: string
  scores: Record<string, number> // 猪猪类型得分
}

export const PIG_QUESTIONS: PigQuestion[] = [
  {
    id: 'P1',
    text: '你最喜欢的生活方式是？',
    options: [
      { key: 'A', text: '简单快乐，享受当下', scores: { '小香猪': 3, '荷兰猪': 2, '大白猪': 1 } },
      { key: 'B', text: '精致优雅，追求品质', scores: { '迷你猪': 3, '小香猪': 2, '荷兰猪': 1 } },
      { key: 'C', text: '踏实稳重，一步一个脚印', scores: { '大白猪': 3, '荷兰猪': 2, '小香猪': 1 } },
      { key: 'D', text: '活泼好动，充满活力', scores: { '荷兰猪': 3, '小香猪': 2, '迷你猪': 1 } }
    ]
  },
  {
    id: 'P2',
    text: '面对美食，你的态度是？',
    options: [
      { key: 'A', text: '来者不拒，享受每一口', scores: { '大白猪': 3, '小香猪': 2, '荷兰猪': 1 } },
      { key: 'B', text: '精致品尝，注重品质', scores: { '迷你猪': 3, '小香猪': 2, '荷兰猪': 1 } },
      { key: 'C', text: '适量就好，保持健康', scores: { '荷兰猪': 3, '小香猪': 2, '迷你猪': 1 } },
      { key: 'D', text: '看心情，想吃就吃', scores: { '小香猪': 3, '荷兰猪': 2, '大白猪': 1 } }
    ]
  },
  {
    id: 'P3',
    text: '你的性格特点是？',
    options: [
      { key: 'A', text: '乐观开朗，容易满足', scores: { '小香猪': 3, '荷兰猪': 2, '大白猪': 1 } },
      { key: 'B', text: '精致优雅，有品味', scores: { '迷你猪': 3, '小香猪': 2, '荷兰猪': 1 } },
      { key: 'C', text: '稳重可靠，值得信赖', scores: { '大白猪': 3, '荷兰猪': 2, '小香猪': 1 } },
      { key: 'D', text: '活泼好动，充满好奇心', scores: { '荷兰猪': 3, '小香猪': 2, '迷你猪': 1 } }
    ]
  },
  {
    id: 'P4',
    text: '你更倾向于如何度过周末？',
    options: [
      { key: 'A', text: '在家休息，享受悠闲时光', scores: { '小香猪': 3, '大白猪': 2, '迷你猪': 1 } },
      { key: 'B', text: '精致生活，做自己喜欢的事', scores: { '迷你猪': 3, '小香猪': 2, '荷兰猪': 1 } },
      { key: 'C', text: '按计划行事，有条不紊', scores: { '大白猪': 3, '荷兰猪': 2, '小香猪': 1 } },
      { key: 'D', text: '出去探索，寻找新鲜事物', scores: { '荷兰猪': 3, '小香猪': 2, '迷你猪': 1 } }
    ]
  },
  {
    id: 'P5',
    text: '你对待生活的态度是？',
    options: [
      { key: 'A', text: '简单快乐，知足常乐', scores: { '小香猪': 3, '荷兰猪': 2, '大白猪': 1 } },
      { key: 'B', text: '追求精致，享受生活', scores: { '迷你猪': 3, '小香猪': 2, '荷兰猪': 1 } },
      { key: 'C', text: '踏实稳重，一步一个脚印', scores: { '大白猪': 3, '荷兰猪': 2, '小香猪': 1 } },
      { key: 'D', text: '充满活力，积极向上', scores: { '荷兰猪': 3, '小香猪': 2, '迷你猪': 1 } }
    ]
  },
  {
    id: 'P6',
    text: '你更看重什么？',
    options: [
      { key: 'A', text: '内心的快乐和满足', scores: { '小香猪': 3, '荷兰猪': 2, '大白猪': 1 } },
      { key: 'B', text: '生活的品质和品味', scores: { '迷你猪': 3, '小香猪': 2, '荷兰猪': 1 } },
      { key: 'C', text: '稳定和安全感', scores: { '大白猪': 3, '荷兰猪': 2, '小香猪': 1 } },
      { key: 'D', text: '新鲜和刺激的体验', scores: { '荷兰猪': 3, '小香猪': 2, '迷你猪': 1 } }
    ]
  },
  {
    id: 'P7',
    text: '你的社交风格是？',
    options: [
      { key: 'A', text: '随和友好，容易相处', scores: { '小香猪': 3, '荷兰猪': 2, '大白猪': 1 } },
      { key: 'B', text: '精致优雅，有选择性', scores: { '迷你猪': 3, '小香猪': 2, '荷兰猪': 1 } },
      { key: 'C', text: '稳重可靠，值得信赖', scores: { '大白猪': 3, '荷兰猪': 2, '小香猪': 1 } },
      { key: 'D', text: '活泼开朗，喜欢热闹', scores: { '荷兰猪': 3, '小香猪': 2, '迷你猪': 1 } }
    ]
  },
  {
    id: 'P8',
    text: '你更倾向于什么样的环境？',
    options: [
      { key: 'A', text: '舒适温馨，简单自在', scores: { '小香猪': 3, '大白猪': 2, '迷你猪': 1 } },
      { key: 'B', text: '精致优雅，有品味', scores: { '迷你猪': 3, '小香猪': 2, '荷兰猪': 1 } },
      { key: 'C', text: '稳定有序，有规律', scores: { '大白猪': 3, '荷兰猪': 2, '小香猪': 1 } },
      { key: 'D', text: '充满活力，变化多样', scores: { '荷兰猪': 3, '小香猪': 2, '迷你猪': 1 } }
    ]
  },
  {
    id: 'P9',
    text: '你处理问题的方式是？',
    options: [
      { key: 'A', text: '轻松面对，不太在意', scores: { '小香猪': 3, '荷兰猪': 2, '大白猪': 1 } },
      { key: 'B', text: '优雅处理，保持风度', scores: { '迷你猪': 3, '小香猪': 2, '荷兰猪': 1 } },
      { key: 'C', text: '认真对待，稳步解决', scores: { '大白猪': 3, '荷兰猪': 2, '小香猪': 1 } },
      { key: 'D', text: '积极应对，充满活力', scores: { '荷兰猪': 3, '小香猪': 2, '迷你猪': 1 } }
    ]
  },
  {
    id: 'P10',
    text: '你希望别人怎么看待你？',
    options: [
      { key: 'A', text: '快乐、随和、好相处', scores: { '小香猪': 3, '荷兰猪': 2, '大白猪': 1 } },
      { key: 'B', text: '精致、优雅、有品味', scores: { '迷你猪': 3, '小香猪': 2, '荷兰猪': 1 } },
      { key: 'C', text: '可靠、稳重、值得信赖', scores: { '大白猪': 3, '荷兰猪': 2, '小香猪': 1 } },
      { key: 'D', text: '活泼、有趣、充满活力', scores: { '荷兰猪': 3, '小香猪': 2, '迷你猪': 1 } }
    ]
  }
]

// 猪猪类型描述
export interface PigType {
  name: string
  emoji: string
  description: string
  traits: string[]
  color: string // Tailwind CSS 颜色类
}

export const PIG_TYPES: Record<string, PigType> = {
  '小香猪': {
    name: '小香猪',
    emoji: '🐷',
    description: '你就像一只可爱的小香猪，性格随和、乐观，很容易满足。你享受简单快乐的生活，不太在意细节，更注重当下的快乐。你的随性和乐观让周围的人感到轻松愉快。',
    traits: ['随和乐观', '容易满足', '享受当下', '简单快乐', '轻松愉快'],
    color: 'from-pink-300 to-pink-500'
  },
  '迷你猪': {
    name: '迷你猪',
    emoji: '🐽',
    description: '你就像一只精致的迷你猪，性格优雅、有品味，追求生活品质。你注重细节，喜欢精致的事物，享受高品质的生活。你的优雅和品味让你显得很有魅力。',
    traits: ['精致优雅', '有品味', '追求品质', '注重细节', '很有魅力'],
    color: 'from-purple-300 to-purple-500'
  },
  '大白猪': {
    name: '大白猪',
    emoji: '🐖',
    description: '你就像一只稳重的大白猪，性格踏实、可靠，做事有条理。你不太喜欢变化，更倾向于稳定的生活节奏。朋友们都认为你值得信赖，是可靠的伙伴。',
    traits: ['踏实稳重', '可靠可信', '有条理', '喜欢稳定', '值得信赖'],
    color: 'from-blue-300 to-blue-500'
  },
  '荷兰猪': {
    name: '荷兰猪',
    emoji: '🐹',
    description: '你就像一只活泼的荷兰猪，性格开朗、好动，充满活力。你喜欢探索新事物，对生活充满好奇，总是想要尝试更多。你的活力和好奇心感染着周围的人。',
    traits: ['活泼开朗', '充满活力', '喜欢探索', '充满好奇', '积极向上'],
    color: 'from-green-300 to-green-500'
  }
}

// 计算猪猪类型
export function calculatePigType(answers: Record<string, string>): string {
  const scores: Record<string, number> = {}
  
  Object.keys(PIG_TYPES).forEach(pigType => {
    scores[pigType] = 0
  })
  
  PIG_QUESTIONS.forEach(question => {
    const selectedKey = answers[question.id]
    if (!selectedKey) return
    
    const selectedOption = question.options.find(opt => opt.key === selectedKey)
    if (!selectedOption) return
    
    Object.entries(selectedOption.scores).forEach(([pigType, score]) => {
      scores[pigType] = (scores[pigType] || 0) + score
    })
  })
  
  let maxScore = 0
  let resultType = '小香猪'
  
  Object.entries(scores).forEach(([pigType, score]) => {
    if (score > maxScore) {
      maxScore = score
      resultType = pigType
    }
  })
  
  const tieBreaker = ['小香猪', '迷你猪', '大白猪', '荷兰猪']
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
