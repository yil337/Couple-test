/**
 * 24 种动物的人格报告文本
 * 基于 PDF 中的完整描述
 */

import { AnimalType } from './types'

export interface AnimalReport {
  /** 动物名称 */
  name: AnimalType
  /** 主要爱情风格 */
  loveStyle: string
  /** 主要依恋类型 */
  attachment: string
  /** 爱的语言 */
  loveLanguage: string
  /** 亲密关系中的表达倾向 */
  expression: string
  /** 亲密关系中的需求与不安全感来源 */
  needs: string
  /** 给亲密关系中伴侣的建议 */
  advice: string
}

/**
 * 动物报告数据
 * 注意：这里只包含基础结构，完整文本需要根据 PDF 补充
 */
export const ANIMAL_REPORTS: Record<AnimalType, AnimalReport> = {
  海豚: {
    name: '海豚',
    loveStyle: '激情型 (Passion)',
    attachment: '安全型 (Secure)',
    loveLanguage: '身体的接触、精心时刻',
    expression: '你的爱热烈但不失分寸，既能主动表达又能保持稳定。',
    needs: '你需要在关系中感受到激情与亲密，同时保持独立和尊重。',
    advice: '与海豚相处，请给予ta足够的关注和回应，同时保持自己的节奏。'
  },
  刺猬: {
    name: '刺猬',
    loveStyle: '激情型 (Passion)',
    attachment: '恐惧型 (Fearful)',
    loveLanguage: '身体的接触',
    expression: '想靠近却害怕受伤，热烈却犹豫。',
    needs: '你渴望激情，但又害怕被伤害，需要对方给予足够的安全感。',
    advice: '与刺猬相处，请温柔地靠近，给ta时间建立信任，不要急于推进关系。'
  },
  猫: {
    name: '猫',
    loveStyle: '激情型 (Passion)',
    attachment: '回避型 (Avoidant)',
    loveLanguage: '身体的接触',
    expression: '内心有热度，但怕被束缚，容易压抑自己的情感表达。',
    needs: '你需要激情，但同时也需要自由和空间。',
    advice: '与猫相处，请给ta足够的自由，不要过度束缚，让ta以自己的节奏靠近。'
  },
  孔雀: {
    name: '孔雀',
    loveStyle: '激情型 (Passion)',
    attachment: '焦虑型 (Anxious)',
    loveLanguage: '肯定的言辞、身体的接触',
    expression: '情绪强、渴望确认，投入快但容易不安。',
    needs: '你需要在关系中感受到被看见和被渴望，需要对方的肯定和回应。',
    advice: '与孔雀相处，请多给予ta肯定和关注，及时回应ta的情感需求。'
  },
  金毛犬: {
    name: '金毛犬',
    loveStyle: '友谊型 (Friendship)',
    attachment: '安全型 (Secure)',
    loveLanguage: '精心时刻、陪伴',
    expression: '温暖踏实，是典型伴侣式爱情。',
    needs: '你需要在关系中感受到稳定和陪伴，建立深厚的友谊基础。',
    advice: '与金毛犬相处，请给予ta稳定的陪伴和关注，一起建立美好的回忆。'
  },
  犀牛: {
    name: '犀牛',
    loveStyle: '实用型 (Pragmatic)',
    attachment: '安全型 (Secure)',
    loveLanguage: '服务的行动',
    expression: '理性与情感平衡，负责且稳重。',
    needs: '你需要在关系中感受到责任和承诺，建立稳定的未来规划。',
    advice: '与犀牛相处，请给予ta足够的信任和尊重，一起规划未来。'
  },
  海狸: {
    name: '海狸',
    loveStyle: '实用型 (Pragmatic)',
    attachment: '焦虑型 (Anxious)',
    loveLanguage: '服务的行动',
    expression: '急于建立稳定，将计划视为安全感。',
    needs: '你需要在关系中感受到稳定和计划，通过行动来表达爱。',
    advice: '与海狸相处，请给予ta足够的稳定感，一起制定计划和目标。'
  },
  狼: {
    name: '狼',
    loveStyle: '痴狂型 (Mania)',
    attachment: '安全型 (Secure)',
    loveLanguage: '身体的接触、肯定的言辞',
    expression: '深情投入但不失控。',
    needs: '你需要在关系中感受到强烈的连接和确认，需要对方的回应。',
    advice: '与狼相处，请给予ta足够的关注和回应，让ta感受到被爱。'
  },
  大象: {
    name: '大象',
    loveStyle: '利他型 (Agape)',
    attachment: '安全型 (Secure)',
    loveLanguage: '服务的行动、陪伴',
    expression: '愿给予且不牺牲自我。',
    needs: '你需要在关系中感受到被需要和被感谢，通过付出来表达爱。',
    advice: '与大象相处，请给予ta足够的感谢和认可，让ta感受到自己的付出被看见。'
  },
  树懒: {
    name: '树懒',
    loveStyle: '利他型 (Agape)',
    attachment: '回避型 (Avoidant)',
    loveLanguage: '服务的行动',
    expression: '会帮助对方，但保持明显边界。',
    needs: '你需要在关系中保持独立，同时给予对方帮助。',
    advice: '与树懒相处，请给予ta足够的空间和尊重，不要过度依赖。'
  },
  雪兔: {
    name: '雪兔',
    loveStyle: '利他型 (Agape)',
    attachment: '恐惧型 (Fearful)',
    loveLanguage: '服务的行动',
    expression: '想给予但害怕被拒绝。',
    needs: '你需要在关系中感受到安全，才能放心地给予。',
    advice: '与雪兔相处，请给予ta足够的温柔和理解，让ta感受到被接纳。'
  },
  乌龟: {
    name: '乌龟',
    loveStyle: '友谊型 (Friendship)',
    attachment: '回避型 (Avoidant)',
    loveLanguage: '精心时刻',
    expression: '淡淡互动、少主动，但长期稳定。',
    needs: '你需要在关系中保持距离，但建立稳定的友谊基础。',
    advice: '与乌龟相处，请给予ta足够的耐心和空间，不要急于推进关系。'
  },
  雪貂: {
    name: '雪貂',
    loveStyle: '友谊型 (Friendship)',
    attachment: '恐惧型 (Fearful)',
    loveLanguage: '精心时刻',
    expression: '在亲密和退缩之间摇摆不定。',
    needs: '你需要在关系中感受到安全，才能放心地靠近。',
    advice: '与雪貂相处，请给予ta足够的温柔和稳定，让ta感受到被理解。'
  },
  猫头鹰: {
    name: '猫头鹰',
    loveStyle: '实用型 (Pragmatic)',
    attachment: '回避型 (Avoidant)',
    loveLanguage: '服务的行动',
    expression: '理性强且自给自足，保持距离。',
    needs: '你需要在关系中保持独立，通过理性来管理关系。',
    advice: '与猫头鹰相处，请给予ta足够的尊重和空间，不要过度情感化。'
  },
  鹿: {
    name: '鹿',
    loveStyle: '实用型 (Pragmatic)',
    attachment: '恐惧型 (Fearful)',
    loveLanguage: '服务的行动',
    expression: '谨慎且害怕承担，推进速度慢。',
    needs: '你需要在关系中感受到安全，才能放心地承担责任。',
    advice: '与鹿相处，请给予ta足够的耐心和理解，不要急于推进关系。'
  },
  马: {
    name: '马',
    loveStyle: '痴狂型 (Mania)',
    attachment: '回避型 (Avoidant)',
    loveLanguage: '身体的接触',
    expression: '热度升高后容易迅速抽离。',
    needs: '你需要在关系中感受到自由，同时保持激情。',
    advice: '与马相处，请给予ta足够的空间和尊重，不要过度束缚。'
  },
  山猫: {
    name: '山猫',
    loveStyle: '痴狂型 (Mania)',
    attachment: '恐惧型 (Fearful)',
    loveLanguage: '身体的接触',
    expression: '强烈吸引与强烈逃离交替。',
    needs: '你需要在关系中感受到安全，才能放心地投入。',
    advice: '与山猫相处，请给予ta足够的温柔和理解，让ta感受到被接纳。'
  },
  水獭: {
    name: '水獭',
    loveStyle: '游戏型 (Game)',
    attachment: '安全型 (Secure)',
    loveLanguage: '肯定的言辞、精心时刻',
    expression: '玩笑自然，让关系轻盈又不失尊重。',
    needs: '你需要在关系中感受到轻松和乐趣，保持关系的活力。',
    advice: '与水獭相处，请给予ta足够的自由和乐趣，一起享受关系的美好。'
  },
  狐狸: {
    name: '狐狸',
    loveStyle: '游戏型 (Game)',
    attachment: '回避型 (Avoidant)',
    loveLanguage: '肯定的言辞',
    expression: '用幽默保持距离，擅长试探但难以深度进入关系。',
    needs: '你需要在关系中保持自由，通过幽默来管理关系。',
    advice: '与狐狸相处，请给予ta足够的空间和尊重，不要过度情感化。'
  },
  浣熊: {
    name: '浣熊',
    loveStyle: '游戏型 (Game)',
    attachment: '焦虑型 (Anxious)',
    loveLanguage: '肯定的言辞、精心时刻',
    expression: '用玩闹掩饰不安，希望吸引关注。',
    needs: '你需要在关系中感受到被关注和被肯定，通过幽默来缓解不安。',
    advice: '与浣熊相处，请给予ta足够的关注和回应，让ta感受到被看见。'
  },
  章鱼: {
    name: '章鱼',
    loveStyle: '游戏型 (Game)',
    attachment: '恐惧型 (Fearful)',
    loveLanguage: '精心时刻',
    expression: '用轻松外壳避免暴露脆弱，想靠近却逃避。',
    needs: '你需要在关系中感受到安全，才能放心地靠近。',
    advice: '与章鱼相处，请给予ta足够的温柔和理解，让ta感受到被接纳。'
  },
  企鹅: {
    name: '企鹅',
    loveStyle: '友谊型 (Friendship)',
    attachment: '焦虑型 (Anxious)',
    loveLanguage: '精心时刻、陪伴',
    expression: '渴望回应，沟通温柔但容易受伤。',
    needs: '你需要在关系中感受到被回应和被理解，建立稳定的友谊基础。',
    advice: '与企鹅相处，请给予ta足够的关注和回应，让ta感受到被理解。'
  },
  仓鼠: {
    name: '仓鼠',
    loveStyle: '利他型 (Agape)',
    attachment: '焦虑型 (Anxious)',
    loveLanguage: '服务的行动',
    expression: '容易为爱牺牲自我，用付出来换安全。',
    needs: '你需要在关系中感受到被需要和被感谢，通过付出来表达爱。',
    advice: '与仓鼠相处，请给予ta足够的感谢和认可，让ta感受到自己的付出被看见。'
  }
}

/**
 * 获取动物报告
 */
export function getAnimalReport(animal: AnimalType): AnimalReport {
  return ANIMAL_REPORTS[animal] || ANIMAL_REPORTS['海豚']
}

