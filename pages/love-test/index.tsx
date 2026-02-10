import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { QUESTIONS } from '../../src/lib/questions'
import { computePersonalProfile } from '../../src/lib/scoring/personalProfile'
import { classifySternberg, classifyGottman } from '../../src/lib/scoring/relationshipTypes'
import { QuestionId } from '../../src/lib/types'
import { getQuestionThemeClass } from '../../src/lib/questionThemes'

// 动态导入 Supabase 函数，确保只在客户端执行
const getSupabaseFunctions = () => {
  if (typeof window === 'undefined') {
    return {
      saveUserA: async () => ({ success: false, error: 'Client only' }),
      saveUserB: async () => ({ success: false, error: 'Client only' }),
      generatePairId: async () => ({ success: false, error: 'Client only' }),
    }
  }
  return require('../../src/lib/supabase')
}

export default function LoveTest() {
  const router = useRouter()
  const { pairId, userType } = router.query
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<QuestionId, string>>({} as Record<QuestionId, string>)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inRelationship, setInRelationship] = useState<boolean | null>(null)
  const [showRelationshipQuestion, setShowRelationshipQuestion] = useState(false)
  const [nickname, setNickname] = useState<string>('')
  const [showNicknameInput, setShowNicknameInput] = useState<boolean>(true)

  const handleAnswer = (optionKey: string) => {
    if (showRelationshipQuestion) {
      return
    }
    const question = QUESTIONS[currentQuestion]
    setAnswers(prev => ({
      ...prev,
      [question.id]: optionKey
    }))
  }

  const handleNext = () => {
    if (showRelationshipQuestion) {
      if (inRelationship === null) {
        setError('请先选择答案')
        return
      }
      setError(null)
      if (!inRelationship) {
        handleSubmit()
        return
      }
      setShowRelationshipQuestion(false)
      setCurrentQuestion(23)
      return
    }
    
    const question = QUESTIONS[currentQuestion]
    if (!answers[question.id]) {
      setError('请先选择答案')
      return
    }
    setError(null)
    if (currentQuestion === 22) {
      setShowRelationshipQuestion(true)
    } else if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (showRelationshipQuestion) {
      setShowRelationshipQuestion(false)
      setCurrentQuestion(22)
      return
    }
    if (currentQuestion === 23 && inRelationship === true) {
      setShowRelationshipQuestion(true)
      return
    }
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (typeof window === 'undefined') {
      setError('此操作只能在浏览器中执行')
      return
    }

    const questionsToAnswer = inRelationship === true ? QUESTIONS : QUESTIONS.slice(0, 23)
    const allAnswered = questionsToAnswer.every(q => answers[q.id])
    if (!allAnswered) {
      const unanswered = questionsToAnswer.filter(q => !answers[q.id])
      console.log('未回答的题目:', unanswered.map(q => q.id))
      setError('请回答所有问题')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const { saveUserA, saveUserB, generatePairId } = getSupabaseFunctions()

      const personalProfile = computePersonalProfile(answers)
      const sternbergType = classifySternberg(personalProfile.sternbergVector)
      const gottmanType = classifyGottman(personalProfile.gottmanVector)
      
      const socialExchange = inRelationship ? {
        q24: parseInt(answers['Q24'] || '3'),
        q25: parseInt(answers['Q25'] || '3'),
        q26: parseInt(answers['Q26'] || '3')
      } : {
        q24: 3,
        q25: 3,
        q26: 3
      }

      const userData = {
        nickname: nickname || (userType === 'B' ? '用户B' : '用户A'),
        answers: QUESTIONS.map(q => ({
          questionId: q.id,
          selectedOption: answers[q.id] || ''
        })),
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
        sternbergType,
        gottmanType,
        socialExchange,
        resultKey: `${personalProfile.primaryLoveStyle}-${personalProfile.primaryAttachment}`,
        resultName: personalProfile.animal,
        resultDesc: `${personalProfile.primaryLoveStyle} × ${personalProfile.primaryAttachment}`,
        styleScores: personalProfile.loveStyleScores,
        attachScores: personalProfile.attachmentScores
      }

      if (pairId && userType === 'B') {
        const saveResult = await saveUserB(pairId as string, userData)
        if (saveResult.success) {
          router.push(`/result?testId=${encodeURIComponent(pairId as string)}&pairId=${encodeURIComponent(pairId as string)}&userType=B`)
        } else {
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
        console.log('[Test] Generating pair ID...')
        const pairResult = await generatePairId()
        console.log('[Test] Pair ID result:', pairResult)
        if (!pairResult.success) {
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

  const totalQuestions = inRelationship === true ? 27 : 24
  
  let currentQuestionIndex
  if (showRelationshipQuestion) {
    currentQuestionIndex = 23
  } else if (inRelationship === true && currentQuestion >= 23) {
    currentQuestionIndex = currentQuestion + 1
  } else {
    currentQuestionIndex = currentQuestion
  }
  const progress = inRelationship === false ? 100 : ((currentQuestionIndex + 1) / totalQuestions) * 100
  
  if (showNicknameInput) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/plaza" 
              className="text-gray-600 hover:text-gray-800 transition-colors mb-4 inline-block"
            >
              ← 返回测试广场
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              爱情动物人格测试
            </h1>
            <p className="text-gray-600 mb-6">
              在开始测试前，请先输入您的昵称
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              请输入您的昵称：
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value)
                setError(null)
              }}
              placeholder="请输入您的昵称"
              maxLength={20}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none text-lg"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && nickname.trim()) {
                  setShowNicknameInput(false)
                }
              }}
            />
            <p className="text-sm text-gray-500 mt-2">
              昵称将用于显示在测试结果中，最多20个字符
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                if (nickname.trim()) {
                  setShowNicknameInput(false)
                  setError(null)
                } else {
                  setError('请输入昵称')
                }
              }}
              disabled={!nickname.trim()}
              className={`px-8 py-4 rounded-lg font-medium text-lg transition-colors ${
                nickname.trim()
                  ? 'bg-pink-500 text-white hover:bg-pink-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              开始测试
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  if (showRelationshipQuestion) {
    const allAnswered = inRelationship !== null
    
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/plaza" 
              className="text-gray-600 hover:text-gray-800 transition-colors mb-4 inline-block"
            >
              ← 返回测试广场
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              爱情动物人格测试
            </h1>
            <div className="text-sm text-gray-600 mb-4">
              问题 24 / {totalQuestions}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-pink-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              请问您现在是否正处于一段亲密关系中？
            </h2>

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
        </div>
      </div>
    )
  }

  const question = showRelationshipQuestion ? null : QUESTIONS[currentQuestion]
  const questionsToAnswer = inRelationship === true 
    ? QUESTIONS 
    : QUESTIONS.slice(0, 23)
  const allAnswered = questionsToAnswer.every(q => answers[q.id])
  const currentAnswer = question ? answers[question.id] : null
  const isSocialExchangeQuestion = !showRelationshipQuestion && currentQuestion >= 23
  
  const isLastQuestion = inRelationship === true 
    ? !showRelationshipQuestion && currentQuestion === 25
    : false

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/plaza" 
            className="text-gray-600 hover:text-gray-800 transition-colors mb-4 inline-block"
          >
            ← 返回测试广场
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            爱情动物人格测试
          </h1>
          <div className="text-sm text-gray-600 mb-4">
            问题 {currentQuestionIndex + 1} / {totalQuestions}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-pink-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

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
    </div>
  )
}
