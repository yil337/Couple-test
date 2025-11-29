import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { computeMatchScore } from '../../src/lib/scoring/matchScore'
import { FullProfile } from '../../src/lib/types'
import { getAnimalReport } from '../../src/lib/animalReports'

// 动态导入 Supabase 函数，确保只在客户端执行
const getSupabaseFunctions = () => {
  if (typeof window === 'undefined') {
    return {
      getPairData: async () => ({ success: false, error: 'Client only' }),
    }
  }
  return require('../../src/lib/supabase')
}

export default function Match() {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userA, setUserA] = useState<any>(null)
  const [userB, setUserB] = useState<any>(null)
  const [matchResult, setMatchResult] = useState<any>(null)

  useEffect(() => {
    // STRICT: 确保只在客户端执行
    if (typeof window === 'undefined') return
    if (!router.isReady || !id) return

    const fetchData = async () => {
      try {
        const { getPairData } = getSupabaseFunctions()
        const result = await getPairData(id as string)
        if (result.success) {
          setUserA(result.data.userA)
          setUserB(result.data.userB)

          if (!result.data.userA) {
            setError('配对数据不完整')
          } else if (!result.data.userB) {
            setError('等待另一方完成测试')
          } else {
            // 构建 FullProfile
            const profileA: FullProfile = {
              ...result.data.userA.personalProfile,
              socialExchange: result.data.userA.socialExchange || { q24: 3, q25: 3, q26: 3 }
            }
            const profileB: FullProfile = {
              ...result.data.userB.personalProfile,
              socialExchange: result.data.userB.socialExchange || { q24: 3, q25: 3, q26: 3 }
            }
            
            // 计算匹配度
            const match = computeMatchScore(profileA, profileB)
            setMatchResult(match)
          }
        } else {
          setError(result.error || '无法加载配对数据')
        }
      } catch (err: any) {
        console.error('Fetch match data error:', err)
        setError('加载失败，请重试: ' + (err.message || String(err)))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, router.isReady])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-6">
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

  if (!userA || !userB || !matchResult) {
    return null
  }

  const animalReportA = getAnimalReport(userA.personalProfile?.animal || userA.resultName || '海豚')
  const animalReportB = getAnimalReport(userB.personalProfile?.animal || userB.resultName || '海豚')

  // 类型名称映射
  const sternbergTypeNames: Record<string, string> = {
    LIKING: '喜欢',
    INFATUATION: '迷恋',
    EMPTY: '空洞',
    ROMANTIC: '浪漫',
    COMPANIONATE: '伙伴',
    FOOLISH: '愚昧',
    CONSUMMATE: '完全'
  }

  const gottmanTypeNames: Record<string, string> = {
    NONE: '健康',
    CRITICISM: '批评',
    DEFENSIVENESS: '防御',
    STONEWALLING: '冷战',
    CONTEMPT: '轻蔑'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link 
            href="/" 
            className="text-gray-600 hover:text-gray-800 transition-colors mb-4 inline-block"
          >
            ← 返回首页
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            匹配结果
          </h1>
        </div>

        {/* Match Score */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8 text-center">
          <div className="text-6xl font-bold text-pink-500 mb-2">
            {matchResult.total.toFixed(1)}%
          </div>
          <p className="text-xl text-gray-600 mb-6">匹配度</p>
          
          {/* CP Animals */}
          <div className="mb-6">
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {matchResult.cpName}
            </div>
            <div className="text-lg text-gray-600">
              {matchResult.nickname}
            </div>
          </div>
        </div>

        {/* Match Score Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">匹配度详情</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-800">Sternberg 三角理论</div>
                <div className="text-sm text-gray-600">
                  {sternbergTypeNames[matchResult.sternbergTypeA] || matchResult.sternbergTypeA} × 
                  {' '}{sternbergTypeNames[matchResult.sternbergTypeB] || matchResult.sternbergTypeB}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {(matchResult.sternberg.raw * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">权重: {matchResult.sternberg.weight}%</div>
                <div className="text-sm text-gray-500">贡献: {matchResult.sternberg.contribution.toFixed(1)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-800">Gottman 四骑士</div>
                <div className="text-sm text-gray-600">
                  {gottmanTypeNames[matchResult.gottmanTypeA] || matchResult.gottmanTypeA} × 
                  {' '}{gottmanTypeNames[matchResult.gottmanTypeB] || matchResult.gottmanTypeB}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {(matchResult.gottman.raw * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">权重: {matchResult.gottman.weight}%</div>
                <div className="text-sm text-gray-500">贡献: {matchResult.gottman.contribution.toFixed(1)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-800">Social Exchange 理论</div>
                <div className="text-sm text-gray-600">关系投入与满意度</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  {(matchResult.socialExchange.raw * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">权重: {matchResult.socialExchange.weight}%</div>
                <div className="text-sm text-gray-500">贡献: {matchResult.socialExchange.contribution.toFixed(1)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-800">动物爱情匹配</div>
                <div className="text-sm text-gray-600">
                  {matchResult.animalA} × {matchResult.animalB}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">
                  {(matchResult.animalLove.raw * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">权重: {matchResult.animalLove.weight}%</div>
                <div className="text-sm text-gray-500">贡献: {matchResult.animalLove.contribution.toFixed(1)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* User Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* User A */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">用户A</h3>
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-bold px-4 py-2 rounded-lg mb-4 text-center">
              {userA.personalProfile?.animal || userA.resultName || '未知'}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {animalReportA.loveStyle} × {animalReportA.attachment}
            </div>
            <p className="text-gray-700 text-sm">{animalReportA.expression}</p>
          </div>

          {/* User B */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">用户B</h3>
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-bold px-4 py-2 rounded-lg mb-4 text-center">
              {userB.personalProfile?.animal || userB.resultName || '未知'}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {animalReportB.loveStyle} × {animalReportB.attachment}
            </div>
            <p className="text-gray-700 text-sm">{animalReportB.expression}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-center"
          >
            回到首页
          </Link>
          <Link
            href="/test"
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-center"
          >
            重新测试
          </Link>
        </div>
      </div>
    </div>
  )
}
