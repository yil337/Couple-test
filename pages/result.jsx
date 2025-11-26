import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { TYPE_MAP } from '../src/lib/types'
import { getBaseUrl } from '../src/lib/utils'

// Dynamic import to prevent SSR execution
const getSupabaseFunctions = () => {
  if (typeof window === 'undefined') {
    return {
      getTestResult: async () => ({ success: false, error: 'Client only' }),
      generatePairId: async () => ({ success: false, error: 'Client only' }),
      saveUserA: async () => ({ success: false, error: 'Client only' }),
    }
  }
  return require('../src/lib/supabase')
}

export default function Result() {
  const router = useRouter()
  const { testId } = router.query
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pairId, setPairId] = useState(null)
  const [pairLink, setPairLink] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)
  const [savingPair, setSavingPair] = useState(false)

  useEffect(() => {
    // STRICT: 确保只在客户端执行
    if (typeof window === 'undefined') return
    if (!router.isReady) return

    if (!testId) {
      setError('缺少测试ID')
      setLoading(false)
      return
    }

    // Decode testId if it's URL encoded
    const decodedTestId = typeof testId === 'string' ? decodeURIComponent(testId) : testId

    const fetchResult = async () => {
      try {
        const { getTestResult } = getSupabaseFunctions()
        const resultData = await getTestResult(decodedTestId)
        if (resultData.success) {
          setResult(resultData.data)
        } else {
          setError('无法加载测试结果')
        }
      } catch (err) {
        console.error('Fetch result error:', err)
        setError('加载失败，请重试: ' + (err.message || String(err)))
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [testId, router.isReady])

  const handleGeneratePair = async () => {
    // STRICT: 确保只在客户端执行
    if (typeof window === 'undefined') {
      setError('此操作只能在浏览器中执行')
      return
    }

    if (!result) return

    setSavingPair(true)
    setError(null)

    try {
      const { generatePairId, saveUserA } = getSupabaseFunctions()
      // Generate pair ID
      const pairResult = await generatePairId()
      if (!pairResult.success) {
        setError('生成配对ID失败')
        setSavingPair(false)
        return
      }

      const newPairId = pairResult.pairId

      // Save userA data to the pair
      const userData = {
        answers: result.answers,
        styleScores: result.styleScores,
        attachScores: result.attachScores,
        resultKey: result.resultKey,
        resultName: result.resultName,
        resultDesc: result.resultDesc,
      }

      const saveResult = await saveUserA(newPairId, userData)
      if (saveResult.success) {
        setPairId(newPairId)
        const baseUrl = getBaseUrl()
        const link = `${baseUrl}/pair/${newPairId}`
        setPairLink(link)
      } else {
        setError('保存配对数据失败')
      }
    } catch (err) {
      console.error('Generate pair error:', err)
      setError('生成配对链接失败')
    } finally {
      setSavingPair(false)
    }
  }

  const handleCopyLink = async () => {
    if (!pairLink) return

    try {
      await navigator.clipboard.writeText(pairLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error('Copy error:', err)
      setError('复制失败，请手动复制')
    }
  }

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

  if (error && !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error || '未找到测试结果'}
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

  const typeInfo = TYPE_MAP[result?.resultKey] || {
    name: result?.resultName || '未知型',
    desc: result?.resultDesc || '无法确定类型'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link 
            href="/" 
            className="text-gray-600 hover:text-gray-800 transition-colors mb-4 inline-block"
          >
            ← 返回首页
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            你的性格类型
          </h1>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Result Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white text-5xl font-bold px-8 py-4 rounded-lg mb-6">
              {typeInfo.name}
            </div>
            <div className="text-gray-600 text-sm mb-4">
              类型代码: {result?.resultKey}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">类型描述</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {typeInfo.desc}
            </p>
          </div>

          {/* Score Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* LoveStyle Scores */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">爱情风格得分</h3>
              <div className="space-y-2">
                {Object.entries(result?.styleScores || {}).map(([style, score]) => (
                  <div key={style} className="flex items-center justify-between">
                    <span className="text-gray-600">
                      {style === 'P' ? '激情' : 
                       style === 'G' ? '游戏' :
                       style === 'F' ? '友谊' :
                       style === 'U' ? '实用' :
                       style === 'C' ? '痴狂' :
                       style === 'A' ? '利他' : style}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-pink-500 h-2 rounded-full"
                          style={{ width: `${(score / 15) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-800 font-medium w-8 text-right">{score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachment Scores */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">依恋风格得分</h3>
              <div className="space-y-2">
                {Object.entries(result?.attachScores || {}).map(([attach, score]) => (
                  <div key={attach} className="flex items-center justify-between">
                    <span className="text-gray-600">
                      {attach === 'S' ? '安全' :
                       attach === 'A' ? '回避' :
                       attach === 'X' ? '焦虑' :
                       attach === 'F' ? '恐惧' : attach}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${(score / 15) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-800 font-medium w-8 text-right">{score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pair Invitation Section */}
        {!pairId && !pairLink && (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              想要配对测试？
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              生成一个配对链接，邀请你的伴侣一起完成测试，查看你们的匹配结果
            </p>
            <button
              onClick={handleGeneratePair}
              disabled={savingPair}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                savingPair
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-pink-500 text-white hover:bg-pink-600'
              }`}
            >
              {savingPair ? '生成中...' : '生成情侣配对链接'}
            </button>
          </div>
        )}

        {/* Pair Link Display */}
        {pairLink && (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              配对链接已生成
            </h2>
            <p className="text-gray-600 mb-4 text-center text-sm">
              将以下链接发送给你的伴侣，让他们完成测试
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border-2 border-dashed border-gray-300">
              <p className="text-sm text-gray-700 break-all">{pairLink}</p>
            </div>
            <button
              onClick={handleCopyLink}
              className="w-full px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
            >
              {linkCopied ? '✓ 已复制' : '复制链接'}
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
