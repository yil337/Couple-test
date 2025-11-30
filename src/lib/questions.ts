/**
 * 爱情模型问卷配置
 * 26 道题：1-23 个人爱情风格与互动模式题，24-26 Social Exchange 题
 * 基于提供的完整题目和映射表
 */

import { Question, QuestionId, OptionMapping } from './types'

/**
 * 创建选项映射辅助函数
 */
function createMapping(config: {
  ls?: string | { [key: string]: number }
  at?: string | { [key: string]: number }
  ll?: string | { [key: string]: number }
  st?: string | { [key: string]: number }
  gm?: string | { [key: string]: number }
}): OptionMapping {
  const result: OptionMapping = {}
  
  // Love Style 映射
  if (config.ls) {
    if (typeof config.ls === 'string') {
      const lsMap: Record<string, string> = {
        '激情': 'PASSION',
        '游戏': 'GAME',
        '友谊': 'FRIENDSHIP',
        '实用': 'PRAGMATIC',
        '痴狂': 'MANIA',
        '利他': 'AGAPE'
      }
      result.ls = { [lsMap[config.ls] || config.ls]: 1 }
    } else {
      // 处理权重映射，如 { 'FRIENDSHIP': 0.7, 'PASSION': 0.3 }
      const mapped: any = {}
      Object.keys(config.ls).forEach(key => {
        const lsMap: Record<string, string> = {
          '激情': 'PASSION',
          '游戏': 'GAME',
          '友谊': 'FRIENDSHIP',
          '实用': 'PRAGMATIC',
          '痴狂': 'MANIA',
          '利他': 'AGAPE'
        }
        mapped[lsMap[key] || key] = config.ls[key]
      })
      result.ls = mapped
    }
  }
  
  // Attachment 映射
  if (config.at) {
    if (typeof config.at === 'string') {
      const atMap: Record<string, string> = {
        '安全': 'SECURE',
        '回避': 'AVOIDANT',
        '焦虑': 'ANXIOUS',
        '恐惧': 'FEARFUL',
        '轻回避': 'AVOIDANT',  // 轻回避 = 回避
        '轻焦虑': 'ANXIOUS'     // 轻焦虑 = 焦虑
      }
      // 处理 "安全/轻焦虑" 这种格式
      if (config.at.includes('/')) {
        const parts = config.at.split('/')
        const mapped: any = {}
        parts.forEach(part => {
          const key = atMap[part.trim()] || part.trim()
          mapped[key] = 0.5
        })
        result.at = mapped
      } else {
        result.at = { [atMap[config.at] || config.at]: 1 }
      }
    } else {
      result.at = config.at as any
    }
  }
  
  // Love Language 映射
  if (config.ll) {
    if (typeof config.ll === 'string') {
      const llMap: Record<string, string> = {
        '陪伴': 'QUALITY_TIME',
        '高确认': 'WORDS',
        '肢体接触': 'PHYSICAL_HIGH',
        '接触': 'PHYSICAL_HIGH',
        '言语': 'WORDS',
        '服务': 'ACTS',
        '服务行动': 'ACTS',
        '精心时刻': 'QUALITY_TIME',
        '精心的时刻': 'QUALITY_TIME'
      }
      result.ll = { [llMap[config.ll] || config.ll]: 1 }
    } else {
      result.ll = config.ll as any
    }
  }
  
  // Sternberg 维度映射
  if (config.st) {
    if (typeof config.st === 'string') {
      const stMap: Record<string, string> = {
        '亲密': 'INTIMACY',
        '激情': 'PASSION',
        '承诺': 'COMMITMENT'
      }
      // 处理 "亲密/承诺" 这种格式
      if (config.st.includes('/')) {
        const parts = config.st.split('/')
        const mapped: any = {}
        parts.forEach(part => {
          const key = stMap[part.trim()] || part.trim()
          mapped[key] = 0.5
        })
        result.st = mapped
      } else {
        result.st = { [stMap[config.st] || config.st]: 1 }
      }
    } else {
      result.st = config.st as any
    }
  }
  
  // Gottman 映射
  if (config.gm) {
    if (typeof config.gm === 'string') {
      const gmMap: Record<string, string> = {
        '健康': 'HEALTHY',
        '健康沟通': 'HEALTHY',
        '批评': 'CRITICISM',
        '防御': 'DEFENSIVENESS',
        '冷战': 'STONEWALLING',
        '轻蔑': 'CONTEMPT',
        '情绪升级': 'CRITICISM'
      }
      // 处理 "批评/防御" 这种格式
      if (config.gm.includes('/')) {
        const parts = config.gm.split('/')
        const mapped: any = {}
        parts.forEach(part => {
          const key = gmMap[part.trim()] || part.trim()
          mapped[key] = 0.5
        })
        result.gm = mapped
      } else {
        result.gm = { [gmMap[config.gm] || config.gm]: 1 }
      }
    } else {
      result.gm = config.gm as any
    }
  }
  
  return result
}

