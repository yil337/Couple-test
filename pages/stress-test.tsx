import Link from 'next/link'
import Head from 'next/head'

export default function StressTest() {
  return (
    <>
      <Head>
        <title>压力水平评估 - LY Analytics</title>
      </Head>
      <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
            <div className="text-6xl mb-6">😌</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              压力水平评估
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              科学评估你当前的压力水平，并提供个性化的缓解建议
            </p>
            <div className="bg-orange-50 rounded-lg p-6 mb-8">
              <p className="text-gray-700">
                此测试正在开发中，敬请期待！
              </p>
              <p className="text-sm text-gray-500 mt-2">
                预计包含 20 道题目，耗时约 8-10 分钟
              </p>
            </div>
            <Link 
              href="/plaza"
              className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
            >
              返回测试广场
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
