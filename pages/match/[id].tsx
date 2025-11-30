import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { computeMatchScore } from '../../src/lib/scoring/matchScore'
import { FullProfile, AnimalType } from '../../src/lib/types'
import { getAnimalReport } from '../../src/lib/animalReports'
import { getSternbergReport, getGottmanReport, SternbergType, GottmanType } from '../../src/lib/relationshipReports'
import { QUESTIONS } from '../../src/lib/questions'
import { getBorderStyle, getAnimalCardStyle, getAnimalTypes } from '../../src/lib/animalCardStyles'
import { THEORY_INTRODUCTIONS } from '../../src/lib/theoryIntroductions'

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
  const [showTheoryModal, setShowTheoryModal] = useState(false)
  const [theoryModalContent, setTheoryModalContent] = useState<{ title: string; content: string } | null>(null)
  const [userB, setUserB] = useState<any>(null)
  const [matchResult, setMatchResult] = useState<any>(null)
  const [showAnswers, setShowAnswers] = useState(false)

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

  const animalA = (userA.personalProfile?.animal || userA.resultName || '海豚') as AnimalType
  const animalB = (userB.personalProfile?.animal || userB.resultName || '海豚') as AnimalType
  const animalReportA = getAnimalReport(animalA)
  const animalReportB = getAnimalReport(animalB)
  
  // 获取用户A和B的Sternberg向量（需要在前面定义，因为后面会用到）
  const sternbergVectorA = userA.personalProfile?.sternbergVector || { intimacy: 0, passion: 0, commitment: 0 }
  const sternbergVectorB = userB.personalProfile?.sternbergVector || { intimacy: 0, passion: 0, commitment: 0 }
  
  // 获取用户A和B的动物类型信息（用于生成卡片样式）
  const animalTypesA = getAnimalTypes(animalA)
  const animalTypesB = getAnimalTypes(animalB)
  
  // 获取用户A和B的完整卡片样式（包括光晕）
  const cardStyleA = getAnimalCardStyle(
    animalA,
    userA.personalProfile?.primaryLoveStyle || animalTypesA.loveStyle,
    userA.personalProfile?.primaryAttachment || animalTypesA.attachment,
    sternbergVectorA
  )
  const cardStyleB = getAnimalCardStyle(
    animalB,
    userB.personalProfile?.primaryLoveStyle || animalTypesB.loveStyle,
    userB.personalProfile?.primaryAttachment || animalTypesB.attachment,
    sternbergVectorB
  )

  // 获取 Sternberg 和 Gottman 类型报告
  const sternbergTypeA = (userA.personalProfile?.sternbergType || userA.sternbergType || matchResult.sternbergTypeA) as SternbergType
  const sternbergTypeB = (userB.personalProfile?.sternbergType || userB.sternbergType || matchResult.sternbergTypeB) as SternbergType
  const gottmanTypeA = (userA.personalProfile?.gottmanType || userA.gottmanType || matchResult.gottmanTypeA) as GottmanType
  const gottmanTypeB = (userB.personalProfile?.gottmanType || userB.gottmanType || matchResult.gottmanTypeB) as GottmanType

  // 获取详细报告（使用双方中更"需要关注"的类型，或者使用A的类型作为代表）
  const sternbergReport = getSternbergReport(sternbergTypeA)
  const gottmanReport = getGottmanReport(gottmanTypeA)

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

  // 爱情风格和依恋类型的中文名称映射
  const loveStyleNames: Record<string, string> = {
    PASSION: '激情',
    GAME: '游戏',
    FRIENDSHIP: '友谊',
    PRAGMATIC: '实用',
    MANIA: '痴狂',
    AGAPE: '利他'
  }

  const attachmentNames: Record<string, string> = {
    SECURE: '安全',
    AVOIDANT: '回避',
    ANXIOUS: '焦虑',
    FEARFUL: '恐惧'
  }

  // 获取用户A和B的简短类型标签
  const userAType = userA.personalProfile?.primaryLoveStyle 
    ? `${loveStyleNames[userA.personalProfile.primaryLoveStyle] || userA.personalProfile.primaryLoveStyle} × ${attachmentNames[userA.personalProfile?.primaryAttachment || 'SECURE'] || userA.personalProfile?.primaryAttachment || '安全'}`
    : `${animalReportA.loveStyle.split('\n')[0].replace(/Lee's Love Style（|）/g, '').split(' ')[0]} × ${animalReportA.attachment.split('\n')[0].replace(/Adult Attachment Theory（|）/g, '').split(' ')[0]}`

  const userBType = userB.personalProfile?.primaryLoveStyle
    ? `${loveStyleNames[userB.personalProfile.primaryLoveStyle] || userB.personalProfile.primaryLoveStyle} × ${attachmentNames[userB.personalProfile?.primaryAttachment || 'SECURE'] || userB.personalProfile?.primaryAttachment || '安全'}`
    : `${animalReportB.loveStyle.split('\n')[0].replace(/Lee's Love Style（|）/g, '').split(' ')[0]} × ${animalReportB.attachment.split('\n')[0].replace(/Adult Attachment Theory（|）/g, '').split(' ')[0]}`

  // 获取用户A和B的光晕样式（用于匹配度卡片的混合光晕）
  const borderStyleA = getBorderStyle(sternbergVectorA)
  const borderStyleB = getBorderStyle(sternbergVectorB)
  
  // 生成混合光晕的CSS类名（用于匹配度卡片）
  const matchCardGlowClass = `match-card-glow-${borderStyleA.glowClass.replace('card-glow-', '')}-${borderStyleB.glowClass.replace('card-glow-', '')}`

  return (
    <div className="min-h-screen py-12 px-4">
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
        <div className={`bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8 text-center ${matchCardGlowClass}`}>
          <div className="text-6xl font-bold text-pink-500 mb-2">
            {matchResult.total.toFixed(1)}%
          </div>
          <p className="text-xl text-gray-600 mb-6">匹配度</p>
          
          {/* CP Animals */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* 用户A的动物 */}
              <div className={`inline-block bg-white text-gray-900 text-4xl font-bold px-6 py-3 rounded-2xl transform hover:scale-105 transition-transform ${cardStyleA.border.glow}`}>
                <span className={`${cardStyleA.emoji.size} ${cardStyleA.emoji.position} ${cardStyleA.emoji.transform} ${cardStyleA.emoji.shadow} inline-block`}>
                  {animalReportA.emoji}
                </span>
                <span>{animalA}</span>
              </div>
              
              {/* 分隔符 */}
              <span className="text-3xl text-gray-400">×</span>
              
              {/* 用户B的动物 */}
              <div className={`inline-block bg-white text-gray-900 text-4xl font-bold px-6 py-3 rounded-2xl transform hover:scale-105 transition-transform ${cardStyleB.border.glow}`}>
                <span className={`${cardStyleB.emoji.size} ${cardStyleB.emoji.position} ${cardStyleB.emoji.transform} ${cardStyleB.emoji.shadow} inline-block`}>
                  {animalReportB.emoji}
                </span>
                <span>{animalB}</span>
              </div>
            </div>
            <div className="text-lg text-gray-600">
              {matchResult.nickname}
            </div>
          </div>
        </div>

        {/* 伴侣评估模型解析 */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">伴侣评估模型解析</h2>
          
          {/* Sternberg 详细解析 */}
          <div className="mb-8 border-l-4 border-green-500 pl-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              Sternberg: Triangular Theory of Love 爱情三角理论
              <button
                onClick={() => {
                  setTheoryModalContent({
                    title: THEORY_INTRODUCTIONS.sternberg.title,
                    content: THEORY_INTRODUCTIONS.sternberg.content
                  })
                  setShowTheoryModal(true)
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                title="查看完整介绍"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </h3>
            <div className="bg-white rounded-lg p-6 mb-4">
              <div className="text-2xl mb-4 flex items-center gap-2">
                {sternbergReport.emoji} {sternbergReport.name}
              </div>
              <p className="text-gray-700 text-lg font-semibold leading-relaxed mb-4">
                {sternbergReport.tone} {sternbergReport.advantages} {sternbergReport.risks}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-800 text-lg font-bold mb-2">建议：</p>
                <p className="text-gray-700 text-lg font-semibold leading-relaxed">
                  {sternbergReport.suggestions}
                </p>
              </div>
            </div>
          </div>

          {/* Gottman 详细解析 */}
          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              Gottman: Gottman Method 伴侣稳定性模型
              <button
                onClick={() => {
                  setTheoryModalContent({
                    title: THEORY_INTRODUCTIONS.gottman.title,
                    content: THEORY_INTRODUCTIONS.gottman.content
                  })
                  setShowTheoryModal(true)
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                title="查看完整介绍"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </h3>
            <div className="bg-white rounded-lg p-6">
              <div className="text-2xl mb-4 flex items-center gap-2">
                {gottmanReport.emoji} {gottmanReport.name}
              </div>
              <p className="text-gray-700 text-lg font-semibold leading-relaxed mb-4">
                {gottmanReport.tone} {gottmanReport.advantages} {gottmanReport.risks}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-800 text-lg font-bold mb-2">建议：</p>
                <p className="text-gray-700 text-lg font-semibold leading-relaxed">
                  {gottmanReport.suggestions}
                </p>
              </div>
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
            <h3 className="text-xl font-bold text-gray-800 mb-4">{userA?.nickname || '用户A'}</h3>
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-bold px-4 py-2 rounded-lg mb-4 text-center">
              {userA.personalProfile?.animal || userA.resultName || '未知'}
            </div>
            <div className="text-sm text-gray-600 mb-3">
              {userAType}
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{animalReportA.expression.replace(/？/g, '').replace(/\?/g, '')}</p>
          </div>

          {/* User B */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{userB?.nickname || '用户B'}</h3>
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-bold px-4 py-2 rounded-lg mb-4 text-center">
              {userB.personalProfile?.animal || userB.resultName || '未知'}
            </div>
            <div className="text-sm text-gray-600 mb-3">
              {userBType}
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{animalReportB.expression.replace(/？/g, '').replace(/\?/g, '')}</p>
          </div>
        </div>

        {/* Answers Section - Expandable */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="w-full flex items-center justify-between text-left focus:outline-none"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              📋 查看答题详情（1-23题）
            </h2>
            <span className="text-gray-500 text-lg">
              {showAnswers ? '▲' : '▼'}
            </span>
          </button>

          {showAnswers && (
            <div className="mt-6 animate-fadeIn">
              {/* 并排显示答题结果 */}
              <div className="space-y-4">
                {QUESTIONS.slice(0, 23).map((question, index) => {
                  const answerA = userA?.answers?.find((a: any) => a.questionId === question.id)
                  const answerB = userB?.answers?.find((a: any) => a.questionId === question.id)
                  const selectedOptionA = answerA?.selectedOption
                  const selectedOptionB = answerB?.selectedOption
                  const optionA = question.options.find(opt => opt.key === selectedOptionA)
                  const optionB = question.options.find(opt => opt.key === selectedOptionB)
                  
                  return (
                    <div key={question.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-semibold text-gray-700 mb-3">
                        问题 {index + 1}: {question.text}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* User A Answer */}
                        <div className="bg-white rounded-lg p-3 border-l-4 border-pink-500">
                          <div className="text-xs font-semibold text-pink-600 mb-1">
                            {userA?.nickname || '用户A'}
                          </div>
                          <div className="text-sm text-gray-700">
                            {optionA ? (
                              <span className="text-pink-600 font-medium">{optionA.key}. {optionA.text}</span>
                            ) : (
                              <span className="text-gray-400">未作答</span>
                            )}
                          </div>
                        </div>
                        {/* User B Answer */}
                        <div className="bg-white rounded-lg p-3 border-l-4 border-purple-500">
                          <div className="text-xs font-semibold text-purple-600 mb-1">
                            {userB?.nickname || '用户B'}
                          </div>
                          <div className="text-sm text-gray-700">
                            {optionB ? (
                              <span className="text-purple-600 font-medium">{optionB.key}. {optionB.text}</span>
                            ) : (
                              <span className="text-gray-400">未作答</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
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

      {/* 理论介绍模态框 */}
      {showTheoryModal && theoryModalContent && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowTheoryModal(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">{theoryModalContent.title}</h2>
              <button
                onClick={() => setShowTheoryModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-6">
              <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                {theoryModalContent.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
