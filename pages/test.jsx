import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { QUESTIONS } from '../src/lib/types'
import { calculateType } from '../src/lib/calculateType'

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
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = QUESTIONS[currentQuestion].options[optionIndex]
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (answers[currentQuestion] === null) {
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

    // Check if all questions are answered
    if (answers.some(answer => answer === null)) {
      setError('请回答所有问题')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // 动态获取 Supabase 函数
      const { saveUserA, saveUserB, generatePairId } = getSupabaseFunctions()

      // Calculate type
      const result = calculateType(answers)

      // Prepare user data
      const userData = {
        answers: answers.map((answer, index) => ({
          questionId: QUESTIONS[index].id,
          selectedOption: answer,
        })),
        styleScores: result.styleScores,
        attachScores: result.attachScores,
        resultKey: result.typeKey,
        resultName: result.typeName,
        resultDesc: result.typeDesc,
      }

      // If this is a pair test (userB)
      if (pairId && userType === 'B') {
        const saveResult = await saveUserB(pairId, userData)
        if (saveResult.success) {
          router.push(`/match/${pairId}`)
        } else {
          setError('保存结果失败，请重试')
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
          setError('保存结果失败，请重试')
          setIsSubmitting(false)
        }
      }
    } catch (err) {
      console.error('Submit error:', err)
      setError('提交失败，请重试: ' + (err.message || String(err)))
      setIsSubmitting(false)
    }
  }

  const question = QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100
  const allAnswered = !answers.some(answer => answer === null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
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
            性格测试
          </h1>
          <div className="text-sm text-gray-600 mb-4">
            问题 {currentQuestion + 1} / {QUESTIONS.length}
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
            {question.options.map((option, index) => {
              const isSelected = answers[currentQuestion] === option
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-pink-500 bg-pink-50 text-pink-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-pink-300 hover:bg-pink-50'
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
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
              disabled={answers[currentQuestion] === null}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                answers[currentQuestion] === null
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
