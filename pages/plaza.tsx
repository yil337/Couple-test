import Link from 'next/link'
import Head from 'next/head'
import { ALL_TESTS, TESTS_BY_CATEGORY, getFeaturedTests } from '../src/lib/testsConfig'

export default function Plaza() {
  const featuredTests = getFeaturedTests()
  const categories = Object.keys(TESTS_BY_CATEGORY)

  return (
    <>
      <Head>
        <title>测试广场 - LY Analytics</title>
        <meta name="description" content="专业的心理测试平台，涵盖情感关系、人格心理、职业发展等多个领域" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
              🎯 测试广场
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-2">
              专业的心理测试平台
            </p>
            <p className="text-lg text-gray-500">
              涵盖情感关系、人格心理、职业发展等多个领域
            </p>
          </div>

          {/* 推荐测试 */}
          {featuredTests.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">⭐</span>
                推荐测试
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTests.map((test) => (
                  <Link
                    key={test.id}
                    href={test.route}
                    className="group relative bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${test.color} rounded-t-xl`}></div>
                    <div className="flex items-start mb-4">
                      <span className="text-5xl mr-4">{test.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                          {test.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {test.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-gray-200">
                      <span>{test.questions} 道题</span>
                      <span>{test.duration}</span>
                    </div>
                    <div className="mt-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${test.color} text-white`}>
                        {test.category}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 按分类展示 */}
          {categories.map((category) => (
            <div key={category} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">📚</span>
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TESTS_BY_CATEGORY[category].map((test) => (
                  <Link
                    key={test.id}
                    href={test.route}
                    className="group relative bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${test.color} rounded-t-xl`}></div>
                    <div className="flex items-start mb-4">
                      <span className="text-4xl mr-4">{test.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                          {test.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {test.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-gray-200">
                      <span>{test.questions} 道题</span>
                      <span>{test.duration}</span>
                    </div>
                    <div className="mt-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${test.color} text-white`}>
                        {test.category}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* 商务合作 */}
          <div className="text-center mt-16 pb-4">
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

          {/* 版权信息 */}
          <div className="text-center pb-4">
            <p className="text-xs text-gray-500">
              © 2025 LY Analytics｜本平台所有内容受版权保护
            </p>
          </div>

          {/* 免责声明 */}
          <div className="text-center pb-8">
            <p className="text-xs text-gray-500">
              本测评结果仅供参考，不构成专业心理诊断或行为建议。
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
