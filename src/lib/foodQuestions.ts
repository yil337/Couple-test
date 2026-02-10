// 你是年夜饭桌上的哪道菜测试 - 10道题

export interface FoodQuestion {
  id: string
  text: string
  options: FoodOption[]
}

export interface FoodOption {
  key: string
  text: string
  scores: Record<string, number> // 菜品类型得分
}

export const FOOD_QUESTIONS: FoodQuestion[] = [
  {
    id: 'F1',
    text: '你在聚会中更愿意扮演什么角色？',
    options: [
      { key: 'A', text: '核心主角，大家都围绕着你', scores: { '饺子': 3, '鱼': 2, '年糕': 1 } },
      { key: 'B', text: '重要配角，不可或缺', scores: { '鱼': 3, '年糕': 2, '汤圆': 1 } },
      { key: 'C', text: '温馨陪伴，带来温暖', scores: { '汤圆': 3, '年糕': 2, '饺子': 1 } },
      { key: 'D', text: '甜蜜点缀，带来快乐', scores: { '年糕': 3, '汤圆': 2, '春卷': 1 } }
    ]
  },
  {
    id: 'F2',
    text: '你更看重什么？',
    options: [
      { key: 'A', text: '传统和传承', scores: { '饺子': 3, '年糕': 2, '鱼': 1 } },
      { key: 'B', text: '寓意和象征', scores: { '鱼': 3, '年糕': 2, '汤圆': 1 } },
      { key: 'C', text: '温暖和团圆', scores: { '汤圆': 3, '饺子': 2, '年糕': 1 } },
      { key: 'D', text: '甜蜜和美好', scores: { '年糕': 3, '汤圆': 2, '春卷': 1 } }
    ]
  },
  {
    id: 'F3',
    text: '你的性格特点是？',
    options: [
      { key: 'A', text: '包容万象，内容丰富', scores: { '饺子': 3, '春卷': 2, '鱼': 1 } },
      { key: 'B', text: '寓意深远，有内涵', scores: { '鱼': 3, '年糕': 2, '饺子': 1 } },
      { key: 'C', text: '温暖圆润，让人安心', scores: { '汤圆': 3, '年糕': 2, '饺子': 1 } },
      { key: 'D', text: '甜蜜美好，带来快乐', scores: { '年糕': 3, '汤圆': 2, '春卷': 1 } }
    ]
  },
  {
    id: 'F4',
    text: '你更倾向于什么样的生活？',
    options: [
      { key: 'A', text: '丰富多彩，充满变化', scores: { '饺子': 3, '春卷': 2, '鱼': 1 } },
      { key: 'B', text: '年年有余，稳步向上', scores: { '鱼': 3, '年糕': 2, '饺子': 1 } },
      { key: 'C', text: '团团圆圆，温馨和睦', scores: { '汤圆': 3, '饺子': 2, '年糕': 1 } },
      { key: 'D', text: '节节高升，越来越好', scores: { '年糕': 3, '鱼': 2, '春卷': 1 } }
    ]
  },
  {
    id: 'F5',
    text: '你希望给别人带来什么？',
    options: [
      { key: 'A', text: '丰富的内容和体验', scores: { '饺子': 3, '春卷': 2, '鱼': 1 } },
      { key: 'B', text: '美好的寓意和祝福', scores: { '鱼': 3, '年糕': 2, '汤圆': 1 } },
      { key: 'C', text: '温暖的感觉和陪伴', scores: { '汤圆': 3, '饺子': 2, '年糕': 1 } },
      { key: 'D', text: '甜蜜的回忆和快乐', scores: { '年糕': 3, '汤圆': 2, '春卷': 1 } }
    ]
  },
  {
    id: 'F6',
    text: '你更注重什么？',
    options: [
      { key: 'A', text: '内容的丰富和多样性', scores: { '饺子': 3, '春卷': 2, '鱼': 1 } },
      { key: 'B', text: '象征意义和传统', scores: { '鱼': 3, '年糕': 2, '饺子': 1 } },
      { key: 'C', text: '温暖的感觉和氛围', scores: { '汤圆': 3, '年糕': 2, '饺子': 1 } },
      { key: 'D', text: '美好的寓意和祝福', scores: { '年糕': 3, '鱼': 2, '汤圆': 1 } }
    ]
  },
  {
    id: 'F7',
    text: '你的社交风格是？',
    options: [
      { key: 'A', text: '包容开放，接纳各种人', scores: { '饺子': 3, '春卷': 2, '鱼': 1 } },
      { key: 'B', text: '稳重有礼，值得尊敬', scores: { '鱼': 3, '年糕': 2, '饺子': 1 } },
      { key: 'C', text: '温暖友善，容易亲近', scores: { '汤圆': 3, '年糕': 2, '饺子': 1 } },
      { key: 'D', text: '活泼有趣，讨人喜欢', scores: { '年糕': 3, '汤圆': 2, '春卷': 1 } }
    ]
  },
  {
    id: 'F8',
    text: '你更倾向于什么样的表达方式？',
    options: [
      { key: 'A', text: '内容丰富，层次分明', scores: { '饺子': 3, '春卷': 2, '鱼': 1 } },
      { key: 'B', text: '寓意深刻，有内涵', scores: { '鱼': 3, '年糕': 2, '饺子': 1 } },
      { key: 'C', text: '温暖圆润，让人舒适', scores: { '汤圆': 3, '年糕': 2, '饺子': 1 } },
      { key: 'D', text: '甜蜜美好，带来快乐', scores: { '年糕': 3, '汤圆': 2, '春卷': 1 } }
    ]
  },
  {
    id: 'F9',
    text: '你对待传统的态度是？',
    options: [
      { key: 'A', text: '传承经典，不断创新', scores: { '饺子': 3, '春卷': 2, '鱼': 1 } },
      { key: 'B', text: '尊重传统，保持原味', scores: { '鱼': 3, '年糕': 2, '饺子': 1 } },
      { key: 'C', text: '温暖传承，延续美好', scores: { '汤圆': 3, '年糕': 2, '饺子': 1 } },
      { key: 'D', text: '美好寓意，代代相传', scores: { '年糕': 3, '鱼': 2, '汤圆': 1 } }
    ]
  },
  {
    id: 'F10',
    text: '你希望在新的一年里？',
    options: [
      { key: 'A', text: '包罗万象，收获满满', scores: { '饺子': 3, '春卷': 2, '鱼': 1 } },
      { key: 'B', text: '年年有余，稳步向上', scores: { '鱼': 3, '年糕': 2, '饺子': 1 } },
      { key: 'C', text: '团团圆圆，幸福美满', scores: { '汤圆': 3, '饺子': 2, '年糕': 1 } },
      { key: 'D', text: '节节高升，越来越好', scores: { '年糕': 3, '鱼': 2, '春卷': 1 } }
    ]
  }
]

