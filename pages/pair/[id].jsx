import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getPairData } from '../../src/lib/firebase'
import TestComponent from '../../components/TestComponent'

export default function Pair() {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userA, setUserA] = useState(null)
  const [userB, setUserB] = useState(null)
  const [showTest, setShowTest] = useState(false)

  useEffect(() => {
    if (!router.isReady || !id) return

    const fetchPairData = async () => {
      try {
        const result = await getPairData(id)
        if (result.success) {
          setUserA(result.data.userA)
          setUserB(result.data.userB)
          
          // If userB already exists, redirect to match page
          if (result.data.userB) {
            router.push(`/match/${id}`)
            return
          }

          // If userA doesn't exist, show error
          if (!result.data.userA) {
            setError('配对链接无效')
          }
        } else {
          setError(result.error || '无法加载配对信息')
        }
      } catch (err) {
        console.error('Fetch pair data error:', err)
        setError('加载失败，请重试')
      } finally {
        setLoading(false)
      }
    }

    fetchPairData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, router.isReady])

  const handleStartTest = () => {
    setShowTest(true)
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
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

  if (showTest) {
    return <TestComponent pairId={id} userType="B" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            你正在与对方配对
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            对方已经完成了测试，现在轮到你啦！
            <br />
            完成测试后，你们将看到彼此的匹配结果。
          </p>
          
          {userA && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">对方的类型</p>
              <p className="text-2xl font-bold text-pink-600">{userA.resultName}</p>
            </div>
          )}

          <button
            onClick={handleStartTest}
            className="w-full px-8 py-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium text-lg"
          >
            开始你的测试
          </button>

          <Link
            href="/"
            className="block mt-4 text-gray-600 hover:text-gray-800 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
