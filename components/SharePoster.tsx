import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'

interface SharePosterProps {
  resultName: string
  resultDesc: string
  resultKey: string
  styleScores: Record<string, number>
  attachScores: Record<string, number>
  avatarUrl?: string
}

const styleLabels: Record<string, string> = {
  P: '激情',
  G: '游戏',
  F: '友谊',
  U: '实用',
  C: '痴狂',
  A: '利他'
}

const attachLabels: Record<string, string> = {
  S: '安全',
  A: '回避',
  X: '焦虑',
  F: '恐惧'
}

export default function SharePoster({
  resultName,
  resultDesc,
  resultKey,
  styleScores,
  attachScores,
  avatarUrl
}: SharePosterProps) {
  const posterRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    if (!posterRef.current) return

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(posterRef.current, {
        width: 1080,
        height: 1920,
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false
      })

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          setIsGenerating(false)
          return
        }

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `couple-test-${resultName}-${Date.now()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        setIsGenerating(false)
      }, 'image/png')
    } catch (error) {
      console.error('Error generating poster:', error)
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Poster Preview */}
      <div className="relative">
        <div
          ref={posterRef}
          className="relative overflow-hidden"
          style={{
            width: '540px',
            height: '960px',
            transform: 'scale(0.5)',
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          {/* Actual poster content at 1080x1920 */}
          <div
            className="relative w-full h-full"
            style={{
              width: '1080px',
              height: '1920px',
              background: 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #e9d5ff 100%)'
            }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute top-20 right-20 w-64 h-64 bg-pink-300 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute bottom-40 left-20 w-80 h-80 bg-purple-300 rounded-full opacity-20 blur-3xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-between p-16">
              {/* Top section - Avatar and Title */}
              <div className="flex flex-col items-center w-full">
                {avatarUrl && (
                  <div className="mb-8">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                  </div>
                )}

                {/* Type Name */}
                <div className="mb-6">
                  <h1
                    className="text-8xl font-bold text-center mb-4"
                    style={{
                      background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: '0 4px 20px rgba(236, 72, 153, 0.3)'
                    }}
                  >
                    {resultName}
                  </h1>
                  <p className="text-gray-500 text-2xl text-center">类型代码: {resultKey}</p>
                </div>

                {/* Description Card */}
                <div
                  className="w-full p-8 rounded-3xl mb-8 backdrop-blur-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <p className="text-gray-700 text-3xl leading-relaxed text-center">
                    {resultDesc}
                  </p>
                </div>
              </div>

              {/* Middle section - Scores */}
              <div className="w-full space-y-8">
                {/* Love Style Scores */}
                <div
                  className="p-8 rounded-3xl backdrop-blur-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                    爱情风格得分
                  </h2>
                  <div className="space-y-4">
                    {Object.entries(styleScores).map(([style, score]) => (
                      <div key={style} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 text-2xl font-medium">
                            {styleLabels[style] || style}
                          </span>
                          <span className="text-gray-800 text-2xl font-bold">{score}</span>
                        </div>
                        <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${(score / 15) * 100}%`,
                              background: 'linear-gradient(90deg, #ec4899 0%, #f472b6 100%)',
                              boxShadow: '0 2px 8px rgba(236, 72, 153, 0.4)'
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attachment Scores */}
                <div
                  className="p-8 rounded-3xl backdrop-blur-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                    依恋风格得分
                  </h2>
                  <div className="space-y-4">
                    {Object.entries(attachScores).map(([attach, score]) => (
                      <div key={attach} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 text-2xl font-medium">
                            {attachLabels[attach] || attach}
                          </span>
                          <span className="text-gray-800 text-2xl font-bold">{score}</span>
                        </div>
                        <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${(score / 15) * 100}%`,
                              background: 'linear-gradient(90deg, #a855f7 0%, #c084fc 100%)',
                              boxShadow: '0 2px 8px rgba(168, 85, 247, 0.4)'
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center">
                <p className="text-gray-400 text-xl">couple-test.vercel.app</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visible preview (scaled down) */}
        <div
          className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white"
          style={{
            width: '270px',
            height: '480px',
            background: 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #e9d5ff 100%)'
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-10 right-10 w-32 h-32 bg-pink-300 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-300 rounded-full opacity-20 blur-2xl"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-between p-8">
            {/* Top section */}
            <div className="flex flex-col items-center w-full">
              {avatarUrl && (
                <div className="mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>
              )}

              <div className="mb-3">
                <h1
                  className="text-4xl font-bold text-center mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {resultName}
                </h1>
                <p className="text-gray-500 text-xs text-center">{resultKey}</p>
              </div>

              <div
                className="w-full p-4 rounded-2xl mb-4 backdrop-blur-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}
              >
                <p className="text-gray-700 text-sm leading-relaxed text-center">
                  {resultDesc}
                </p>
              </div>
            </div>

            {/* Scores (simplified for preview) */}
            <div className="w-full space-y-4">
              <div
                className="p-4 rounded-2xl backdrop-blur-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}
              >
                <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">爱情风格</h2>
                <div className="space-y-2">
                  {Object.entries(styleScores).slice(0, 3).map(([style, score]) => (
                    <div key={style} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-700">{styleLabels[style] || style}</span>
                        <span className="text-gray-800 font-bold">{score}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(score / 15) * 100}%`,
                            background: 'linear-gradient(90deg, #ec4899 0%, #f472b6 100%)'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-gray-400 text-xs">couple-test.vercel.app</p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? '生成中...' : '保存海报到相册'}
      </button>
    </div>
  )
}

