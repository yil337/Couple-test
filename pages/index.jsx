import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          情侣性格测试
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          通过15个问题了解你的爱情风格和依恋类型
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/test" 
            className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            开始测试
          </Link>
        </div>
      </div>
    </div>
  )
}

