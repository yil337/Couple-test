// 你是什么狗狗测试 - 10道题

export interface DogQuestion {
  id: string
  text: string
  options: DogOption[]
}

export interface DogOption {
  key: string
  text: string
  scores: Record<string, number> // 狗狗类型得分
}

export const DOG_QUESTIONS: DogQuestion[] = [
  {
    id: 'D1',
    text: '你更倾向于什么样的生活方式？',
    options: [
      { key: 'A', text: '忠诚可靠，守护重要的人', scores: { '金毛': 3, '德牧': 2, '哈士奇': 1 } },
      { key: 'B', text: '活泼好动，充满活力', scores: { '哈士奇': 3, '泰迪': 2, '金毛': 1 } },
      { key: 'C', text: '聪明机灵，善于学习', scores: { '边牧': 3, '德牧': 2, '泰迪': 1 } },
      { key: 'D', text: '小巧可爱，活泼开朗', scores: { '泰迪': 3, '哈士奇': 2, '金毛': 1 } }
    ]
  },
  {
    id: 'D2',
    text: '面对挑战时，你的反应是？',
    options: [
      { key: 'A', text: '勇敢面对，坚持不懈', scores: { '德牧': 3, '金毛': 2, '边牧': 1 } },
      { key: 'B', text: '灵活应对，寻找新方法', scores: { '边牧': 3, '哈士奇': 2, '泰迪': 1 } },
      { key: 'C', text: '乐观面对，保持积极', scores: { '金毛': 3, '泰迪': 2, '哈士奇': 1 } },
      { key: 'D', text: '轻松面对，不太在意', scores: { '哈士奇': 3, '泰迪': 2, '金毛': 1 } }
    ]
  },
  {
    id: 'D3',
    text: '你更看重什么？',
    options: [
      { key: 'A', text: '忠诚和信任', scores: { '金毛': 3, '德牧': 2, '边牧': 1 } },
      { key: 'B', text: '自由和探索', scores: { '哈士奇': 3, '边牧': 2, '泰迪': 1 } },
      { key: 'C', text: '智慧和能力', scores: { '边牧': 3, '德牧': 2, '金毛': 1 } },
      { key: 'D', text: '快乐和陪伴', scores: { '泰迪': 3, '金毛': 2, '哈士奇': 1 } }
    ]
  },
  {
    id: 'D4',
    text: '你的社交风格是？',
    options: [
      { key: 'A', text: '友好温和，容易相处', scores: { '金毛': 3, '泰迪': 2, '边牧': 1 } },
      { key: 'B', text: '活泼外向，喜欢热闹', scores: { '哈士奇': 3, '泰迪': 2, '金毛': 1 } },
      { key: 'C', text: '聪明机敏，善于交流', scores: { '边牧': 3, '德牧': 2, '泰迪': 1 } },
      { key: 'D', text: '忠诚可靠，值得信赖', scores: { '德牧': 3, '金毛': 2, '边牧': 1 } }
    ]
  },
  {
    id: 'D5',
    text: '你更喜欢什么样的活动？',
    options: [
      { key: 'A', text: '户外运动，亲近自然', scores: { '金毛': 3, '哈士奇': 2, '边牧': 1 } },
      { key: 'B', text: '探索冒险，寻找刺激', scores: { '哈士奇': 3, '边牧': 2, '德牧': 1 } },
      { key: 'C', text: '智力游戏，挑战思维', scores: { '边牧': 3, '德牧': 2, '泰迪': 1 } },
      { key: 'D', text: '轻松娱乐，享受快乐', scores: { '泰迪': 3, '金毛': 2, '哈士奇': 1 } }
    ]
  },
  {
    id: 'D6',
    text: '你对待朋友的态度是？',
    options: [
      { key: 'A', text: '忠诚守护，不离不弃', scores: { '金毛': 3, '德牧': 2, '边牧': 1 } },
      { key: 'B', text: '活泼有趣，带来快乐', scores: { '哈士奇': 3, '泰迪': 2, '金毛': 1 } },
      { key: 'C', text: '聪明机智，善于帮助', scores: { '边牧': 3, '德牧': 2, '泰迪': 1 } },
      { key: 'D', text: '可爱活泼，讨人喜欢', scores: { '泰迪': 3, '金毛': 2, '哈士奇': 1 } }
    ]
  },
  {
    id: 'D7',
    text: '你的性格特点是？',
    options: [
      { key: 'A', text: '温和友善，容易相处', scores: { '金毛': 3, '泰迪': 2, '边牧': 1 } },
      { key: 'B', text: '活泼好动，充满活力', scores: { '哈士奇': 3, '泰迪': 2, '金毛': 1 } },
      { key: 'C', text: '聪明机敏，善于思考', scores: { '边牧': 3, '德牧': 2, '泰迪': 1 } },
      { key: 'D', text: '忠诚可靠，值得信赖', scores: { '德牧': 3, '金毛': 2, '边牧': 1 } }
    ]
  },
  {
    id: 'D8',
    text: '你更倾向于什么样的环境？',
    options: [
      { key: 'A', text: '温馨舒适，有安全感', scores: { '金毛': 3, '泰迪': 2, '德牧': 1 } },
      { key: 'B', text: '开放自由，充满可能', scores: { '哈士奇': 3, '边牧': 2, '泰迪': 1 } },
      { key: 'C', text: '有序稳定，有规律', scores: { '德牧': 3, '边牧': 2, '金毛': 1 } },
      { key: 'D', text: '活泼热闹，充满活力', scores: { '泰迪': 3, '哈士奇': 2, '金毛': 1 } }
    ]
  },
  {
    id: 'D9',
    text: '你处理问题的方式是？',
    options: [
      { key: 'A', text: '耐心细致，稳步解决', scores: { '金毛': 3, '德牧': 2, '边牧': 1 } },
      { key: 'B', text: '灵活机智，寻找新方法', scores: { '边牧': 3, '哈士奇': 2, '泰迪': 1 } },
      { key: 'C', text: '勇敢果断，直接面对', scores: { '德牧': 3, '金毛': 2, '边牧': 1 } },
      { key: 'D', text: '乐观轻松，不太在意', scores: { '哈士奇': 3, '泰迪': 2, '金毛': 1 } }
    ]
  },
  {
    id: 'D10',
    text: '你希望别人怎么看待你？',
    options: [
      { key: 'A', text: '忠诚、可靠、值得信赖', scores: { '金毛': 3, '德牧': 2, '边牧': 1 } },
      { key: 'B', text: '活泼、有趣、充满活力', scores: { '哈士奇': 3, '泰迪': 2, '金毛': 1 } },
      { key: 'C', text: '聪明、机智、有能力', scores: { '边牧': 3, '德牧': 2, '泰迪': 1 } },
      { key: 'D', text: '可爱、活泼、讨人喜欢', scores: { '泰迪': 3, '金毛': 2, '哈士奇': 1 } }
    ]
  }
]

