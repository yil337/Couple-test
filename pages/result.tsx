import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getAnimalReport } from '../src/lib/animalReports'
import { AnimalType } from '../src/lib/types'
import { getAnimalCardStyle, getAnimalTypes } from '../src/lib/animalCardStyles'

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
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pairId, setPairId] = useState<string | null>(null)
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
          console.log('[Result] Fetched data:', resultData.data)
          // 确保数据是对象格式（Supabase JSONB 可能返回字符串）
          const data = typeof resultData.data === 'string' 
            ? JSON.parse(resultData.data) 
            : resultData.data
          console.log('[Result] Parsed data:', data)
          setResult(data)
        } else {
          console.error('[Result] Failed to fetch:', resultData.error)
          setError('无法加载测试结果: ' + (resultData.error || ''))
        }
      } catch (err: any) {
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
      const userData = result

      const saveResult = await saveUserA(newPairId, userData)
      if (saveResult.success) {
        setPairId(newPairId)
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
        const link = `${baseUrl}/pair/${newPairId}`
        setPairLink(link)
      } else {
        setError('保存配对数据失败')
      }
    } catch (err: any) {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error && !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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

  // 获取个人画像数据
  const personalProfile = result?.personalProfile || {}
  const animal = personalProfile.animal || result?.resultName || '海豚'
  const animalReport = getAnimalReport(animal as any)
  
  // 获取动物的爱情风格和依恋类型
  const { loveStyle, attachment } = getAnimalTypes(animal as AnimalType)
  
  // 获取Sternberg向量（如果有）
  const sternbergVector = personalProfile.sternbergVector || {
    intimacy: 0,
    passion: 0,
    commitment: 0
  }
  
  // 获取完整的卡片样式配置
  const cardStyle = getAnimalCardStyle(
    animal as AnimalType,
    loveStyle,
    attachment,
    sternbergVector
  )

  // 获取得分数据
  const loveStyleScores = personalProfile.loveStyleScores || result?.styleScores || {}
  const attachmentScores = personalProfile.attachmentScores || result?.attachScores || {}
  const loveLanguageScores = personalProfile.loveLanguageScores || {}

  // 获取类型
  const primaryLoveStyle = personalProfile.primaryLoveStyle || 'PASSION'
  const primaryAttachment = personalProfile.primaryAttachment || 'SECURE'
  const sternbergType = result?.sternbergType || ''
  const gottmanType = result?.gottmanType || ''

  // 类型名称映射
  const loveStyleNames: Record<string, string> = {
    PASSION: '激情型',
    GAME: '游戏型',
    FRIENDSHIP: '友谊型',
    PRAGMATIC: '实用型',
    MANIA: '痴狂型',
    AGAPE: '利他型'
  }

  const attachmentNames: Record<string, string> = {
    SECURE: '安全型',
    AVOIDANT: '回避型',
    ANXIOUS: '焦虑型',
    FEARFUL: '恐惧型'
  }

  const loveLanguageNames: Record<string, string> = {
    WORDS: '肯定的言辞',
    QUALITY_TIME: '精心的时刻',
    ACTS: '服务的行动',
    PHYSICAL_HIGH: '身体的接触（高）',
    PHYSICAL_LOW: '身体的接触（低）'
  }

  return (
    <div className="min-h-screen py-12 px-4">
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
            你的爱情画像
          </h1>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Animal Result Card */}
        {result && (
          <div className={`animal-card ${cardStyle.texture} ${cardStyle.border.glow} p-8 md:p-12 mb-8 transition-all relative`}>
            <div className="text-center mb-8">
              <div className={`inline-block bg-white text-gray-900 text-5xl font-bold px-8 py-4 rounded-2xl mb-6 transform hover:scale-105 transition-transform ${cardStyle.border.glow}`}>
                <span className={`${cardStyle.emoji.size} ${cardStyle.emoji.position} ${cardStyle.emoji.transform} ${cardStyle.emoji.shadow} inline-block`}>
                  {animalReport.emoji}
                </span>
                <span>{animal}</span>
              </div>
              <div className={`${cardStyle.tag.class} inline-block px-4 py-2 text-gray-800 text-sm font-medium mb-4`}>
                <span className="mr-1">{cardStyle.theme.icon}</span>
                {loveStyleNames[primaryLoveStyle] || primaryLoveStyle} × {attachmentNames[primaryAttachment] || primaryAttachment}
              </div>
            </div>

            {/* Animal Description */}
            {animalReport.description && (
              <div className="bg-white bg-opacity-80 rounded-lg p-6 mb-8 backdrop-blur-sm relative z-10">
                <p className="text-gray-800 text-lg leading-relaxed">
                  {animalReport.description}
                </p>
              </div>
            )}

            {/* Theory-Based Report Blocks */}
            <div className="space-y-6 mb-8 relative z-10">
              {/* Lee's Love Style */}
              <div className="bg-white bg-opacity-80 rounded-lg p-6 backdrop-blur-sm border-l-4 border-pink-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Lee's Love Style（李的爱情风格理论）
                </h3>
                <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                  {animalReport.loveStyle}
                </div>
              </div>

              {/* Adult Attachment Theory */}
              <div className="bg-white bg-opacity-80 rounded-lg p-6 backdrop-blur-sm border-l-4 border-purple-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Adult Attachment Theory（成人依恋理论）
                </h3>
                <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                  {animalReport.attachment}
                </div>
              </div>

              {/* Five Love Languages */}
              <div className="bg-white bg-opacity-80 rounded-lg p-6 backdrop-blur-sm border-l-4 border-blue-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Five Love Languages（五种爱的语言）
                </h3>
                <div className="text-gray-700 text-base leading-relaxed">
                  {animalReport.loveLanguage}
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-80 rounded-lg p-6 mb-8 backdrop-blur-sm relative z-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">亲密关系中的表达倾向</h2>
              <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                {animalReport.expression}
              </p>
            </div>

            <div className="bg-white bg-opacity-80 rounded-lg p-6 mb-8 backdrop-blur-sm relative z-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">亲密关系中的需求与不安全感来源</h2>
              <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                {animalReport.needs}
              </p>
            </div>

            <div className="bg-white bg-opacity-80 rounded-lg p-6 mb-8 backdrop-blur-sm relative z-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">给亲密关系中伴侣的建议</h2>
              <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                {animalReport.advice}
              </p>
            </div>

            {/* Score Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
              {/* LoveStyle Scores */}
              <div className="bg-white bg-opacity-80 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">爱情风格得分</h3>
                <div className="space-y-2">
                  {Object.entries(loveStyleScores).map(([style, score]: [string, any]) => (
                    <div key={style} className="flex items-center justify-between">
                      <span className="text-gray-600">
                        {loveStyleNames[style] || style}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-pink-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((score / 10) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-800 font-medium w-8 text-right">{score.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attachment Scores */}
              <div className="bg-white bg-opacity-80 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">依恋风格得分</h3>
                <div className="space-y-2">
                  {Object.entries(attachmentScores).map(([attach, score]: [string, any]) => (
                    <div key={attach} className="flex items-center justify-between">
                      <span className="text-gray-600">
                        {attachmentNames[attach] || attach}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((score / 10) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-800 font-medium w-8 text-right">{score.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Love Language Scores */}
            {Object.keys(loveLanguageScores).length > 0 && (
              <div className="mb-8 bg-white bg-opacity-80 rounded-lg p-6 backdrop-blur-sm relative z-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">爱的语言得分</h3>
                <div className="space-y-2">
                  {Object.entries(loveLanguageScores).map(([lang, score]: [string, any]) => (
                    <div key={lang} className="flex items-center justify-between">
                      <span className="text-gray-600">
                        {loveLanguageNames[lang] || lang}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((score / 10) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-800 font-medium w-8 text-right">{score.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sternberg & Gottman Types */}
            {(sternbergType || gottmanType) && (
              <div className="space-y-6 mb-8 relative z-10">
                {sternbergType && (
                  <div className="bg-white bg-opacity-80 rounded-lg p-6 backdrop-blur-sm border-l-4 border-green-500 pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Sternberg's Triangular Theory of Love（斯滕伯格爱情三角理论）
                    </h3>
                    <p className="text-gray-700 text-base leading-relaxed">
                      根据你的回答，你的爱情类型是：<strong className="text-gray-900">{sternbergType}</strong>
                    </p>
                  </div>
                )}
                {gottmanType && (
                  <div className="bg-white bg-opacity-80 rounded-lg p-6 backdrop-blur-sm border-l-4 border-orange-500 pl-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Gottman Method（戈特曼方法）
                    </h3>
                    <p className="text-gray-700 text-base leading-relaxed">
                      根据你的回答，你的关系沟通类型是：<strong className="text-gray-900">{gottmanType}</strong>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

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
