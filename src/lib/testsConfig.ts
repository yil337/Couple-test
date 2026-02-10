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
    id: 'cat-test',
    name: '你是什么猫猫测试',
    description: '通过10道题，发现你内心的猫猫人格，看看你是哪种可爱的小猫咪',
    icon: '🐱',
    color: 'from-orange-500 to-yellow-500',
    route: '/cat-test',
    category: '趣味测试',
    questions: 10,
    duration: '3-5分钟',
    featured: true
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