// 狗狗类型描述
export interface DogType {
  name: string
  emoji: string
  description: string
  traits: string[]
  color: string // Tailwind CSS 颜色类
}

export const DOG_TYPES: Record<string, DogType> = {
  '金毛': {
    name: '金毛',
    emoji: '🦮',
    description: '你就像一只温和的金毛，性格友善、忠诚，是朋友眼中的温暖天使。你重视情感连接，对身边的人充满关爱，总是愿意帮助他人。你的温和和忠诚让你成为值得信赖的伙伴。',
    traits: ['温和友善', '忠诚可靠', '充满关爱', '乐于助人', '值得信赖'],
    color: 'from-yellow-400 to-yellow-600'
  },
  '哈士奇': {
    name: '哈士奇',
    emoji: '🐺',
    description: '你就像一只活泼的哈士奇，性格外向、好动，充满活力。你喜欢探索新事物，对生活充满好奇，总是想要尝试更多。你的活力和好奇心感染着周围的人，带来无限欢乐。',
    traits: ['活泼外向', '充满活力', '喜欢探索', '充满好奇', '带来欢乐'],
    color: 'from-blue-400 to-blue-600'
  },
  '边牧': {
    name: '边牧',
    emoji: '🐕',
    description: '你就像一只聪明的边牧，性格机敏、善于思考，总是能找到解决问题的方法。你学习能力强，喜欢挑战，对新鲜事物充满兴趣。你的智慧和机敏让你在各个方面都表现出色。',
    traits: ['聪明机敏', '善于思考', '学习能力强', '喜欢挑战', '表现出色'],
    color: 'from-indigo-400 to-indigo-600'
  },
  '德牧': {
    name: '德牧',
    emoji: '🐕‍🦺',
    description: '你就像一只忠诚的德牧，性格稳重、可靠，做事认真负责。你重视承诺，对重要的人忠诚不二，总是愿意守护他们。你的稳重和忠诚让你成为值得信赖的伙伴。',
    traits: ['稳重可靠', '认真负责', '重视承诺', '忠诚不二', '值得信赖'],
    color: 'from-gray-500 to-gray-700'
  },
  '泰迪': {
    name: '泰迪',
    emoji: '🐩',
    description: '你就像一只可爱的泰迪，性格活泼、开朗，总是充满活力。你讨人喜欢，容易相处，喜欢和朋友们一起玩耍。你的活泼和可爱让周围的人感到快乐和轻松。',
    traits: ['活泼开朗', '充满活力', '讨人喜欢', '容易相处', '带来快乐'],
    color: 'from-rose-400 to-rose-600'
  }
}

// 计算狗狗类型
export function calculateDogType(answers: Record<string, string>): string {
  const scores: Record<string, number> = {}
  
  Object.keys(DOG_TYPES).forEach(dogType => {
    scores[dogType] = 0
  })
  
  DOG_QUESTIONS.forEach(question => {
    const selectedKey = answers[question.id]
    if (!selectedKey) return
    
    const selectedOption = question.options.find(opt => opt.key === selectedKey)
    if (!selectedOption) return
    
    Object.entries(selectedOption.scores).forEach(([dogType, score]) => {
      scores[dogType] = (scores[dogType] || 0) + score
    })
  })
  
  let maxScore = 0
  let resultType = '金毛'
  
  Object.entries(scores).forEach(([dogType, score]) => {
    if (score > maxScore) {
      maxScore = score
      resultType = dogType
    }
  })
  
  const tieBreaker = ['金毛', '哈士奇', '边牧', '德牧', '泰迪']
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
