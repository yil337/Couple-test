/**
 * 5级可变化卡片系统
 * 为每个动物提供独特的视觉特征，同时保持整体一致性
 */

import { AnimalType, LoveStyle, Attachment } from './types'

/**
 * 爱情风格主题色配置
 */
const LOVE_STYLE_COLORS: Record<LoveStyle, {
  primary: string
  secondary: string
  gradient: string
  cardBg: string
  badgeBg: string
  icon: string
}> = {
  PASSION: {
    primary: 'pink',
    secondary: 'purple',
    gradient: 'from-pink-500 to-purple-500',
    cardBg: 'bg-pink-50',
    badgeBg: 'bg-pink-100',
    icon: '❤️‍🔥'
  },
  GAME: {
    primary: 'orange',
    secondary: 'lime',
    gradient: 'from-orange-400 to-lime-400',
    cardBg: 'bg-orange-50',
    badgeBg: 'bg-orange-100',
    icon: '🎲'
  },
  FRIENDSHIP: {
    primary: 'blue',
    secondary: 'sky',
    gradient: 'from-blue-500 to-sky-400',
    cardBg: 'bg-blue-50',
    badgeBg: 'bg-blue-100',
    icon: '🤝'
  },
  PRAGMATIC: {
    primary: 'teal',
    secondary: 'slate',
    gradient: 'from-teal-500 to-slate-400',
    cardBg: 'bg-teal-50',
    badgeBg: 'bg-teal-100',
    icon: '📘'
  },
  MANIA: {
    primary: 'red',
    secondary: 'purple',
    gradient: 'from-red-600 to-purple-600',
    cardBg: 'bg-red-50',
    badgeBg: 'bg-red-100',
    icon: '💥'
  },
  AGAPE: {
    primary: 'amber',
    secondary: 'yellow',
    gradient: 'from-amber-300 to-yellow-200',
    cardBg: 'bg-amber-50',
    badgeBg: 'bg-amber-100',
    icon: '🌿'
  }
}

/**
 * 依恋类型饱和度调节
 */
const ATTACHMENT_MODIFIERS: Record<Attachment, {
  saturation: string
  opacity: string
  borderStyle: string
  tagStyle: string
}> = {
  SECURE: {
    saturation: 'saturate-100',
    opacity: 'opacity-100',
    borderStyle: 'rounded-2xl',
    tagStyle: 'rounded-full bg-opacity-60'
  },
  AVOIDANT: {
    saturation: 'saturate-50',
    opacity: 'opacity-90',
    borderStyle: 'rounded-lg',
    tagStyle: 'rounded-md border-2 border-gray-300'
  },
  ANXIOUS: {
    saturation: 'saturate-150',
    opacity: 'opacity-100',
    borderStyle: 'rounded-2xl',
    tagStyle: 'rounded-full bg-opacity-80'
  },
  FEARFUL: {
    saturation: 'saturate-75',
    opacity: 'opacity-85',
    borderStyle: 'rounded-xl',
    tagStyle: 'rounded-lg border border-gray-400 bg-opacity-50'
  }
}

/**
 * 动物特征纹理配置
 */
