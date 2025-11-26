import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getPairData } from '../../src/lib/cloudbase'
import { TYPE_MAP, ANIMAL_MAP } from '../../src/lib/types'
import { calculateMatch, getDynamics, getStrengths, getRisks, getAdvice } from '../../src/lib/calculateMatch'

export default function Match() {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userA, setUserA] = useState(null)
  const [userB, setUserB] = useState(null)
  const [matchResult, setMatchResult] = useState(null)

  useEffect(() => {
    if (!router.isReady || !id) return

    const fetchData = async () => {
      try {
        const result = await getPairData(id)
        if (result.success) {
          setUserA(result.data.userA)
          setUserB(result.data.userB)

          if (!result.data.userA) {
            setError('配对数据不完整')
          } else if (!result.data.userB) {
            setError('等待另一方完成测试')
          } else {
            // Calculate match
            const match = calculateMatch(result.data.userA.resultKey, result.data.userB.resultKey)
            setMatchResult(match)
          }
        } else {
          setError(result.error || '无法加载配对数据')
        }
      } catch (err) {
        console.error('Fetch match data error:', err)
        setError('加载失败，请重试')
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

  const [aStyle, aAttach] = userA.resultKey.split('-')
  const [bStyle, bAttach] = userB.resultKey.split('-')

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
            {matchResult.score}%
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

        {/* User Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* User A */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">用户A</h3>
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-bold px-4 py-2 rounded-lg mb-4 text-center">
              {userA.resultName}
            </div>
            <div className="text-sm text-gray-600 mb-2">类型代码: {userA.resultKey}</div>
            <div className="text-sm text-gray-600 mb-4">动物: {matchResult.animalA}</div>
            <p className="text-gray-700">{userA.resultDesc}</p>
          </div>

          {/* User B */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">用户B</h3>
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-bold px-4 py-2 rounded-lg mb-4 text-center">
              {userB.resultName}
            </div>
            <div className="text-sm text-gray-600 mb-2">类型代码: {userB.resultKey}</div>
            <div className="text-sm text-gray-600 mb-4">动物: {matchResult.animalB}</div>
            <p className="text-gray-700">{userB.resultDesc}</p>
          </div>
        </div>

        {/* Analysis Sections */}
        <div className="space-y-6 mb-8">
          {/* Relationship Dynamics */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">关系动力结构</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {getDynamics(userA.resultKey, userB.resultKey)}
            </p>
          </div>

          {/* Strengths */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">优势</h2>
            <ul className="space-y-3">
              {getStrengths(aAttach, bAttach).map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span className="text-gray-700 text-lg">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">潜在风险</h2>
            <ul className="space-y-3">
              {getRisks(aAttach, bAttach).map((risk, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-yellow-500 mr-3 text-xl">⚠</span>
                  <span className="text-gray-700 text-lg">{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Advice */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">建议</h2>
            <ul className="space-y-3">
              {getAdvice(aAttach, bAttach).map((advice, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-3 text-xl">💡</span>
                  <span className="text-gray-700 text-lg">{advice}</span>
                </li>
              ))}
            </ul>
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
