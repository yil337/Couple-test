import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { QUESTIONS } from '../src/lib/questions'
import { computePersonalProfile } from '../src/lib/scoring/personalProfile'
import { classifySternberg, classifyGottman } from '../src/lib/scoring/relationshipTypes'
import { QuestionId } from '../src/lib/types'
import { getQuestionThemeClass } from '../src/lib/questionThemes'

// 动态导入 Supabase 函数，确保只在客户端执行
const getSupabaseFunctions = () => {
  if (typeof window === 'undefined') {
    return {
      saveUserA: async () => ({ success: false, error: 'Client only' }),
      saveUserB: async () => ({ success: false, error: 'Client only' }),
      generatePairId: async () => ({ success: false, error: 'Client only' }),
    }
  }
  return require('../src/lib/supabase')
}

export default function Test() {
  const router = useRouter()
  const { pairId, userType } = router.query
  const [currentQuestion, setCurrentQuestion] = useState(0)
  // 答案格式：Record<QuestionId, string>，如 { Q1: 'A', Q2: 'B', ... }
  const [answers, setAnswers] = useState<Record<QuestionId, string>>({} as Record<QuestionId, string>)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inRelationship, setInRelationship] = useState<boolean | null>(null) // null: 未选择, true: 是, false: 否
  const [showRelationshipQuestion, setShowRelationshipQuestion] = useState(false) // 是否显示关系状态询问页

  const handleAnswer = (optionKey: string) => {
    if (showRelationshipQuestion) {
      // 关系状态询问页不需要保存答案到answers
      return
    }
    const question = QUESTIONS[currentQuestion]
    setAnswers(prev => ({
      ...prev,
      [question.id]: optionKey
    }))
  }

  const handleNext = () => {
    // 如果是关系状态询问页
    if (showRelationshipQuestion) {
      if (inRelationship === null) {
        setError('请先选择答案')
        return
      }
      setError(null)
      // 如果选择"否"，直接跳到提交
      if (!inRelationship) {
        handleSubmit()
        return
      }
      // 如果选择"是"，继续到Q24（索引23）
      setShowRelationshipQuestion(false)
      setCurrentQuestion(23)  // Q24的索引是23
      return
    }
    
    const question = QUESTIONS[currentQuestion]
    if (!answers[question.id]) {
      setError('请先选择答案')
      return
    }
    setError(null)
    // 如果当前是Q23（索引22），下一步应该显示关系状态询问页
    if (currentQuestion === 22) {
      setShowRelationshipQuestion(true)
    } else if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    // 如果当前在关系状态询问页，返回到Q23
    if (showRelationshipQuestion) {
      setShowRelationshipQuestion(false)
      setCurrentQuestion(22)  // 返回到Q23（索引22）
      return
    }
    // 如果当前在Q24（索引23），返回到关系状态询问页
    if (currentQuestion === 23 && inRelationship === true) {
      setShowRelationshipQuestion(true)
      return
    }
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    // STRICT: 确保只在客户端执行
    if (typeof window === 'undefined') {
      setError('此操作只能在浏览器中执行')
      return
    }

    // 检查是否所有问题都已回答
    // 如果不在关系中，只需要回答Q1-Q23
    const questionsToAnswer = inRelationship === true ? QUESTIONS : QUESTIONS.slice(0, 23)
    const allAnswered = questionsToAnswer.every(q => answers[q.id])
    if (!allAnswered) {
      // 找出未回答的题目用于调试
      const unanswered = questionsToAnswer.filter(q => !answers[q.id])
      console.log('未回答的题目:', unanswered.map(q => q.id))
      setError('请回答所有问题')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // 动态获取 Supabase 函数
      const { saveUserA, saveUserB, generatePairId } = getSupabaseFunctions()

      // 计算个人画像（基于 Q1-Q23）
      const personalProfile = computePersonalProfile(answers)
      
      // 分类 Sternberg 和 Gottman 类型
      const sternbergType = classifySternberg(personalProfile.sternbergVector)
      const gottmanType = classifyGottman(personalProfile.gottmanVector)
      
      // 提取 Social Exchange 答案（Q24-Q26）
      // 如果不在关系中，使用默认值
      const socialExchange = inRelationship ? {
        q24: parseInt(answers['Q24'] || '3'),
        q25: parseInt(answers['Q25'] || '3'),
        q26: parseInt(answers['Q26'] || '3')
      } : {
        q24: 3,
        q25: 3,
        q26: 3
      }

      // 准备用户数据
      const userData = {
        // 原始答案
        answers: QUESTIONS.map(q => ({
          questionId: q.id,
          selectedOption: answers[q.id] || ''
        })),
        
        // 个人画像
        personalProfile: {
          primaryLoveStyle: personalProfile.primaryLoveStyle,
          primaryAttachment: personalProfile.primaryAttachment,
          animal: personalProfile.animal,
          loveStyleScores: personalProfile.loveStyleScores,
          attachmentScores: personalProfile.attachmentScores,
          loveLanguageScores: personalProfile.loveLanguageScores,
          sternbergVector: personalProfile.sternbergVector,
          gottmanVector: personalProfile.gottmanVector
        },
        
        // 分类结果
        sternbergType,
        gottmanType,
        
        // Social Exchange
        socialExchange,
        
        // 兼容旧格式（用于向后兼容）
        resultKey: `${personalProfile.primaryLoveStyle}-${personalProfile.primaryAttachment}`,
        resultName: personalProfile.animal,
        resultDesc: `${personalProfile.primaryLoveStyle} × ${personalProfile.primaryAttachment}`,
        styleScores: personalProfile.loveStyleScores,
        attachScores: personalProfile.attachmentScores
      }

      // If this is a pair test (userB)
      if (pairId && userType === 'B') {
        const saveResult = await saveUserB(pairId as string, userData)
        if (saveResult.success) {
          // 用户B先跳转到单人结果页面，传递pairId和userType参数
          router.push(`/result?testId=${encodeURIComponent(testId)}&pairId=${encodeURIComponent(pairId as string)}&userType=B`)
        } else {
          // 显示详细错误信息
          let errorMsg = '保存结果失败'
          if (saveResult.error) {
            if (typeof saveResult.error === 'string') {
              errorMsg = `保存结果失败: ${saveResult.error}`
            } else if (saveResult.error.message) {
              errorMsg = `保存结果失败: ${saveResult.error.message}`
            } else {
              errorMsg = `保存结果失败: ${JSON.stringify(saveResult.error)}`
            }
          }
          console.error('[Test] Save userB failed:', saveResult)
          setError(errorMsg)
          setIsSubmitting(false)
        }
      } else {
        // Single user test - generate pairId and save as userA, then redirect to result
        console.log('[Test] Generating pair ID...')
        const pairResult = await generatePairId()
        console.log('[Test] Pair ID result:', pairResult)
        if (!pairResult.success) {
          // 正确处理错误对象，避免显示 [object Object]
          let errorMsg = '生成测试ID失败'
          if (pairResult.error) {
            if (typeof pairResult.error === 'string') {
              errorMsg = pairResult.error
            } else if (pairResult.error.message) {
              errorMsg = pairResult.error.message
            } else {
              errorMsg = JSON.stringify(pairResult.error)
            }
          }
          console.error('[Test] Failed to generate pair ID:', errorMsg, pairResult)
          setError(`生成测试ID失败: ${errorMsg}`)
          setIsSubmitting(false)
          return
        }
        
        const testId = pairResult.pairId
        const saveResult = await saveUserA(testId, userData)
        if (saveResult.success) {
          router.push(`/result?testId=${encodeURIComponent(testId)}`)
        } else {
          // 显示详细错误信息
          let errorMsg = '保存结果失败'
          if (saveResult.error) {
            if (typeof saveResult.error === 'string') {
              errorMsg = `保存结果失败: ${saveResult.error}`
            } else if (saveResult.error.message) {
              errorMsg = `保存结果失败: ${saveResult.error.message}`
            } else {
              errorMsg = `保存结果失败: ${JSON.stringify(saveResult.error)}`
            }
          }
          console.error('[Test] Save userA failed:', saveResult)
          setError(errorMsg)
          setIsSubmitting(false)
        }
      }
    } catch (err: any) {
      console.error('Submit error:', err)
      setError('提交失败，请重试: ' + (err.message || String(err)))
      setIsSubmitting(false)
    }
  }

  // 计算实际题目数量（23题 + 关系状态询问 + 如果选择"是"则3题）
  const totalQuestions = inRelationship === true ? 27 : 24 // 23题 + 1询问 + 3题（如果选择是）
  
  // 计算当前题目索引（用于显示）
  let currentQuestionIndex
  if (showRelationshipQuestion) {
    // 关系状态询问页
    currentQuestionIndex = 23  // 显示为问题24
  } else if (inRelationship === true && currentQuestion >= 23) {
    // Q24-Q26（索引23-25），显示为问题25-27
    currentQuestionIndex = currentQuestion + 1  // Q24(23)显示为25, Q25(24)显示为26, Q26(25)显示为27
  } else {
    // Q1-Q23（索引0-22），显示为问题1-23
    currentQuestionIndex = currentQuestion  // 显示为问题1-23
  }
  const progress = inRelationship === false ? 100 : ((currentQuestionIndex + 1) / totalQuestions) * 100
  
  // 如果是关系状态询问页
  if (showRelationshipQuestion) {
    const allAnswered = inRelationship !== null
    
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-800 transition-colors mb-4 inline-block"
            >
              ← 返回首页
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              爱情动物人格测试
            </h1>
            <div className="text-sm text-gray-600 mb-4">
              问题 24 / {totalQuestions}
            </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-pink-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Relationship Status Question Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              请问您现在是否正处于一段亲密关系中？
            </h2>

            {/* Options */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setInRelationship(true)
                  setError(null)
                }}
                className={`quiz-option w-full text-left p-4 rounded-lg transition-all duration-200 ${
                  inRelationship === true
                    ? 'option-selected text-blue-900'
                    : 'text-gray-700'
                }`}
              >
                <span className="font-medium relative z-10">是</span>
              </button>
              <button
                onClick={() => {
                  setInRelationship(false)
                  setError(null)
                }}
                className={`quiz-option w-full text-left p-4 rounded-lg transition-all duration-200 ${
                  inRelationship === false
                    ? 'option-selected text-blue-900'
                    : 'text-gray-700'
                }`}
              >
                <span className="font-medium relative z-10">否</span>
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              上一题
            </button>

            <button
              onClick={handleNext}
              disabled={!allAnswered || isSubmitting}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                !allAnswered || isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-pink-500 text-white hover:bg-pink-600'
              }`}
            >
              {isSubmitting ? '提交中...' : inRelationship === false ? '提交答案' : '下一题'}
            </button>
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
      </div>
    )
  }

  // 如果不在关系状态询问页，获取当前题目
  const question = showRelationshipQuestion ? null : QUESTIONS[currentQuestion]
  // 计算需要回答的题目：如果不在关系中，只需要Q1-Q23；如果在关系中，需要Q1-Q26
  const questionsToAnswer = inRelationship === true 
    ? QUESTIONS 
    : QUESTIONS.slice(0, 23)
  const allAnswered = questionsToAnswer.every(q => answers[q.id])
  const currentAnswer = question ? answers[question.id] : null
  const isSocialExchangeQuestion = !showRelationshipQuestion && currentQuestion >= 23 // Q24, Q25, Q26
  
  // 判断是否是最后一道题：如果选择"是"，Q26（索引25）是最后一道；如果选择"否"，会在关系询问页直接提交
  const isLastQuestion = inRelationship === true 
    ? !showRelationshipQuestion && currentQuestion === 25  // Q26的索引是25，是最后一道
    : false  // 如果选择"否"，会在关系询问页直接提交

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-gray-600 hover:text-gray-800 transition-colors mb-4 inline-block"
          >
            ← 返回首页
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            爱情模型测试
          </h1>
          <div className="text-sm text-gray-600 mb-4">
            问题 {currentQuestionIndex + 1} / {totalQuestions}
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-pink-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Question Card */}
        {question && (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {question.text}
            </h2>
            {isSocialExchangeQuestion && (
              <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                本题目结果不会与您的伴侣共享
              </span>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option) => {
              const isSelected = currentAnswer === option.key
              const themeClass = getQuestionThemeClass(question.id)
              return (
                <button
                  key={option.key}
                  onClick={() => handleAnswer(option.key)}
                  className={`quiz-option w-full text-left p-4 rounded-lg transition-colors duration-200 ${themeClass} ${
                    isSelected
                      ? 'option-selected text-blue-900'
                      : 'text-gray-700'
                  }`}
                >
                  <span className="font-medium">{option.key}. {option.text}</span>
                </button>
              )
            })}
          </div>
        </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentQuestion === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            上一题
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                !allAnswered || isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-pink-500 text-white hover:bg-pink-600'
              }`}
            >
              {isSubmitting ? '提交中...' : '提交答案'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!currentAnswer}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                !currentAnswer
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-pink-500 text-white hover:bg-pink-600'
              }`}
            >
              下一题
            </button>
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