// 菜品类型描述
export interface FoodType {
  name: string
  emoji: string
  description: string
  traits: string[]
  color: string // Tailwind CSS 颜色类
}

export const FOOD_TYPES: Record<string, FoodType> = {
  '饺子': {
    name: '饺子',
    emoji: '🥟',
    description: '你就像年夜饭桌上的饺子，包容万象，内容丰富。你是聚会的核心，大家都围绕着你。你传承着传统，又不断创新，是年夜饭桌上不可或缺的主角。',
    traits: ['包容万象', '内容丰富', '传承传统', '不断创新', '不可或缺'],
    color: 'from-red-400 to-red-600'
  },
  '鱼': {
    name: '鱼',
    emoji: '🐟',
    description: '你就像年夜饭桌上的鱼，寓意深远，年年有余。你稳重有礼，值得尊敬，是餐桌上的重要角色。你代表着美好的祝愿和稳步向上的生活态度。',
    traits: ['寓意深远', '年年有余', '稳重有礼', '值得尊敬', '美好祝愿'],
    color: 'from-cyan-400 to-cyan-600'
  },
  '年糕': {
    name: '年糕',
    emoji: '🍰',
    description: '你就像年夜饭桌上的年糕，甜蜜美好，节节高升。你带来快乐和祝福，寓意着新的一年越来越好。你的甜蜜和美好让年夜饭更加温馨。',
    traits: ['甜蜜美好', '节节高升', '带来快乐', '美好祝福', '越来越甜'],
    color: 'from-yellow-400 to-yellow-600'
  },
  '汤圆': {
    name: '汤圆',
    emoji: '🥣',
    description: '你就像年夜饭桌上的汤圆，温暖圆润，团团圆圆。你带来温暖和陪伴，让人感到安心。你代表着团圆和幸福，是年夜饭桌上最温馨的存在。',
    traits: ['温暖圆润', '团团圆圆', '带来温暖', '让人安心', '幸福美满'],
    color: 'from-pink-300 to-pink-500'
  },
  '春卷': {
    name: '春卷',
    emoji: '🌯',
    description: '你就像年夜饭桌上的春卷，内容丰富，层次分明。你包容各种元素，又能完美融合，是餐桌上的亮点。你代表着春天的希望和新的开始。',
    traits: ['内容丰富', '层次分明', '包容融合', '餐桌亮点', '新的开始'],
    color: 'from-green-400 to-green-600'
  }
}

// 计算菜品类型
export function calculateFoodType(answers: Record<string, string>): string {
  const scores: Record<string, number> = {}
  
  Object.keys(FOOD_TYPES).forEach(foodType => {
    scores[foodType] = 0
  })
  
  FOOD_QUESTIONS.forEach(question => {
    const selectedKey = answers[question.id]
    if (!selectedKey) return
    
    const selectedOption = question.options.find(opt => opt.key === selectedKey)
    if (!selectedOption) return
    
    Object.entries(selectedOption.scores).forEach(([foodType, score]) => {
      scores[foodType] = (scores[foodType] || 0) + score
    })
  })
  
  let maxScore = 0
  let resultType = '饺子'
  
  Object.entries(scores).forEach(([foodType, score]) => {
    if (score > maxScore) {
      maxScore = score
      resultType = foodType
    }
  })
  
  const tieBreaker = ['饺子', '鱼', '年糕', '汤圆', '春卷']
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
