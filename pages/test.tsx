// 重定向到爱情测试页面
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Test() {
  const router = useRouter()

  useEffect(() => {
    // 保留 query 参数（pairId, userType）
    const { pairId, userType } = router.query
    const queryString = new URLSearchParams()
    if (pairId) queryString.set('pairId', pairId as string)
    if (userType) queryString.set('userType', userType as string)
    const query = queryString.toString()
    router.replace(`/love-test${query ? '?' + query : ''}`)
  }, [router])

  return (
    <>
      <Head>
        <title>跳转中...</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">正在跳转到测试页面...</p>
        </div>
      </div>
    </>
  )
}
