import Link from 'next/link'
import Head from 'next/head'

export default function EQTest() {
  return (
    <>
      <Head>
        <title>情商测试 - LY Analytics</title>
      </Head>
      <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
            <div className="text-6xl mb-6">❤️</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              情商测试
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              评估你的情绪感知、管理和表达能力，提升情商水平
            </p>
            <div className="bg-rose-50 rounded-lg p-6 mb-8">
              <p className="text-gray-700">
                此测试正在开发中，敬请期待！
              </p>
              <p className="text-sm text-gray-500 mt-2">
                预计包含 28 道题目，耗时约 12-15 分钟
              </p>
            </div>
            <Link 
              href="/plaza"
              className="inline-block px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
            >
              返回测试广场
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