const ANIMAL_TEXTURES: Record<AnimalType, {
  pattern: string
  description: string
}> = {
  海豚: { pattern: 'bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-100', description: '波纹、蓝色轻渐变' },
  刺猬: { pattern: 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100', description: '细密点状纹理' },
  猫: { pattern: 'bg-gradient-to-br from-orange-100 via-amber-50 to-orange-100', description: '温暖斜纹' },
  孔雀: { pattern: 'bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100', description: '羽毛扇形淡纹理' },
  金毛犬: { pattern: 'bg-gradient-to-br from-yellow-100 via-amber-50 to-yellow-100', description: '柔和毛绒纹理' },
  犀牛: { pattern: 'bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200', description: '粗线条（沉稳）' },
  海狸: { pattern: 'bg-gradient-to-br from-amber-100 via-brown-50 to-amber-100', description: '木质纹理' },
  狼: { pattern: 'bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300', description: '夜空颗粒、深蓝纹理' },
  大象: { pattern: 'bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200', description: '浅灰色粗线条（象皮纹）' },
  树懒: { pattern: 'bg-gradient-to-br from-green-100 via-emerald-50 to-green-100', description: '树叶纹理' },
  雪兔: { pattern: 'bg-gradient-to-br from-white via-gray-50 to-white', description: '雪花纹理' },
  乌龟: { pattern: 'bg-gradient-to-br from-green-100 via-teal-50 to-green-100', description: '龟壳菱形纹' },
  雪貂: { pattern: 'bg-gradient-to-br from-white via-gray-50 to-white', description: '细密毛绒纹理' },
  猫头鹰: { pattern: 'bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100', description: '羽毛纹理' },
  鹿: { pattern: 'bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100', description: '斑点纹理' },
  马: { pattern: 'bg-gradient-to-br from-amber-100 via-brown-50 to-amber-100', description: '鬃毛纹理' },
  山猫: { pattern: 'bg-gradient-to-br from-orange-100 via-red-50 to-orange-100', description: '斑纹纹理' },
  水獭: { pattern: 'bg-gradient-to-br from-cyan-100 via-blue-50 to-cyan-100', description: '水波纹纹理' },
  狐狸: { pattern: 'bg-gradient-to-br from-orange-100 via-red-50 to-orange-100', description: '森林纹理、温暖斜纹' },
  浣熊: { pattern: 'bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200', description: '条纹纹理' },
  章鱼: { pattern: 'bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100', description: '触手纹理' },
  企鹅: { pattern: 'bg-gradient-to-br from-slate-200 via-gray-100 to-slate-200', description: '黑白纹理' },
  仓鼠: { pattern: 'bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100', description: '细密毛绒纹理' },
  天鹅: { pattern: 'bg-gradient-to-br from-white via-gray-50 to-white', description: '羽毛纹理' }
}

/**
 * Emoji布局配置（根据动物性格）
 */
const EMOJI_LAYOUTS: Record<AnimalType, {
  size: string
  position: string
  transform: string
  shadow: string
  description: string
}> = {
  海豚: { size: 'text-7xl', position: 'mr-4', transform: 'rotate-3', shadow: 'drop-shadow-lg', description: '外向、能量强、playful' },
  刺猬: { size: 'text-6xl', position: 'mr-3', transform: '', shadow: 'drop-shadow-md', description: '内向、谨慎' },
  猫: { size: 'text-6xl', position: 'mr-3', transform: '-rotate-2', shadow: 'drop-shadow-md', description: 'playful、神秘' },
  孔雀: { size: 'text-7xl', position: 'mr-4', transform: 'rotate-1', shadow: 'drop-shadow-xl', description: '外向、展示' },
  金毛犬: { size: 'text-6xl', position: 'mr-3', transform: '', shadow: 'drop-shadow-md', description: '稳定、温暖' },
  犀牛: { size: 'text-6xl', position: 'mr-3', transform: '', shadow: 'drop-shadow-md', description: '稳定、沉稳' },
  海狸: { size: 'text-6xl', position: 'mr-3', transform: '', shadow: 'drop-shadow-md', description: '稳定、务实' },
  狼: { size: 'text-7xl', position: 'mr-4', transform: '', shadow: 'drop-shadow-xl', description: '强烈、深沉' },
  大象: { size: 'text-7xl', position: 'mr-4', transform: '', shadow: 'drop-shadow-lg', description: '稳定、强大' },
  树懒: { size: 'text-5xl', position: 'mr-2', transform: '', shadow: 'drop-shadow-sm', description: '内向、慢热' },
  雪兔: { size: 'text-5xl', position: 'mr-2', transform: '', shadow: 'drop-shadow-sm', description: '内向、温柔' },
  乌龟: { size: 'text-5xl', position: 'mr-2', transform: '', shadow: 'drop-shadow-sm', description: '稳定、慢热' },
  雪貂: { size: 'text-5xl', position: 'mr-2', transform: '', shadow: 'drop-shadow-sm', description: '内向、敏感' },
  猫头鹰: { size: 'text-6xl', position: 'mr-3', transform: '', shadow: 'drop-shadow-lg', description: '理性、深沉' },
  鹿: { size: 'text-6xl', position: 'mr-3', transform: '', shadow: 'drop-shadow-md', description: '谨慎、优雅' },
  马: { size: 'text-7xl', position: 'mr-4', transform: 'rotate-1', shadow: 'drop-shadow-lg', description: '外向、能量强' },
  山猫: { size: 'text-6xl', position: 'mr-3', transform: '', shadow: 'drop-shadow-xl', description: '复杂、深沉' },
  水獭: { size: 'text-6xl', position: 'mr-3', transform: 'rotate-2', shadow: 'drop-shadow-md', description: 'playful、活泼' },
  狐狸: { size: 'text-6xl', position: 'mr-3', transform: '-rotate-1', shadow: 'drop-shadow-md', description: 'playful、聪明' },
  浣熊: { size: 'text-6xl', position: 'mr-3', transform: 'rotate-1', shadow: 'drop-shadow-md', description: 'playful、活泼' },
  章鱼: { size: 'text-6xl', position: 'mr-3', transform: '', shadow: 'drop-shadow-lg', description: '复杂、灵活' },
  企鹅: { size: 'text-6xl', position: 'mr-3', transform: '', shadow: 'drop-shadow-md', description: '稳定、可爱' },
  仓鼠: { size: 'text-5xl', position: 'mr-2', transform: '', shadow: 'drop-shadow-sm', description: '内向、温柔' },
  天鹅: { size: 'text-6xl', position: 'mr-3', transform: '', shadow: 'drop-shadow-lg', description: '优雅、深情' }
}

/**
 * 根据Sternberg三角理论确定边框样式
 * 需要从个人画像中获取Sternberg维度得分
 */
export function getBorderStyle(sternbergVector: { intimacy: number, passion: number, commitment: number }): {
  borderClass: string
  glowClass: string
  description: string
} {
  const { intimacy, passion, commitment } = sternbergVector
  const maxDim = Math.max(intimacy, passion, commitment)
  
  if (passion === maxDim) {
    return {
      borderClass: 'border-2 border-pink-500', // 从 pink-400 增强到 pink-500
      glowClass: 'card-glow-passion',
      description: '激情最高 - 发光边缘'
    }
  } else if (intimacy === maxDim) {
    return {
      borderClass: 'border-2 border-blue-500', // 从 blue-300 增强到 blue-500
      glowClass: 'card-glow-intimacy',
      description: '亲密最高 - 圆角更大、更加柔和'
    }
  } else {
    return {
      borderClass: 'border-4 border-green-500', // 从 green-400 增强到 green-500
      glowClass: 'card-glow-commitment',
      description: '承诺最高 - 加粗边框、稳定感'
    }
  }
}

/**
 * 获取动物的完整卡片样式配置
 */
export function getAnimalCardStyle(
  animal: AnimalType,
  loveStyle: LoveStyle,
  attachment: Attachment,
  sternbergVector?: { intimacy: number, passion: number, commitment: number }
) {
  const styleColors = LOVE_STYLE_COLORS[loveStyle]
  const attachMod = ATTACHMENT_MODIFIERS[attachment]
  const texture = ANIMAL_TEXTURES[animal]
  const emojiLayout = EMOJI_LAYOUTS[animal]
  const borderStyle = sternbergVector ? getBorderStyle(sternbergVector) : {
    borderClass: 'border-2 border-gray-200',
    glowClass: 'shadow-md',
    description: '默认边框'
  }

  return {
    // 主题色（根据爱情风格 × 依恋类型）
    theme: {
      gradient: `${styleColors.gradient} ${attachMod.saturation}`,
      cardBg: `${styleColors.cardBg} ${attachMod.opacity}`,
      badgeBg: `${styleColors.badgeBg} ${attachMod.opacity}`,
      icon: styleColors.icon
    },
    // 背景纹理
    texture: texture.pattern,
    // 边框样式
    border: {
      class: `${borderStyle.borderClass} ${attachMod.borderStyle}`,
      glow: borderStyle.glowClass
    },
    // Emoji布局
    emoji: {
      size: emojiLayout.size,
      position: emojiLayout.position,
      transform: emojiLayout.transform,
      shadow: emojiLayout.shadow
    },
    // Tag样式
    tag: {
      class: `${attachMod.tagStyle} ${styleColors.badgeBg}`,
      icon: styleColors.icon
    }
  }
}

/**
 * 从动物类型反推爱情风格和依恋类型
 */
export function getAnimalTypes(animal: AnimalType): { loveStyle: LoveStyle, attachment: Attachment } {
  const matrix: Record<LoveStyle, Record<Attachment, AnimalType>> = {
    PASSION: {
      SECURE: '海豚',
      AVOIDANT: '猫',
      ANXIOUS: '孔雀',
      FEARFUL: '刺猬'
    },
    GAME: {
      SECURE: '水獭',
      AVOIDANT: '狐狸',
      ANXIOUS: '浣熊',
      FEARFUL: '章鱼'
    },
    FRIENDSHIP: {
      SECURE: '金毛犬',
      AVOIDANT: '乌龟',
      ANXIOUS: '企鹅',
      FEARFUL: '雪貂'
    },
    PRAGMATIC: {
      SECURE: '犀牛',
      AVOIDANT: '猫头鹰',
      ANXIOUS: '海狸',
      FEARFUL: '鹿'
    },
    MANIA: {
      SECURE: '狼',
      AVOIDANT: '马',
      ANXIOUS: '天鹅',
      FEARFUL: '山猫'
    },
    AGAPE: {
      SECURE: '大象',
      AVOIDANT: '树懒',
      ANXIOUS: '仓鼠',
      FEARFUL: '雪兔'
    }
  }

  for (const [ls, attachments] of Object.entries(matrix)) {
    for (const [at, anim] of Object.entries(attachments)) {
      if (anim === animal) {
        return {
          loveStyle: ls as LoveStyle,
          attachment: at as Attachment
        }
      }
    }
  }

  // 默认值
  return {
    loveStyle: 'PASSION',
    attachment: 'SECURE'
  }
}

