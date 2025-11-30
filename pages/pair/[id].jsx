import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

// 动态导入 Supabase 函数，确保只在客户端执行
const getSupabaseFunctions = () => {
  if (typeof window === 'undefined') {
    return {
      getPairData: async () => ({ success: false, error: 'Client only' }),
    }
  }
  return require('../../src/lib/supabase')
}

export default function Pair() {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userA, setUserA] = useState(null)
  const [userB, setUserB] = useState(null)

  useEffect(() => {
    // STRICT: 确保只在客户端执行
    if (typeof window === 'undefined') return
    if (!router.isReady || !id) return

    const fetchPairData = async () => {
      try {
        const { getPairData } = getSupabaseFunctions()
        const result = await getPairData(id)
        if (result.success) {
          setUserA(result.data.userA)
          setUserB(result.data.userB)
          
          // If userB already exists, redirect to match page
          if (result.data.userB) {
            router.push(`/match/${id}`)
            return
          }

          // If userA doesn't exist, show error
          if (!result.data.userA) {
            setError('配对链接无效')
          }
        } else {
          setError(result.error || '无法加载配对信息')
        }
      } catch (err) {
        console.error('Fetch pair data error:', err)
        setError('加载失败，请重试: ' + (err.message || String(err)))
      } finally {
        setLoading(false)
      }
    }

    fetchPairData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, router.isReady])

  const handleStartTest = () => {
    // 重定向到测试页面，传递 pairId 和 userType
    router.push(`/test?pairId=${id}&userType=B`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
          <Link 
            href="/" 
            className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors inline-block"
          >
            返回首页
          </Link>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            你正在与对方配对
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            对方已经完成了测试，现在轮到你啦！
            <br />
            完成测试后，你们将看到彼此的匹配结果。
          </p>
          
          {userA && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">对方的类型</p>
              <p className="text-2xl font-bold text-pink-600">{userA.resultName}</p>
            </div>
          )}

          <button
            onClick={handleStartTest}
            className="w-full px-8 py-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium text-lg"
          >
            开始你的测试
          </button>

          <Link
            href="/"
            className="block mt-4 text-gray-600 hover:text-gray-800 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
      
      {/* 商务合作 */}
      <div className="text-center mt-8 pb-4">
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
  )
}
