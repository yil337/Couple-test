import Link from 'next/link'
import Head from 'next/head'
import { useState } from 'react'

export default function LoveIntro() {
  const [showTheories, setShowTheories] = useState(false)

  return (
    <>
      <Head>
        <title>爱情动物画像 - LY Analytics</title>
      </Head>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-800 transition-colors mb-4 inline-block"
            >
              ← 返回测试广场
            </Link>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              爱情动物人格测试
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              基于6大心理学理论模型，科学评估你的爱情动物画像与伴侣匹配度
            </p>
            <p className="text-lg text-gray-500 mb-8">
              通过26道专业题目，深度解析你的爱情风格
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/love-test" 
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
              >
                开始测试
              </Link>
            </div>
          </div>

          {/* Theory Models Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <button
              onClick={() => setShowTheories(!showTheories)}
              className="w-full flex items-center justify-between text-left focus:outline-none"
            >
              <h2 className="text-2xl font-bold text-gray-800">
                📚 理论基础
              </h2>
              <span className="text-gray-500 text-lg">
                {showTheories ? '▲' : '▼'}
              </span>
            </button>
            
            {showTheories && (
              <div className="mt-6 space-y-6 animate-fadeIn">
                {/* Lee's Love Style */}
                <div className="border-l-4 border-pink-500 pl-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Lee's Love Style（李的爱情风格理论）
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    由加拿大心理学家John Alan Lee提出的六种爱情风格：激情型（Eros）、游戏型（Ludus）、友谊型（Storge）、实用型（Pragma）、痴狂型（Mania）、利他型（Agape）。每种风格代表不同的爱情表达方式和价值观。
                  </p>
                </div>

                {/* Adult Attachment Theory */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Adult Attachment Theory（成人依恋理论）
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    基于Bowlby和Ainsworth的依恋理论，将成人在亲密关系中的依恋模式分为四种：安全型（Secure）、回避型（Avoidant）、焦虑型（Anxious）、恐惧型（Fearful）。依恋类型影响我们在关系中的行为模式和情感表达。
                  </p>
                </div>

                {/* Love Languages */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Five Love Languages（五种爱的语言）
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Gary Chapman提出的理论，认为人们表达和接收爱的方式主要有五种：肯定的言辞、精心的时刻、服务的行动、身体的接触（高/低强度）。了解彼此的爱语有助于更好地沟通和满足彼此需求。
                  </p>
                </div>

                {/* Sternberg's Triangular Theory */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Sternberg's Triangular Theory of Love（斯滕伯格爱情三角理论）
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Robert Sternberg提出的理论，认为爱情由三个维度组成：亲密（Intimacy）、激情（Passion）、承诺（Commitment）。这三个维度的不同组合形成了七种不同类型的爱情关系。
                  </p>
                </div>

                {/* Gottman Method */}
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Gottman Method（戈特曼方法）
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    John Gottman通过长期研究提出的关系评估方法，识别出影响关系稳定性的"四骑士"：批评、防御、冷战、轻蔑。通过评估这些因素，可以预测关系的健康程度和长期稳定性。
                  </p>
                </div>

                {/* Social Exchange Theory */}
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Social Exchange Theory（社会交换理论）
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    由George Homans和Peter Blau等社会学家提出的理论，认为人际关系是一种社会交换过程。在亲密关系中，人们会评估投入与回报的平衡，包括情感投入、时间投入、资源投入等。关系的满意度取决于双方感知到的交换是否公平和对等。
                  </p>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                  <p className="text-gray-700 text-center">
                    <strong>本测试综合运用以上六大理论模型</strong>，通过26道精心设计的问题，为你生成个性化的爱情画像，并计算与伴侣的匹配度。
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">科学评估</h3>
              <p className="text-gray-600 text-sm">基于六大心理学理论模型</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-4">💑</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">双人测试</h3>
              <p className="text-gray-600 text-sm">支持双人测试，计算共同结果获得爱情匹配度</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-4">🐾</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">动物人格</h3>
              <p className="text-gray-600 text-sm">24种动物类型，基于心理学模型科学分类</p>
            </div>
          </div>
          
          {/* 商务合作 */}
          <div className="text-center mt-12 pb-4">
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
    </>
  )
}
