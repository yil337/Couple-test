// Type definitions for LoveStyle × Attachment model

export const TYPE_MAP = {
  "P-S": { name: "暖焰型", desc: "热烈但不失分寸，既能主动表达又能保持稳定。" },
  "P-A": { name: "冷火型", desc: "内心有热度，但怕被束缚，容易压抑自己的情感表达。" },
  "P-X": { name: "烈心型", desc: "情绪强、渴望确认，投入快但容易不安。" },
  "P-F": { name: "焰影型", desc: "想靠近却害怕受伤，热烈却犹豫。" },

  "G-S": { name: "轻光型", desc: "玩笑自然，让关系轻盈又不失尊重。" },
  "G-A": { name: "狐烟型", desc: "用幽默保持距离，擅长试探但难以深度进入关系。" },
  "G-X": { name: "迷踪型", desc: "用玩闹掩饰不安，希望吸引关注。" },
  "G-F": { name: "隐戏型", desc: "用轻松外壳避免暴露脆弱，想靠近却逃避。" },

  "F-S": { name: "松风型", desc: "温暖踏实，是典型伴侣式爱情。" },
  "F-A": { name: "静林型", desc: "淡淡互动、少主动，但长期稳定。" },
  "F-X": { name: "依露型", desc: "渴望回应，沟通温柔但容易受伤。" },
  "F-F": { name: "远岸型", desc: "在亲密和退缩之间摇摆不定。" },

  "U-S": { name: "稳岩型", desc: "理性与情感平衡，负责且稳重。" },
  "U-A": { name: "石壳型", desc: "理性强且自给自足，保持距离。" },
  "U-X": { name: "急稳型", desc: "急于建立稳定，将计划视为安全感。" },
  "U-F": { name: "潜固型", desc: "谨慎且害怕承担，推进速度慢。" },

  "C-S": { name: "深焰型", desc: "深情投入但不失控。" },
  "C-A": { name: "断绳型", desc: "热度升高后容易迅速抽离。" },
  "C-X": { name: "旋执型", desc: "强依附、强关注、情绪波动大。" },
  "C-F": { name: "影陷型", desc: "强烈吸引与强烈逃离交替。" },

  "A-S": { name: "泽心型", desc: "愿给予且不牺牲自我。" },
  "A-A": { name: "远守型", desc: "会帮助对方，但保持明显边界。" },
  "A-X": { name: "献燃型", desc: "容易为爱牺牲自我，用付出来换安全。" },
  "A-F": { name: "寒绒型", desc: "想给予但害怕被拒绝。" }
};

export const ANIMAL_MAP = {
  "P-S": "海豚",
  "P-A": "猫",
  "P-X": "孔雀",
  "P-F": "刺猬",

  "G-S": "水獭",
  "G-A": "狐狸",
  "G-X": "浣熊",
  "G-F": "章鱼",

  "F-S": "金毛犬",
  "F-A": "乌龟",
  "F-X": "企鹅",
  "F-F": "雪貂",

  "U-S": "犀牛",
  "U-A": "猫头鹰",
  "U-X": "海狸",
  "U-F": "鹿",

  "C-S": "狼",
  "C-A": "马",
  "C-X": "天鹅",
  "C-F": "山猫",

  "A-S": "大象",
  "A-A": "树懒",
  "A-X": "仓鼠",
  "A-F": "雪豹"
};

