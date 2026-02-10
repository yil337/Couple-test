import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import SharePoster from '../../components/SharePoster'

// 动态导入 Supabase 函数，确保只在客户端执行
const getSupabaseFunctions = () => {
  if (typeof window === 'undefined') {
    return {
      getPairData: async () => ({ success: false, error: 'Client only' }),
      getTestResult: async () => ({ success: false, error: 'Client only' }),
    }
  }
  return require('../../src/lib/supabase')
}

export default function SharePage() {
  const router = useRouter()
  const { pairId, user } = router.query
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    // STRICT: 确保只在客户端执行
    if (typeof window === 'undefined') return
    if (!router.isReady || !pairId) return

    const fetchData = async () => {
      try {
        const { getPairData, getTestResult } = getSupabaseFunctions()
        let result

        // If user parameter is specified, get specific user data
        if (user === 'A' || user === 'B') {
          const pairResult = await getPairData(pairId)
          if (pairResult.success) {
            result = {
              success: true,
              data: user === 'A' ? pairResult.data.userA : pairResult.data.userB
            }
          } else {
            result = pairResult
          }
        } else {
          // Default: try to get userA first, then userB
          const pairResult = await getPairData(pairId)
          if (pairResult.success) {
            result = {
              success: true,
              data: pairResult.data.userA || pairResult.data.userB
            }
          } else {
            // Fallback to getTestResult for backward compatibility
            result = await getTestResult(pairId)
          }
        }

        if (result.success && result.data) {
          setUserData(result.data)
        } else {
          setError('无法加载测试结果')
        }
      } catch (err) {
        console.error('Fetch share data error:', err)
        setError('加载失败，请重试: ' + (err.message || String(err)))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [pairId, user, router.isReady])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">加载中...</p>
        </div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-lg">
            {error || '未找到测试结果'}
          </div>
          <Link
            href="/plaza"
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 inline-block font-medium"
          >
            返回测试广场
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link
            href="/plaza"
            className="text-gray-600 hover:text-gray-800 transition-colors mb-4 inline-block text-lg"
          >
            ← 返回首页
          </Link>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
            分享你的性格类型
          </h1>
          <p className="text-gray-600 text-xl">
            生成精美的海报，分享到社交媒体
          </p>
        </div>

        {/* Share Poster Component */}
        <div className="flex justify-center">
          <SharePoster
            resultName={userData.resultName || '未知型'}
            resultDesc={userData.resultDesc || ''}
            resultKey={userData.resultKey || ''}
            styleScores={userData.styleScores || {}}
            attachScores={userData.attachScores || {}}
            avatarUrl={userData.avatarUrl}
          />
        </div>

        {/* Additional Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/result?testId=${pairId}`}
            className="px-6 py-3 bg-white text-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 text-center font-medium border-2 border-gray-200"
          >
            查看完整结果
          </Link>
          {userData && (
            <Link
              href={`/match/${pairId}`}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-center font-medium"
            >
              查看匹配结果
            </Link>
          )}
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


