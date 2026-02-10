import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import { FOOD_TYPES } from '../src/lib/foodQuestions'

export default function FoodResult() {
  const router = useRouter()
  const { type, nickname } = router.query

  if (!type || typeof type !== 'string') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  const foodType = FOOD_TYPES[type] || FOOD_TYPES['饺子']
  const displayName = (nickname && typeof nickname === 'string') ? nickname : '你'

  return (
    <>
      <Head>
        <title>{displayName}是{foodType.name} - LY Analytics</title>
      </Head>
      <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-800 transition-colors mb-4 inline-block"
            >
              ← 返回测试广场
            </Link>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              {displayName}是
            </h1>
          </div>

          <div className={`bg-gradient-to-br ${foodType.color} rounded-2xl shadow-2xl p-8 md:p-12 mb-8`}>
            <div className="text-center">
              <div className="text-8xl mb-6">{foodType.emoji}</div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
                {foodType.name}
              </h2>
              <p className="text-xl md:text-2xl leading-relaxed mb-8 text-gray-700">
                {foodType.description}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              ✨ 你的特质
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {foodType.traits.map((trait, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-red-100 to-orange-100 rounded-lg p-4 text-center"
                >
                  <span className="text-gray-800 font-medium">{trait}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center space-y-4">
            <Link
              href="/food-test"
              className="inline-block px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
            >
              重新测试
            </Link>
            <div>
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                返回测试广场
              </Link>
            </div>
          </div>

          <div className="mt-16 text-center space-y-4">
            <div className="pb-4">
              <p className="text-sm font-semibold text-gray-500 mb-2">
                商务合作｜Business Collaboration
              </p>
              <p className="text-xs text-gray-500">
                如需媒体报道、内容授权、模型合作、商业合作或其他形式的合作洽谈，请联系：
              </p>
              <a 
                href="mailto:lyanalytics1@gmail.com" 
                className="text-xs text-gray-500 hover:text-gray-600 underline"
              >
                lyanalytics1@gmail.com
              </a>
            </div>

            <div className="pb-4">
              <p className="text-xs text-gray-500">
                © 2025 LY Analytics｜本平台所有内容受版权保护
              </p>
            </div>

            <div className="pb-8">
              <p className="text-xs text-gray-500">
                本测评结果仅供参考，不构成专业心理诊断或行为建议。
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