export const QUESTIONS = [
  {
    id: 1,
    text: "在关系中你最自然的互动方式？",
    options: [
      { label: "A. 直白表达感受", style: "P", attach: "S" },
      { label: "B. 用玩笑淡化紧张", style: "G", attach: "A" },
      { label: "C. 观察后再行动", style: "F", attach: "F" },
      { label: "D. 先确认对方是否满意", style: "A", attach: "X" }
    ]
  },
  {
    id: 2,
    text: "暧昧时期你的典型感受？",
    options: [
      { label: "A. 热情期待", style: "P", attach: "S" },
      { label: "B. 时近时远", style: "G", attach: "A" },
      { label: "C. 担心不被喜欢", style: "F", attach: "X" },
      { label: "D. 想靠近又害怕", style: "A", attach: "F" }
    ]
  },
  {
    id: 3,
    text: "如果你喜欢上一个人，你会？",
    options: [
      { label: "A. 主动表达", style: "P", attach: "S" },
      { label: "B. 调情试探", style: "G", attach: "A" },
      { label: "C. 小心保持平衡", style: "U", attach: "A" },
      { label: "D. 很用力地付出", style: "A", attach: "X" }
    ]
  },
  {
    id: 4,
    text: "冲突时你倾向于？",
    options: [
      { label: "A. 坦诚沟通", style: "F", attach: "S" },
      { label: "B. 先冷一下", style: "G", attach: "A" },
      { label: "C. 容易情绪爆发", style: "C", attach: "X" },
      { label: "D. 逃离或沉默", style: "U", attach: "F" }
    ]
  },
  {
    id: 5,
    text: "关系稳定后你最需要？",
    options: [
      { label: "A. 激情与接触", style: "P", attach: "S" },
      { label: "B. 轻松感", style: "G", attach: "A" },
      { label: "C. 情绪支持", style: "F", attach: "X" },
      { label: "D. 稳定节奏", style: "U", attach: "S" }
    ]
  },
  {
    id: 6,
    text: "你最害怕的关系情境？",
    options: [
      { label: "A. 对方忽然抽离", style: "C", attach: "X" },
      { label: "B. 被要求更多亲密", style: "G", attach: "A" },
      { label: "C. 被误解", style: "F", attach: "F" },
      { label: "D. 依赖过深", style: "U", attach: "A" }
    ]
  },
  {
    id: 7,
    text: "你表达爱意的方式？",
    options: [
      { label: "A. 制造浪漫", style: "P", attach: "S" },
      { label: "B. 调戏玩闹", style: "G", attach: "A" },
      { label: "C. 聊天陪伴", style: "F", attach: "X" },
      { label: "D. 实质行动", style: "A", attach: "S" }
    ]
  },
  {
    id: 8,
    text: "面对承诺你通常？",
    options: [
      { label: "A. 期待共同目标", style: "P", attach: "S" },
      { label: "B. 想避免束缚", style: "G", attach: "A" },
      { label: "C. 担心自己不够好", style: "F", attach: "X" },
      { label: "D. 想要但犹豫", style: "A", attach: "F" }
    ]
  },
  {
    id: 9,
    text: "你理想的关系？",
    options: [
      { label: "A. 热烈吸引", style: "P", attach: "S" },
      { label: "B. 自在轻松", style: "G", attach: "A" },
      { label: "C. 情绪连接", style: "F", attach: "X" },
      { label: "D. 稳定可靠", style: "U", attach: "S" }
    ]
  },
  {
    id: 10,
    text: "对方不回消息时？",
    options: [
      { label: "A. 冷静询问", style: "S", attach: "S" },
      { label: "B. 享受自由", style: "G", attach: "A" },
      { label: "C. 过度思考", style: "F", attach: "X" },
      { label: "D. 期待+害怕", style: "A", attach: "F" }
    ]
  },
  {
    id: 11,
    text: "如果对方非常依赖你？",
    options: [
      { label: "A. 被需要的感觉不错", style: "S", attach: "S" },
      { label: "B. 压力大", style: "G", attach: "A" },
      { label: "C. 担心不够好", style: "F", attach: "X" },
      { label: "D. 想靠近又害怕", style: "A", attach: "F" }
    ]
  },
  {
    id: 12,
    text: "你看重的爱情价值？",
    options: [
      { label: "A. 激情", style: "P", attach: "S" },
      { label: "B. 乐趣", style: "G", attach: "A" },
      { label: "C. 情绪连接", style: "F", attach: "X" },
      { label: "D. 责任稳定", style: "U", attach: "S" }
    ]
  },
  {
    id: 13,
    text: "你对肢体接触的态度？",
    options: [
      { label: "A. 非常重要", style: "P", attach: "S" },
      { label: "B. 看气氛", style: "G", attach: "A" },
      { label: "C. 要信任才开放", style: "F", attach: "F" },
      { label: "D. 紧张但渴望", style: "A", attach: "X" }
    ]
  },
  {
    id: 14,
    text: "情绪冲突时？",
    options: [
      { label: "A. 表达需要", style: "F", attach: "X" },
      { label: "B. 回避对话", style: "G", attach: "A" },
      { label: "C. 想靠近但怕被嫌", style: "A", attach: "F" },
      { label: "D. 稳稳处理", style: "S", attach: "S" }
    ]
  },
  {
    id: 15,
    text: "你在关系中最需要？",
    options: [
      { label: "A. 被看见被渴望", style: "P", attach: "S" },
      { label: "B. 被接纳被留白", style: "G", attach: "A" },
      { label: "C. 被肯定被安抚", style: "F", attach: "X" },
      { label: "D. 被信任被依靠", style: "U", attach: "S" }
    ]
  }
];

