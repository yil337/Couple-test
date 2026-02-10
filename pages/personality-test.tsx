import Link from 'next/link'
import Head from 'next/head'

export default function PersonalityTest() {
  return (
    <>
      <Head>
        <title>大五人格测试 - LY Analytics</title>
      </Head>
      <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
            <div className="text-6xl mb-6">🧠</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              大五人格测试
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              基于心理学经典理论，全面评估你的性格特质和人格类型
            </p>
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <p className="text-gray-700">
                此测试正在开发中，敬请期待！
              </p>
              <p className="text-sm text-gray-500 mt-2">
                预计包含 30 道题目，耗时约 15-20 分钟
              </p>
            </div>
            <Link 
              href="/plaza"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
            >
              返回测试广场
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