/**
 * 解析映射表格式
 * 如 "友谊（主）+激情（轻）" -> { FRIENDSHIP: 0.7, PASSION: 0.3 }
 * 如 "激情/友谊" -> { PASSION: 0.5, FRIENDSHIP: 0.5 }
 */
function parseLSMapping(text: string): { [key: string]: number } | string {
  if (!text) return ''
  
  // 处理 "友谊（主）+激情（轻）" 格式
  if (text.includes('（主）') && text.includes('（轻）')) {
    const mainMatch = text.match(/(\S+)（主）/)
    const lightMatch = text.match(/(\S+)（轻）/)
    if (mainMatch && lightMatch) {
      return {
        [mainMatch[1]]: 0.7,
        [lightMatch[1]]: 0.3
      }
    }
  }
  
  // 处理 "利他＋实用" 或 "实用/友谊" 格式（并列，各0.5）
  if (text.includes('＋') || text.includes('+') || text.includes('/')) {
    const parts = text.split(/[＋+/]/).map(s => s.trim())
    const result: any = {}
    parts.forEach(part => {
      result[part] = 0.5
    })
    return result
  }
  
  // 单一值
  return text
}

/**
 * 问卷配置
 */
export const QUESTIONS: Question[] = [
  // Q1
  {
    id: 'Q1',
    text: '假如一直很黏你的小狗有一天突然沉默，你会：',
    options: [
      {
        key: 'A',
        text: '理解ta也需要自己的空间',
        mapping: createMapping({ 
          ls: parseLSMapping('友谊（主）+激情（轻）'),
          at: '安全',
          ll: '陪伴'
        })
      },
      {
        key: 'B',
        text: '担心ta是不是闹情绪',
        mapping: createMapping({ ls: '痴狂', at: '焦虑', ll: '高确认' })
      },
      {
        key: 'C',
        text: '享受难得的安静',
        mapping: createMapping({ ls: '游戏', at: '回避' })
      },
      {
        key: 'D',
        text: '很着急想马上知道ta怎么了',
        mapping: createMapping({ 
          ls: parseLSMapping('痴狂+激情'),
          at: '焦虑',
          ll: '肢体接触'
        })
      },
      {
        key: 'E',
        text: '多给ta准备一些好吃的与玩具，在旁边默默观察',
        mapping: createMapping({ 
          ls: parseLSMapping('利他+友谊'),
          at: '焦虑',
          ll: '服务行动'
        })
      }
    ]
  },
  
  // Q2
  {
    id: 'Q2',
    text: '你对事物发展的节奏偏好是：',
    options: [
      {
        key: 'A',
        text: '如潮水般迅速席卷',
        mapping: createMapping({ ls: '激情', at: '焦虑/安全', ll: '肢体接触' })
      },
      {
        key: 'B',
        text: '如微风般轻松拂过',
        mapping: createMapping({ ls: '游戏', at: '回避/安全', ll: '言语' })
      },
      {
        key: 'C',
        text: '如树根般缓缓扎稳',
        mapping: createMapping({ ls: '友谊', at: '安全/轻回避', ll: '陪伴' })
      },
      {
        key: 'D',
        text: '如火焰般带着温度靠近',
        mapping: createMapping({ ls: '痴狂', at: '焦虑', ll: '接触' })
      },
      {
        key: 'E',
        text: '顺应自然的节奏',
        mapping: createMapping({ ls: '利他', at: '安全', ll: '陪伴' })
      }
    ]
  },
  
  // Q3
  {
    id: 'Q3',
    text: '前行的途中地面上出现一道裂缝，你会：',
    options: [
      {
        key: 'A',
        text: '想办法填补裂缝',
        mapping: createMapping({ ls: '实用', at: '安全' })
      },
      {
        key: 'B',
        text: '先观察裂缝情况',
        mapping: createMapping({ ls: '痴狂', at: '焦虑' })
      },
      {
        key: 'C',
        text: '绕一大圈路避开',
        mapping: createMapping({ ls: '游戏', at: '回避' })
      },
      {
        key: 'D',
        text: '想修补却不确定怎么做',
        mapping: createMapping({ ls: '实用', at: '恐惧' })
      }
    ]
  },
  
  // Q4
  {
    id: 'Q4',
    text: '雨夜中听到有人呼唤你，你会：',
    options: [
      {
        key: 'A',
        text: '立即大声回应，走近声音的来源询问',
        mapping: createMapping({ 
          ls: parseLSMapping('友谊＋轻激情'),
          at: '安全/轻焦虑',
          ll: '陪伴'
        })
      },
      {
        key: 'B',
        text: '紧张地躲起来然后试探性回应',
        mapping: createMapping({ ls: '痴狂', at: '恐惧' })
      },
      {
        key: 'C',
        text: '装作没听见，赶快离开',
        mapping: createMapping({ ls: '实用', at: '恐惧' })
      },
      {
        key: 'D',
        text: '这么大的雨淋到了怎么办？过去将伞分对方一半',
        mapping: createMapping({ ls: '利他', at: '安全', ll: '服务' })
      }
    ]
  },
  
  // Q5
  {
    id: 'Q5',
    text: '清晨醒来有一大堆未读讯息，你第一反应是：',
    options: [
      {
        key: 'A',
        text: '赶快想看看写了什么',
        mapping: createMapping({ ls: '友谊', at: '安全', ll: '陪伴' })
      },
      {
        key: 'B',
        text: '心里一紧，怕出什么事了',
        mapping: createMapping({ ls: '痴狂', at: '焦虑', ll: '高确认' })
      },
      {
        key: 'C',
        text: '好烦啊…先放着不看',
        mapping: createMapping({ ls: '游戏', at: '回避' })
      },
      {
        key: 'D',
        text: '很开心收到信息，感到被重视',
        mapping: createMapping({ ls: parseLSMapping('利他/激情'), at: '安全', ll: '言语' })
      }
    ]
  },
  
  // Q6
  {
    id: 'Q6',
    text: '假设和一位你最重要的人一起去探险，你会：',
    options: [
      {
        key: 'A',
        text: '选稳妥路线',
        mapping: createMapping({ ls: '友谊', at: '安全' })
      },
      {
        key: 'B',
        text: '选刺激路线',
        mapping: createMapping({ ls: parseLSMapping('游戏＋激情'), at: '安全' })
      },
      {
        key: 'C',
        text: '让对方带领你',
        mapping: createMapping({ ls: '痴狂', at: '焦虑', ll: '接触' })
      },
      {
        key: 'D',
        text: '精准规划所有路线',
        mapping: createMapping({ ls: '实用', at: '恐惧' })
      }
    ]
  },
  
  // Q7
  {
    id: 'Q7',
    text: '一天清晨你收到一张未署名礼物卡，你会：',
    options: [
      {
        key: 'A',
        text: '被善意打动感到温暖',
        mapping: createMapping({ ls: parseLSMapping('激情/友谊'), at: '安全', ll: '精心时刻' })
      },
      {
        key: 'B',
        text: '一整天思考是谁送的',
        mapping: createMapping({ ls: '痴狂', at: '焦虑' })
      },
      {
        key: 'C',
        text: '觉得这样的惊喜太有趣了，可是会有点不知所措',
        mapping: createMapping({ ls: '激情', at: '回避' })
      },
      {
        key: 'D',
        text: '怀疑自己忘记了什么重要的事',
        mapping: createMapping({ ls: '实用', at: '恐惧' })
      },
      {
        key: 'E',
        text: '想尽快回礼',
        mapping: createMapping({ ls: '利他', at: '安全/焦虑', ll: '服务' })
      }
    ]
  },
  
  // Q8
  {
    id: 'Q8',
    text: '你路过一扇半掩着的门，里面隐约传出有人在弹琴，你会：',
    options: [
      {
        key: 'A',
        text: '轻轻敲门，问能不能进去听一会儿',
        mapping: createMapping({ ls: parseLSMapping('激情/友谊'), at: '安全', ll: '陪伴' })
      },
      {
        key: 'B',
        text: '靠在门边悄悄多听一会儿再离开',
        mapping: createMapping({ ls: '友谊', at: '安全/轻焦虑', ll: '陪伴' })
      },
      {
        key: 'C',
        text: '记住这个地方，以后可以再来',
        mapping: createMapping({ ls: parseLSMapping('实用/友谊'), at: '安全' })
      },
      {
        key: 'D',
        text: '轻手轻脚把门关好，不打扰里面的人',
        mapping: createMapping({ ls: '利他', at: '安全', ll: '服务' })
      },
      {
        key: 'E',
        text: '悄悄在门口留下一点小礼物就走',
        mapping: createMapping({ ls: parseLSMapping('利他/痴狂'), at: '回避', ll: '精心时刻' })
      }
    ]
  },
  
  // Q9
  {
    id: 'Q9',
    text: '一只第一次见面的小动物突然黏上你，你会：',
    options: [
      {
        key: 'A',
        text: '蹲下来询问ta是不是需要帮助',
        mapping: createMapping({ ls: '利他', at: '安全', ll: '服务' })
      },
      {
        key: 'B',
        text: '想和ta玩但是小心翼翼的不知道怎样比较好',
        mapping: createMapping({ ls: parseLSMapping('友谊/激情'), at: '焦虑' })
      },
      {
        key: 'C',
        text: '对ta笑笑但不接触过多',
        mapping: createMapping({ ls: '游戏', at: '回避' })
      },
      {
        key: 'D',
        text: '将ta带回家照顾',
        mapping: createMapping({ ls: parseLSMapping('利他/实用'), at: '安全', ll: '服务' })
      }
    ]
  },
  
  // Q10
  {
    id: 'Q10',
    text: '一座你经常经过的桥突然被封闭了，你会：',
    options: [
      {
        key: 'A',
        text: '好吧…找替代路线',
        mapping: createMapping({ ls: '实用', at: '安全' })
      },
      {
        key: 'B',
        text: '嗯？想弄清楚原因',
        mapping: createMapping({ ls: '实用', at: '焦虑' })
      },
      {
        key: 'C',
        text: '刚好试一条完全不同的路',
        mapping: createMapping({ ls: '游戏', at: '安全' })
      },
      {
        key: 'D',
        text: '一下子不知道怎么办了…发信息给朋友问问',
        mapping: createMapping({ ls: '友谊', at: '焦虑' })
      }
    ]
  },
  
  // Q11
  {
    id: 'Q11',
    text: '别人送给你一株脆弱的小苗，你会：',
    options: [
      {
        key: 'A',
        text: '精心照顾，每日固定浇水',
        mapping: createMapping({ ls: parseLSMapping('友谊＋利他'), at: '安全', ll: '陪伴' })
      },
      {
        key: 'B',
        text: '仔细查资料，担心照顾不好',
        mapping: createMapping({ ls: '实用', at: '焦虑' })
      },
      {
        key: 'C',
        text: '将它放在窗边让它自由生长',
        mapping: createMapping({ ls: '游戏', at: '回避' })
      },
      {
        key: 'D',
        text: '马上去超市为ta买肥料与花盆',
        mapping: createMapping({ ls: parseLSMapping('利他＋实用'), at: '安全/焦虑', ll: '服务' })
      }
    ]
  },
  
  // Q12
  {
    id: 'Q12',
    text: '路途的过程中踏入一座未知城市，你会：',
    options: [
      {
        key: 'A',
        text: '落座一家闻着很香的餐厅',
        mapping: createMapping({ ls: '激情', at: '安全' })
      },
      {
        key: 'B',
        text: '去服装店买一身符合本地风格的穿着',
        mapping: createMapping({ ls: '实用', at: '焦虑' })
      },
      {
        key: 'C',
        text: '在街头随意逛逛',
        mapping: createMapping({ ls: '游戏', at: '安全' })
      },
      {
        key: 'D',
        text: '第一站游客中心，拿到所有相关资料',
        mapping: createMapping({ ls: '实用', at: '恐惧' })
      },
      {
        key: 'E',
        text: '先和身边遇到的人交朋友，不想一个人行动',
        mapping: createMapping({ ls: '友谊', at: '恐惧' })
      }
    ]
  },
  
  // Q13
  {
    id: 'Q13',
    text: '夜晚你在河边散步时，有一艘无人小船轻轻飘来，你会：',
    options: [
      {
        key: 'A',
        text: '走近看看，轻轻摸一摸小船',
        mapping: createMapping({ ls: '友谊', at: '安全', ll: '陪伴' })
      },
      {
        key: 'B',
        text: '停下来观察它漂向哪里',
        mapping: createMapping({ ls: '实用', at: '焦虑' })
      },
      {
        key: 'C',
        text: '不太关心，继续自己的路',
        mapping: createMapping({ ls: '实用', at: '回避' })
      },
      {
        key: 'D',
        text: '觉得有趣，跟着小船的方向走',
        mapping: createMapping({ ls: parseLSMapping('游戏/激情'), at: '安全' })
      }
    ]
  },
  
  // Q14
  {
    id: 'Q14',
    text: '走在小树林里看到一个凭空出现的人告诉你自己是魔法师，你会：',
    options: [
      {
        key: 'A',
        text: '"哦，那又怎样？我走了。"',
        mapping: createMapping({ ls: '实用', at: '安全' })
      },
      {
        key: 'B',
        text: '"我凭什么相信你？"',
        mapping: createMapping({ ls: '痴狂', at: '恐惧' })
      },
      {
        key: 'C',
        text: '"那你能实现我的愿望吗？"',
        mapping: createMapping({ ls: '游戏', at: '焦虑' })
      },
      {
        key: 'D',
        text: '"请问你是需要我的帮助吗？"',
        mapping: createMapping({ ls: '利他', at: '安全', ll: '服务' })
      }
    ]
  },
  
  // Q15
  {
    id: 'Q15',
    text: '收到邀请去参加宴会，你一定会带：',
    options: [
      {
        key: 'A',
        text: '随身带点用于在宴会上表演的小道具，以备不时之需',
        mapping: createMapping({ ls: '游戏', at: '恐惧', ll: '精心的时刻' })
      },
      {
        key: 'B',
        text: '一面小镜子，方便确认自己的状态',
        mapping: createMapping({ ls: '痴狂', at: '焦虑' })
      },
      {
        key: 'C',
        text: '一摞名片，方便随时社交',
        mapping: createMapping({ ls: '实用', at: '安全' })
      },
      {
        key: 'D',
        text: '看心情决定咯',
        mapping: createMapping({ ls: '激情', at: '恐惧' })
      }
    ]
  },
  
  // Q16
  {
    id: 'Q16',
    text: '和朋友在野外聚餐，晚上点起了美妙的篝火，此时盯着攒动的火苗，你心里会想：',
    options: [
      {
        key: 'A',
        text: '"好温暖、好美妙的夜晚啊"',
        mapping: createMapping({ ls: '友谊', at: '安全' })
      },
      {
        key: 'B',
        text: '"好令人感动，联想到了很多美妙的时刻"',
        mapping: createMapping({ ls: '痴狂', at: '焦虑' })
      },
      {
        key: 'C',
        text: '和朋友嬉戏玩闹，沉浸在当下的情绪中',
        mapping: createMapping({ ls: '游戏', at: '安全' })
      },
      {
        key: 'D',
        text: '"这个火安不安全啊？会不会发生危险伤到谁？"',
        mapping: createMapping({ ls: parseLSMapping('实用/利他'), at: '恐惧' })
      },
      {
        key: 'E',
        text: '悄悄看着喜欢的人发呆',
        mapping: createMapping({ ls: '痴狂', at: '回避' })
      }
    ]
  },
  
  // Q17
  {
    id: 'Q17',
    text: '夜色降临，你需要选择一盏灯点亮，此时你会：',
    options: [
      {
        key: 'A',
        text: '迅速点上使用最多、最熟悉的那盏',
        mapping: createMapping({ ls: '实用', at: '焦虑' })
      },
      {
        key: 'B',
        text: '等晚一点再暗一点再点灯吧',
        mapping: createMapping({ ls: '友谊', at: '回避' })
      },
      {
        key: 'C',
        text: '欣赏月光就足够了何必电灯',
        mapping: createMapping({ ls: '游戏', at: '回避' })
      },
      {
        key: 'D',
        text: '看看有没有需要用灯的人，借给对方',
        mapping: createMapping({ ls: '利他', at: '安全', ll: '服务' })
      }
    ]
  },
  
  // Q18
  {
    id: 'Q18',
    text: '岔路口前面对多条截然不同的小路，你通常：',
    options: [
      {
        key: 'A',
        text: '选一条看起来平缓的',
        mapping: createMapping({ ls: '实用', at: '焦虑' })
      },
      {
        key: 'B',
        text: '选一条看起来有精彩风景的',
        mapping: createMapping({ ls: '游戏', at: '安全' })
      },
      {
        key: 'C',
        text: '先往回走到刚才路过的站点看地图',
        mapping: createMapping({ ls: '实用', at: '恐惧' })
      },
      {
        key: 'D',
        text: '会在路口前犹豫好一会儿再决定',
        mapping: createMapping({ ls: '痴狂', at: '恐惧' })
      }
    ]
  },
  
  // Q19
  {
    id: 'Q19',
    text: '与重要的人同行前进时，ta突然停下脚步，你会：',
    options: [
      {
        key: 'A',
        text: '"为什么停下来了？"',
        mapping: createMapping({ ls: '友谊', at: '安全', st: '亲密', gm: '健康沟通' })
      },
      {
        key: 'B',
        text: '"怎么了？是出什么事情了吗？"',
        mapping: createMapping({ ls: '痴狂', at: '焦虑', st: '激情', gm: '情绪升级' })
      },
      {
        key: 'C',
        text: '假装没看到，继续往前走',
        mapping: createMapping({ ls: '游戏', at: '回避', gm: '冷战' })
      },
      {
        key: 'D',
        text: '停下来不讲话，默默等对方开口',
        mapping: createMapping({ ls: parseLSMapping('实用/痴狂'), at: '焦虑/回避', gm: '防御' })
      },
      {
        key: 'E',
        text: '走过去帮他调整背包',
        mapping: createMapping({ ls: '利他', at: '安全', st: '亲密/承诺' })
      }
    ]
  },
  
  // Q20
  {
    id: 'Q20',
    text: '翻越山坡时ta抱怨天气太冷，你会：',
    options: [
      {
        key: 'A',
        text: '"穿我的吧。"',
        mapping: createMapping({ ls: '利他', at: '安全', st: '亲密', gm: '健康' })
      },
      {
        key: 'B',
        text: '"肯定冷啊！快走吧！"',
        mapping: createMapping({ ls: '激情', at: '焦虑', st: '激情' })
      },
      {
        key: 'C',
        text: '"那能怎么办？多穿点啊！"',
        mapping: createMapping({ ls: '实用', at: '焦虑', gm: '批评/轻蔑' })
      },
      {
        key: 'D',
        text: '"嗯大家都冷。"',
        mapping: createMapping({ ls: '游戏', at: '回避', gm: '冷战' })
      },
      {
        key: 'E',
        text: '"我是很想分你一件外套的，但是我也觉得冷的，你也要理解我。"',
        mapping: createMapping({ ls: '实用', at: '焦虑', gm: '防御' })
      }
    ]
  },
  
  // Q21
  {
    id: 'Q21',
    text: '半途中ta提议改变路线，你会：',
    options: [
      {
        key: 'A',
        text: '"为什么呢？我们一起讨论下吧。"',
        mapping: createMapping({ ls: parseLSMapping('友谊/实用'), at: '安全', st: '承诺', gm: '健康' })
      },
      {
        key: 'B',
        text: '"好…啊，我们试试新的路！"',
        mapping: createMapping({ ls: '激情', at: '安全', st: '激情' })
      },
      {
        key: 'C',
        text: '"随便你，你定就行。"',
        mapping: createMapping({ ls: '游戏', at: '回避', gm: '冷战' })
      },
      {
        key: 'D',
        text: '"是因为你不喜欢我选的这条路吗？"',
        mapping: createMapping({ ls: '痴狂', at: '焦虑', gm: '防御' })
      }
    ]
  },
  
  // Q22
  {
    id: 'Q22',
    text: '旅途中ta突然说上一次在水源旁边装水的时候你没帮忙，你会：',
    options: [
      {
        key: 'A',
        text: '会想这是否是真的，理解ta很累很辛苦',
        mapping: createMapping({ ls: '友谊', at: '安全', gm: '健康' })
      },
      {
        key: 'B',
        text: '立刻解释自己也是有帮忙的',
        mapping: createMapping({ ls: '实用', at: '焦虑', gm: '防御' })
      },
      {
        key: 'C',
        text: '提出明明再上一次装水都是你做的，对方没有帮忙',
        mapping: createMapping({ ls: '游戏', at: '焦虑', gm: '批评' })
      },
      {
        key: 'D',
        text: '沉默',
        mapping: createMapping({ ls: '游戏', at: '回避', gm: '冷战' })
      },
      {
        key: 'E',
        text: '觉得ta这样说不尊重你',
        mapping: createMapping({ ls: '痴狂', at: '焦虑', gm: '轻蔑' })
      }
    ]
  },
  
  // Q23
  {
    id: 'Q23',
    text: '夜里坐在帐篷外，ta突然说"我们聊聊吧"，你会：',
    options: [
      {
        key: 'A',
        text: '立即准备好倾听，为ta拿杯水',
        mapping: createMapping({ ls: parseLSMapping('友谊/利他'), at: '安全', st: '亲密' })
      },
      {
        key: 'B',
        text: '闪过一丝紧张但愿意敞开',
        mapping: createMapping({ ls: '痴狂', at: '焦虑', st: '激情' })
      },
      {
        key: 'C',
        text: '想推到明天再说',
        mapping: createMapping({ ls: '游戏', at: '回避', gm: '冷战' })
      },
      {
        key: 'D',
        text: '怀疑是不是又要责怪你',
        mapping: createMapping({ ls: parseLSMapping('实用/痴狂'), at: '焦虑', gm: '批评/防御' })
      }
    ]
  },
  
  // ==================== Q24-Q26: Social Exchange 题（Likert 1-5） ====================
  
  {
    id: 'Q24',
    text: '在你与伴侣的关系中谁更投入？',
    options: [
      {
        key: '1',
        text: '对方完全投入而我一点也不投入',
        mapping: createMapping({}) // Social Exchange 题不参与个人画像计算
      },
      {
        key: '2',
        text: '对方比较投入而我不太投入',
        mapping: createMapping({})
      },
      {
        key: '3',
        text: '我们平等投入',
        mapping: createMapping({})
      },
      {
        key: '4',
        text: '我比较投入而对方不太投入',
        mapping: createMapping({})
      },
      {
        key: '5',
        text: '我完全投入而对方一点也不投入',
        mapping: createMapping({})
      }
    ]
  },
  
  {
    id: 'Q25',
    text: '在你看来，你们的关系是否对等？',
    options: [
      {
        key: '1',
        text: '关系掌控完全倾向于对方',
        mapping: createMapping({})
      },
      {
        key: '2',
        text: '关系掌控比较倾向于对方',
        mapping: createMapping({})
      },
      {
        key: '3',
        text: '我们关系对等',
        mapping: createMapping({})
      },
      {
        key: '4',
        text: '关系掌控比较倾向于我',
        mapping: createMapping({})
      },
      {
        key: '5',
        text: '关系掌控完全倾向于我',
        mapping: createMapping({})
      }
    ]
  },
  
  {
    id: 'Q26',
    text: '对于你与伴侣目前的关系，你的满意度是？',
    options: [
      {
        key: '1',
        text: '我对关系毫不满意',
        mapping: createMapping({})
      },
      {
        key: '2',
        text: '我对关系不太满意',
        mapping: createMapping({})
      },
      {
        key: '3',
        text: '我对关系满意程度一般',
        mapping: createMapping({})
      },
      {
        key: '4',
        text: '我对关系比较满意',
        mapping: createMapping({})
      },
      {
        key: '5',
        text: '我对关系非常满意',
        mapping: createMapping({})
      }
    ]
  }
]
