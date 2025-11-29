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

  const handleAnswer = (optionKey: string) => {
    const question = QUESTIONS[currentQuestion]
    setAnswers(prev => ({
      ...prev,
      [question.id]: optionKey
    }))
  }

  const handleNext = () => {
    const question = QUESTIONS[currentQuestion]
    if (!answers[question.id]) {
      setError('请先选择答案')
      return
    }
    setError(null)
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
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
    const allAnswered = QUESTIONS.every(q => answers[q.id])
    if (!allAnswered) {
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
      const socialExchange = {
        q24: parseInt(answers['Q24'] || '3'),
        q25: parseInt(answers['Q25'] || '3'),
        q26: parseInt(answers['Q26'] || '3')
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
          router.push(`/match/${pairId}`)
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

  const question = QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100
  const allAnswered = QUESTIONS.every(q => answers[q.id])
  const currentAnswer = answers[question.id]

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
            问题 {currentQuestion + 1} / {QUESTIONS.length}
            {currentQuestion >= 23 && (
              <span className="ml-2 text-pink-600">（Social Exchange 题）</span>
            )}
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
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {question.text}
          </h2>

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

          {currentQuestion === QUESTIONS.length - 1 ? (
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
    </div>
  )
}
