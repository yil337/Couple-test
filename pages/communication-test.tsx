import Link from 'next/link'
import Head from 'next/head'

export default function CommunicationTest() {
  return (
    <>
      <Head>
        <title>沟通风格测试 - LY Analytics</title>
      </Head>
      <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
            <div className="text-6xl mb-6">💬</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              沟通风格测试
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              了解你的沟通偏好和风格，提升人际交往能力
            </p>
            <div className="bg-indigo-50 rounded-lg p-6 mb-8">
              <p className="text-gray-700">
                此测试正在开发中，敬请期待！
              </p>
              <p className="text-sm text-gray-500 mt-2">
                预计包含 22 道题目，耗时约 10-12 分钟
              </p>
            </div>
            <Link 
              href="/plaza"
              className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
            >
              返回测试广场
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
