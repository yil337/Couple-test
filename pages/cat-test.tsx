import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import { CAT_QUESTIONS } from '../src/lib/catQuestions'
import { calculateCatType } from '../src/lib/catQuestions'

export default function CatTest() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nickname, setNickname] = useState<string>('')
  const [showNicknameInput, setShowNicknameInput] = useState<boolean>(true)

  const handleAnswer = (optionKey: string) => {
    const question = CAT_QUESTIONS[currentQuestion]
    setAnswers(prev => ({
      ...prev,
      [question.id]: optionKey
    }))
  }

  const handleNext = () => {
    const question = CAT_QUESTIONS[currentQuestion]
    if (!answers[question.id]) {
      setError('请先选择答案')
      return
    }
    setError(null)
    if (currentQuestion < CAT_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    const allAnswered = CAT_QUESTIONS.every(q => answers[q.id])
    if (!allAnswered) {
      setError('请回答所有问题')
      return
    }

    setIsSubmitting(true)
    setError(null)

    // 计算猫猫类型
    const catType = calculateCatType(answers)

    // 跳转到结果页面
    router.push({
      pathname: '/cat-result',
      query: {
        type: catType,
        nickname: nickname || '你'
      }
    })
  }

  const progress = ((currentQuestion + 1) / CAT_QUESTIONS.length) * 100
  const question = CAT_QUESTIONS[currentQuestion]
  const currentAnswer = answers[question.id]

  // 昵称输入页
  if (showNicknameInput) {
    return (
      <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-800 transition-colors mb-4 inline-block"
            >
              ← 返回测试广场
            </Link>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🐱 你是什么猫猫测试
            </h1>
            <p className="text-gray-600 mb-6">
              通过10道题，发现你内心的猫猫人格
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              请输入您的昵称（可选）：
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value)
                setError(null)
              }}
              placeholder="例如：小明、小美等"
              maxLength={20}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-lg"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
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
                setShowNicknameInput(false)
                setError(null)
              }}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
            >
              开始测试
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>你是什么猫猫测试 - LY Analytics</title>
      </Head>
      <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-800 transition-colors mb-4 inline-block"
            >
              ← 返回测试广场
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🐱 你是什么猫猫测试
            </h1>
            <div className="text-sm text-gray-600 mb-4">
              问题 {currentQuestion + 1} / {CAT_QUESTIONS.length}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2.5 rounded-full transition-all duration-300"
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
              {question.text}
            </h2>

            <div className="space-y-3">
              {question.options.map((option) => {
                const isSelected = currentAnswer === option.key
                return (
                  <button
                    key={option.key}
                    onClick={() => handleAnswer(option.key)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="font-medium">{option.key}. {option.text}</span>
                  </button>
                )
              })}
            </div>
          </div>

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

            {currentQuestion === CAT_QUESTIONS.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={!currentAnswer || isSubmitting}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  !currentAnswer || isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600'
                }`}
              >
                {isSubmitting ? '提交中...' : '查看结果'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!currentAnswer}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  !currentAnswer
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600'
                }`}
              >
                下一题
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
