// 测试配置系统
// 管理所有测试的基本信息和路由

export interface TestConfig {
  id: string // 测试唯一标识
  name: string // 测试名称
  description: string // 简短描述
  icon: string // emoji 图标
  color: string // 主题颜色（Tailwind CSS 类）
  route: string // 路由路径
  category: string // 分类
  questions: number // 题目数量
  duration: string // 预计时长
  featured?: boolean // 是否推荐
}

export const ALL_TESTS: TestConfig[] = [
  {
    id: 'love-animal',
    name: '爱情动物人格测试',
    description: '基于6大心理学理论模型，科学评估你的爱情动物画像与伴侣匹配度',
    icon: '💕',
    color: 'from-pink-500 to-purple-500',
    route: '/love-test',
    category: '情感关系',
    questions: 26,
    duration: '10-15分钟',
    featured: true
  },
  {
    id: 'personality-big5',
    name: '大五人格测试',
    description: '基于心理学经典理论，全面评估你的性格特质和人格类型',
    icon: '🧠',
    color: 'from-blue-500 to-cyan-500',
    route: '/personality-test',
    category: '人格心理',
    questions: 30,
    duration: '15-20分钟',
    featured: true
  },
  {
    id: 'career-fit',
    name: '职业匹配度测试',
    description: '通过分析你的兴趣、价值观和能力，找到最适合你的职业方向',
    icon: '💼',
    color: 'from-green-500 to-emerald-500',
    route: '/career-test',
    category: '职业发展',
    questions: 25,
    duration: '12-15分钟',
    featured: false
  },
  {
    id: 'stress-level',
    name: '压力水平评估',
    description: '科学评估你当前的压力水平，并提供个性化的缓解建议',
    icon: '😌',
    color: 'from-orange-500 to-red-500',
    route: '/stress-test',
    category: '心理健康',
    questions: 20,
    duration: '8-10分钟',
    featured: false
  },
  {
    id: 'communication-style',
    name: '沟通风格测试',
    description: '了解你的沟通偏好和风格，提升人际交往能力',
    icon: '💬',
    color: 'from-indigo-500 to-purple-500',
    route: '/communication-test',
    category: '人际交往',
    questions: 22,
    duration: '10-12分钟',
    featured: false
  },
  {
    id: 'emotional-intelligence',
    name: '情商测试',
    description: '评估你的情绪感知、管理和表达能力，提升情商水平',
    icon: '❤️',
    color: 'from-rose-500 to-pink-500',
    route: '/eq-test',
    category: '情感关系',
    questions: 28,
    duration: '12-15分钟',
    featured: false
  }
]

// 按分类分组
export const TESTS_BY_CATEGORY = ALL_TESTS.reduce((acc, test) => {
  if (!acc[test.category]) {
    acc[test.category] = []
  }
  acc[test.category].push(test)
  return acc
}, {} as Record<string, TestConfig[]>)

// 获取推荐测试
export const getFeaturedTests = () => ALL_TESTS.filter(test => test.featured)

// 根据 ID 获取测试配置
export const getTestById = (id: string): TestConfig | undefined => {
  return ALL_TESTS.find(test => test.id === id)
}

// 根据路由获取测试配置
export const getTestByRoute = (route: string): TestConfig | undefined => {
  return ALL_TESTS.find(test => test.route === route)
}
