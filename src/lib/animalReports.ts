/**
 * 24 种动物的人格报告文本
 * 基于 PDF 中的完整描述
 */

import { AnimalType } from './types'

export interface AnimalReport {
  /** 动物名称 */
  name: AnimalType
  /** 表情符号 */
  emoji: string
  /** 开头介绍 */
  description?: string
  /** 主要爱情风格（完整描述） */
  loveStyle: string
  /** 主要依恋类型（完整描述） */
  attachment: string
  /** 爱的语言（完整描述） */
  loveLanguage: string
  /** 亲密关系中的表达倾向 */
  expression: string
  /** 亲密关系中的需求与不安全感来源 */
  needs: string
  /** 给亲密关系中伴侣的建议 */
  advice: string
}

/**
 * 动物卡片背景颜色配置
 */
export const ANIMAL_COLORS: Record<AnimalType, {
  gradient: string
  cardBg: string
  badgeBg: string
}> = {
  海豚: { gradient: 'from-blue-400 to-cyan-300', cardBg: 'bg-blue-50', badgeBg: 'bg-blue-100' },
  刺猬: { gradient: 'from-gray-400 to-gray-300', cardBg: 'bg-gray-50', badgeBg: 'bg-gray-100' },
  猫: { gradient: 'from-orange-400 to-amber-300', cardBg: 'bg-orange-50', badgeBg: 'bg-orange-100' },
  孔雀: { gradient: 'from-purple-500 to-pink-400', cardBg: 'bg-purple-50', badgeBg: 'bg-purple-100' },
  金毛犬: { gradient: 'from-yellow-400 to-amber-300', cardBg: 'bg-yellow-50', badgeBg: 'bg-yellow-100' },
  犀牛: { gradient: 'from-gray-600 to-gray-500', cardBg: 'bg-gray-50', badgeBg: 'bg-gray-100' },
  海狸: { gradient: 'from-brown-500 to-amber-600', cardBg: 'bg-amber-50', badgeBg: 'bg-amber-100' },
  狼: { gradient: 'from-gray-700 to-gray-600', cardBg: 'bg-gray-50', badgeBg: 'bg-gray-100' },
  大象: { gradient: 'from-gray-500 to-gray-400', cardBg: 'bg-gray-50', badgeBg: 'bg-gray-100' },
  树懒: { gradient: 'from-green-600 to-emerald-500', cardBg: 'bg-green-50', badgeBg: 'bg-green-100' },
  雪兔: { gradient: 'from-white to-gray-100', cardBg: 'bg-gray-50', badgeBg: 'bg-gray-100' },
  乌龟: { gradient: 'from-green-500 to-teal-400', cardBg: 'bg-green-50', badgeBg: 'bg-green-100' },
  雪貂: { gradient: 'from-white to-gray-200', cardBg: 'bg-gray-50', badgeBg: 'bg-gray-100' },
  猫头鹰: { gradient: 'from-amber-600 to-yellow-500', cardBg: 'bg-amber-50', badgeBg: 'bg-amber-100' },
  鹿: { gradient: 'from-amber-400 to-yellow-300', cardBg: 'bg-amber-50', badgeBg: 'bg-amber-100' },
  马: { gradient: 'from-brown-400 to-amber-500', cardBg: 'bg-amber-50', badgeBg: 'bg-amber-100' },
  山猫: { gradient: 'from-orange-500 to-red-400', cardBg: 'bg-orange-50', badgeBg: 'bg-orange-100' },
  水獭: { gradient: 'from-cyan-400 to-blue-300', cardBg: 'bg-cyan-50', badgeBg: 'bg-cyan-100' },
  狐狸: { gradient: 'from-orange-500 to-red-400', cardBg: 'bg-orange-50', badgeBg: 'bg-orange-100' },
  浣熊: { gradient: 'from-gray-600 to-gray-500', cardBg: 'bg-gray-50', badgeBg: 'bg-gray-100' },
  章鱼: { gradient: 'from-purple-400 to-pink-300', cardBg: 'bg-purple-50', badgeBg: 'bg-purple-100' },
  企鹅: { gradient: 'from-slate-600 to-gray-500', cardBg: 'bg-slate-50', badgeBg: 'bg-slate-100' },
  仓鼠: { gradient: 'from-amber-400 to-yellow-300', cardBg: 'bg-amber-50', badgeBg: 'bg-amber-100' },
  天鹅: { gradient: 'from-white to-gray-100', cardBg: 'bg-gray-50', badgeBg: 'bg-gray-100' }
}

/**
 * 动物报告数据
 * 注意：这里只包含基础结构，完整文本需要根据 PDF 补充
 */
export const ANIMAL_REPORTS: Record<AnimalType, AnimalReport> = {
  海豚: {
    name: '海豚',
    emoji: '🐬',
    description: '你的动物型人格是海豚，你既有海豚的阳光明亮，又有海豚的细腻治愈。',
    loveStyle: `Lee's Love Style（激情型 Passionate）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是激情型，你的世界热烈且真诚，爱得明亮，不隐藏、不羞怯，对情感投入快、表达直接，也愿意敞开心扉让在乎的人进入自己的世界。`,
    attachment: `Adult Attachment Theory（安全 Secure）

根据心理学中的成人依恋理论（Adult Attachment Theory），你是安全型，你既能稳定的信任身边的人，不压抑自己的需求，又不会过度依赖，这样的你对亲密感持开放态度。`,
    loveLanguage: `在亲密关系中，你喜欢透过亲密触碰与鼓励性语言来传达爱意，希望对方也能以相应的热度回应你。`,
    expression: `海豚的爱时常像浪花一样明亮而温柔。你享受双向奔赴的激情，不会逃避靠近，也不会压迫彼此，既愿意主动、勇敢的表达感觉，同时也懂得尊重对方的节奏。`,
    needs: `你时常需要真实、明确的情绪回应，若长期得不到相应的情绪温度，会感到自己"被冷落"，但好在你不会立刻焦虑，而是试着沟通。`,
    advice: `对小海豚而言，最好的方式是"真实回应"，对ta来说，坦率、轻松而直接的互动能让关系保持清澈。若你能在关键时刻给予热度，并允许自己被看见，就能与海豚一起建立温暖、自然的亲密连接。`
  },
  刺猬: {
    name: '刺猬',
    emoji: '🦔',
    description: '你的动物型人格是刺猬，你既有刺猬强烈又直白的情感，又有刺猬那份敏感与小心翼翼。',
    loveStyle: `Lee's Love Style（激情 Passion）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是激情型，你内心拥有强烈的情绪能量，对爱的感受力强，只要心动就会全心全意的投入。`,
    attachment: `Adult Attachment Theory（恐惧 Fearful）

根据成人依恋理论（Adult Attachment Theory），你是恐惧型，你渴望靠近，却又害怕受伤；你希望被理解，却又不知道如何打开自己。这份矛盾让你的亲密关系既真挚又脆弱，这也是为什么你的热情常常被自己压制，不敢完全释放。`,
    loveLanguage: `你不擅长直接说爱，而是喜欢透过行动与陪伴实际的表达温度，也许生活中的你会悄悄帮在意的人准备好他们需要的东西、会记得对方的小习惯。`,
    expression: `你的爱是深情但谨慎的：你会把对方放在心里，却不敢太靠近。有时你靠近一步，却又因为害怕不好的结果而退开两步。`,
    needs: `你害怕受伤、害怕被看穿内心的脆弱、害怕自己的情绪给别人带来压力。这让你"想靠近、又害怕靠近"。`,
    advice: `和小刺猬相处，要慢、要稳、要温柔。不要让ta感觉到有压力、不急不推，只需要告诉ta："你靠近我不会受伤。"当ta真正感到安全时，会展现最柔软、最真诚的爱。`
  },
  猫: {
    name: '猫',
    emoji: '🐈',
    description: '你的动物型人格是猫，你既有小猫的热情可爱，又有小猫独有的神秘矜贵。',
    loveStyle: `Lee's Love Style（激情 Passion）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是激情型，你的内心有对亲密关系的强烈需求与对人的热情，但表达往往带着隐藏与矜持。`,
    attachment: `Adult Attachment Theory（回避 Avoidant）

根据心理学中的成人依恋理论（Adult Attachment Theory），你是回避型，你天生对过度靠近的关系感到敏感，喜欢"掌控距离"，对方越是亲密靠近，你越容易后撤。`,
    loveLanguage: `你偏好柔和、间接的表达方式，如肯定的话语、鼓励，而非密集的身体接触。`,
    expression: `猫会被浓烈的情绪吸引，但当互动开始变得"太高频"或"太深入"时，你会本能往后退，你需要自己的空间，需要节奏感，也需要一个能理解自己内心中的纠结的人。`,
    needs: `你需要既能点燃激情、又不试图"靠的太近"的伴侣，你害怕失控，也怕被束缚，当对方太粘人或太主动时，会立刻启动自我保护机制。`,
    advice: `与小猫相处最重要的是尊重他们"既热情又害羞"的本质。给ta时间，让ta自己接受你、靠近你，当ta主动靠近时，回应即可，不需要过度热情。让ta感觉"想亲近不是义务，而是自由"，你会发现小猫的爱非常深刻。`
  },
  孔雀: {
    name: '孔雀',
    emoji: '🦚',
    description: '你的动物型人格是孔雀，你既有孔雀的绚烂热情，又有孔雀那份需要被看见的敏感与骄傲。',
    loveStyle: `Lee's Love Style（激情 Passion）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是激情型，你的爱热烈而饱满，情绪浓度高，面对心动，你既愿意全身心投入，也渴望爱是双向奔赴的。`,
    attachment: `Adult Attachment Theory（焦虑 Anxious）

根据成人依恋理论（Adult Attachment Theory），你是焦虑型，你对关系十分在意，能够很敏感的观察、感受到对方的情绪变化。面对不确定，你需要立即确认，需要回应，需要确定自己是被放在重要位置的。`,
    loveLanguage: `在亲密关系中，你喜欢沉浸式的陪伴，以及亲密的肢体互动，以此来切实的感受到对方是"在你身边的"。`,
    expression: `你会主动、热烈、投入地表达你的爱意，也会不断寻求交流与连结。你渴望被关注、被欣赏、被重视，这是你最直白的爱的方式。`,
    needs: `你最怕的是"被忽略"。当对方变得冷淡、或不可琢磨时，你容易产生不安，开始猜测自己是否不够好，而这份不安则是来自"太在乎"。`,
    advice: `与小孔雀相处，最重要的是让ta知道"你看见了ta"，请保持回应、肯定、的态度，保持热烈的温度，哪怕只是告诉ta："我在这里。"一旦得到安全，孔雀会把最明亮、最炽热的爱全都给你。`
  },
  金毛犬: {
    name: '金毛犬',
    emoji: '🐕',
    description: '你的动物型人格是金毛犬，你既有金毛犬的温暖，也有金毛犬那份踏实可靠的力量。',
    loveStyle: `Lee's Love Style（友谊型 Storge）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是友谊型。你在关系里重视稳定与真诚，不需要轰轰烈烈，而是喜欢长久、深入、像家人密友般的亲密。`,
    attachment: `Adult Attachment Theory（安全 Secure）

根据成人依恋理论（Adult Attachment Theory），你是安全型，你不会过度占有在乎的人，也不会轻易焦虑，你能稳定的信任身边的人，也能自由表达自己的需要。`,
    loveLanguage: `你最擅长通过"和你一起做事情"、"帮你分担"来表达关心，你的爱是具体的、落地的、可依靠的。`,
    expression: `金毛的爱很温和，你愿意长期陪伴对方，也愿意倾听、照顾、支持对方。你并不追求戏剧性的爱情，而是希望关系能成为双方的避风港。`,
    needs: `你不常焦虑，但你害怕的是"被当成理所当然"，你希望对方能和你一样重视这段关系。`,
    advice: `不要忽略小金毛的稳定付出，对ta来说，一句"我知道你很努力"，胜过很多华丽的情话。若能给予ta同等的稳定与陪伴，你会拥有一个真正可以托付的温暖伴侣。`
  },
  犀牛: {
    name: '犀牛',
    emoji: '🦏',
    description: '你的动物型人格是犀牛，你既有犀牛的坚定务实，又有犀牛那份可靠沉稳的力量。',
    loveStyle: `Lee's Love Style（实用 Pragma）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是实用型。你在关系中注重现实、长远、稳定与可持续的发展，你不追求轰动的浪漫，而追求细水长流，可以长久一起生活的人。`,
    attachment: `Adult Attachment Theory（安全 Secure）

根据成人依恋理论（Adult Attachment Theory），你是安全型，你能稳定地信任在乎的人，并愿意与人共同面对生活的大小事务，你对自己的情绪有很强的掌握，也不会轻易把情绪推给别人。`,
    loveLanguage: `你偏好"用行动表示爱"——陪伴对方、为对方做事、替对方分担，就是你最想给予对方的表达方式。`,
    expression: `你的爱很朴素，但很深，你会实际的投入，会规划未来，会默默扛起责任，也许你不太说甜言蜜语，但你的陪伴比语言更可靠。`,
    needs: `你最怕关系变得混乱、不确定，你需要可预期、有方向的关系，讨厌忽冷忽热或言行不一致。`,
    advice: `与小犀牛相处，需要"诚实"与"信任"，多告诉ta你的计划、你的期待、你的决定，将ta放在你的计划之中。只要你愿意一起走未来，犀牛就会用尽全力守护这段关系。`
  },
  海狸: {
    name: '海狸',
    emoji: '🦫',
    description: '你的动物型人格是海狸，你既有海狸的认真负责，又有海狸的那份敏感。',
    loveStyle: `Lee's Love Style（实用 Pragma）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是实用型，你希望把关系经营得稳定长久的，所以你会进行安排、会计划，愿意通过自己的努力让一切变得更好。`,
    attachment: `Adult Attachment Theory（焦虑 Anxious）

根据成人依恋理论（Adult Attachment Theory），你是焦虑型，有时候你会担心自己做得不够好、担心对方不够满意，而因此常常给自己施加太多责任。`,
    loveLanguage: `关系中的你最常用"服务性举动"表达爱，你会勇于替对方承担压力、替对方处理问题，用行动证明你在乎。`,
    expression: `你的爱是一种"责任的温柔"，你习惯照顾别人，也习惯把事情做到最好，但你偶尔会因为太努力而感到累。`,
    needs: `你会害怕让对方失望，也害怕不被珍惜。在亲密关系中，这些担忧与恐惧需要通过肯定、理解与对方的共同承担来被化解，而不是不被理解、被认为"只是太紧张"。`,
    advice: `与小海狸相处，请多给予肯定与感谢，告诉ta："你已经做得很好了。"这样海狸才会卸下过度的责任感，展现最真诚、最可靠的爱。`
  },
  狼: {
    name: '狼',
    emoji: '🐺',
    description: '你的动物型人格是狼，你既有狼的深情坚定，又有狼那份热烈的执着。',
    loveStyle: `Lee's Love Style（痴狂 Mania）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是痴狂型。你的爱强烈、投入、真挚，面对心动，你坚持、热烈，愿意为所爱的人付出自己的全部情绪与力量。`,
    attachment: `Adult Attachment Theory（安全 Secure）

根据成人依恋理论（Adult Attachment Theory），你是安全型。你的情感虽然强烈，但内核却是稳定的，你深情却不会失去分寸，你投入却不会失控。`,
    loveLanguage: `你重视身体上的亲密感，也重视在一起时的高质量陪伴，一个拥抱、一句肯定的话语，对你都是非常重要的爱的语言。`,
    expression: `你的爱干净而直接，你会保护、会陪伴、会站在对方身边。你习惯用实际的行动与自身的存在告诉对方："我在这里，我不会离开。"`,
    needs: `你最怕你的感情被误解，付出被认为"太浓烈"，你很需要对方能看见你有事并不直白的温柔。`,
    advice: `与小狼相处，请理解ta的深情，接受ta的靠近，回应ta的热度。只要你不退缩、不敷衍，ta就会成为最忠诚、最可靠的伴侣。`
  },
  大象: {
    name: '大象',
    emoji: '🐘',
    description: '你的动物型人格是大象，你既有大象的温柔善良，又有大象那份深情稳固的力量。',
    loveStyle: `Lee's Love Style（利他 Agape）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是利他型。你愿意为爱付出，也愿意照顾、包容、守护在乎的人，你的温柔不求回报，是一种自然的本能。`,
    attachment: `Adult Attachment Theory（安全 Secure）

根据成人依恋理论（Adult Attachment Theory），你是安全型。你付出，但不是自我牺牲；你温柔，但有力量、有界线。你知道如何照顾别人，更知道如何照顾自己。`,
    loveLanguage: `你常透过"实质性帮助他人的行动"来表达爱，例如为对方准备需要的事物、主动帮忙、默默守护对方的生活。`,
    expression: `你的爱安静、稳定、踏实，和你一起生活也许不会充满戏剧性的色彩，但一定会感受到你稳稳地陪伴、满满的安全感。你是非常值得依靠的存在。`,
    needs: `关系中的你很少焦虑，但你最在乎的是自己的付出能够被看见并被接纳、欣赏。虽然也许你不求回报，但还是希望这份爱被珍惜。`,
    advice: `与小象相处，请学会表达感谢，并与ta一起分担生活，不要让ta一个人承担太多。只要你愿意回馈同等的稳定，ta会成为你最坚定的伴侣。`
  },
  树懒: {
    name: '树懒',
    emoji: '🦥',
    description: '你的动物型人格是树懒，你既有树懒的慢热，又有树懒那份温柔的贴心。',
    loveStyle: `Lee's Love Style（利他 Agape）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是利他型。你愿意为对方付出，也愿意默默照顾，不求回报，不求张扬。`,
    attachment: `Adult Attachment Theory（回避 Avoidant）

根据成人依恋理论（Adult Attachment Theory），你是回避型。你常常关心身边的人，但不喜欢过度暴露自己的情绪，也害怕让自己成为别人的负担。`,
    loveLanguage: `你的表达方式就是通过"安静的照顾"，比如默默完成对方的需求、在对方需要时出现，你的付出时常不要求对方强烈的回应，不为身边的人制造压力、负担。`,
    expression: `树懒的爱温柔、慢、深。你不喜欢大起大落的不稳定性，也不喜欢过度的情绪拉扯，你更习惯在生活的细节里表达情感。`,
    needs: `在关系中，你最怕"被情绪压得喘不过气"，也害怕自己的存在让任何身边的人感到不舒服。你需要一个可以给你空间、不会强迫你做出选择的人。`,
    advice: `与小树懒相处，请一定要温柔、稳定。给ta多一点空间、一点自由，ta会在最安静的方式里，把最柔软的爱给你。`
  },
  乌龟: {
    name: '乌龟',
    emoji: '🐢',
    description: '你的动物型人格是乌龟，你既有乌龟的安静踏实，又有乌龟那份慢热的珍贵。',
    loveStyle: `Lee's Love Style（友谊 Storge）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是友谊型。你喜欢稳定、自然、不急不躁的关系，情感对你来说更像是长久的"陪伴"而非一时的"冲动"。`,
    attachment: `Adult Attachment Theory（回避 Avoidant）

根据成人依恋理论（Adult Attachment Theory），你是回避型，你很重视自己的节奏，并且需要一定的自我空间，太快、太强烈的靠近会让你不安。`,
    loveLanguage: `你不喜欢夸张的表达，你更擅长默默做事、在将爱意融进日常小事里默默的向对方展现自己的关心。`,
    expression: `你的爱安静而细腻，你不是那种会冲上前告白或大声示爱的人，但你会记得对方的习惯、需要和感受，将对方的想法与感受放在自己的考虑之中。`,
    needs: `你害怕被催促、害怕被情绪淹没，也害怕自己无法回应对方的期待，太热烈的情绪是关系中令你不舒服的来源。`,
    advice: `和小乌龟相处，需要"慢"和"稳"，不要急着推进关系的变化，不要情绪化，只要让ta感到安全，ta会一步一步把壳打开，把心交给你。`
  },
  雪貂: {
    name: '雪貂',
    emoji: '🦡',
    description: '你的动物型人格是雪貂，你既有雪貂的温柔贴心，又有雪貂的那份敏感。',
    loveStyle: `Lee's Love Style（友谊 Storge）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是友谊型，你重视陪伴、理解与长久的默契，你喜欢在时间的积累中慢慢了解对方、慢慢让关系变得稳固。`,
    attachment: `Adult Attachment Theory（恐惧 Fearful）

根据成人依恋理论（Adult Attachment Theory），你是恐惧型。你渴望亲密，也渴望有人走进你的世界，可一旦靠的太近，你又会因为害怕受伤而紧张。`,
    loveLanguage: `你偏好温柔的相处方式，比如静静地与对方一起做事、一起散步、一起消磨时间——只要和对方实实在在的在一起，就是你最大的安全来源。`,
    expression: `你的爱柔软细腻，你会默默观察、默默把对方放在心里。但当你和伴侣之间的情绪变得太强烈时，你又需要会撤回到自己最安全与舒适的区域内，需要一点时间才能处理与恢复。`,
    needs: `你害怕自己"得到的爱存在不真实"，也害怕靠得太近会让你变得脆弱，你需要一个能慢慢接住你的人，而不是急着拆开你的心。`,
    advice: `与小雪貂相处，要温柔、要耐心、要不逼迫。告诉ta："你可以慢慢来。"当雪貂真正感到安全时，会展现最柔软、最真挚、最细腻的爱。`
  },
  猫头鹰: {
    name: '猫头鹰',
    emoji: '🦉',
    description: '你的动物型人格是猫头鹰，你既有猫头鹰的冷静理智，又有猫头鹰那份独立沉稳。',
    loveStyle: `Lee's Love Style（实用 Pragma）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是实用型，你注重现实、逻辑、长远规划以及情感的"可持续性"，你不喜欢盲目的冲动，而面对值得投入的关系，你慎重且珍惜。`,
    attachment: `Adult Attachment Theory（回避 Avoidant）

根据成人依恋理论（Adult Attachment Theory），你是回避型，你重视自己的节奏，也需要个人空间，太强烈的靠近，或太浓烈的情绪，会让你感到压迫与不适。`,
    loveLanguage: `你更习惯通过行动来表达在乎，例如帮对方解决问题、替对方规划未来，而不是浓烈的情绪表达。`,
    expression: `你的爱理性、稳定、踏实，你不太倾向于强烈的情绪对话，也不会轻易失控，对你而言，最好的爱是"默默做"，而不是"浪漫说"。`,
    needs: `在亲密关系中你害怕不稳定的情绪、混乱、与压力，也害怕必须立刻回应对方所有的感受，在面对重大的抉择，你总是需要一定的时间慢慢的思考来建立逻辑。`,
    advice: `与小猫头鹰相处，要温和、不能施压。让ta用自己的方式靠近你，你会发现猫头鹰的爱安静、理性，却极其深刻和持久。`
  },
  鹿: {
    name: '鹿',
    emoji: '🦌',
    description: '你的动物型人格是小鹿，你既有鹿的细腻敏感，又有鹿那份谨慎的温柔。',
    loveStyle: `Lee's Love Style（实用 Pragma）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是实用型，你喜欢稳定、踏实、慢慢发展的关系，面对感情的到来不会轻易选择全部投入，而是仔细观察、判断后做出正确的选择。`,
    attachment: `Adult Attachment Theory（恐惧 Fearful）

根据成人依恋理论（Adult Attachment Theory），你是恐惧型，你渴望稳定，也渴望爱，但你害怕受伤、害怕失败、害怕有自己无法承担的后果，因此常常为自己的选择做多手准备。`,
    loveLanguage: `对你而言，爱是不带压力的陪伴、循序渐进的相处方式，以及温柔而不强迫的互动节奏。`,
    expression: `对你而言，爱的过程是是"靠近一步、确认安全、再靠近一步"。你不会贸然表达，但会在细节中体现关心。`,
    needs: `在亲密的相处过程中，你害怕双方情绪过载、害怕被误解、害怕被逼近太紧。你需要的是可预测、稳定、温柔的关系。`,
    advice: `和小鹿相处，请不要催促ta做出选择、做出给予。让ta慢慢来，尊重ta的节奏，让ta自己靠近你。只要你能提供稳定与温柔，小鹿会把最真实、最细腻的爱给你。`
  },
  马: {
    name: '马',
    emoji: '🐎',
    description: '你的动物型人格是马，你既有马的雷厉风行，又有马的那份细腻敏感。',
    loveStyle: `Lee's Love Style（痴狂 Mania）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是痴狂型。面对情感你容易迅速的产生情绪波动与心动，在面对真正喜欢的人，你的情绪也会变得更深刻、更真诚、更强烈。`,
    attachment: `Adult Attachment Theory（回避 Avoidant）

根据成人依恋理论（Adult Attachment Theory），你是回避型。你越在乎，就越害怕失控，越心动，就越不敢靠得太近，这让你的情感往往呈现"靠近一下、退开两步"的节奏。`,
    loveLanguage: `你喜欢温柔坚定、不过分热烈的互动，对你来说，安静陪伴、小心靠近、轻柔表达，比起外放式的亲昵更能让你感到舒服。`,
    expression: `你的爱是冲动与退缩并存的：你会悄悄观察、默默在意，却不敢太快靠近，这样的你不是缺爱或者不会表达，只是害怕自己的脆弱被发现。`,
    needs: `你害怕被束缚，也害怕失去自由，但更害怕当你终于靠近时，被拒绝、被看轻或被误解。`,
    advice: `和小马相处，请给ta足够的空间、温柔与自由。不要催促，不要急于推进，让ta用自己的步伐靠近你，只要给ta足够的时间与空间，ta会一次比一次更靠近你。`
  },
  山猫: {
    name: '山猫',
    emoji: '🐆',
    description: '你的动物型人格是山猫，你既有山猫的情绪深度，又有山猫那份易受伤的敏锐。',
    loveStyle: `Lee's Love Style（痴狂 Mania）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是痴狂型。你爱得强烈、深刻，容易在感情中有大幅的情绪波动。`,
    attachment: `Adult Attachment Theory（恐惧 Fearful）

根据成人依恋理论（Adult Attachment Theory），你是恐惧型。你渴望靠近，却又害怕暴露自己的脆弱；你想表达，却担心过度的投入与付出会令感情失去平衡，在感情中的你容易有各种各样的忧虑，从而有时会选择掩盖自己的热情。`,
    loveLanguage: `你需要在被理解的前提下靠近，你偏好耐心的陪伴、温柔的倾听，以及慢慢累积信任的互动方式。`,
    expression: `你的爱充满矛盾，你时而热烈、时而退缩。你会在情绪强烈时深深靠近对方，但当害怕袭来时又迅速拉开距离。`,
    needs: `你害怕被伤害、害怕被否定、害怕自己不够好，也害怕"太认真会被辜负"。`,
    advice: `与小山猫相处，请用耐心接住ta的情绪，不要一味的用理性去指责ta的敏感，而是用心来接纳ta、理解ta。只要你够温柔、够稳，ta会一步步向你敞开心扉。`
  },
  水獭: {
    name: '水獭',
    emoji: '🦦',
    description: '你的动物型人格是水獭，你既有水獭的调皮灵动，又有水獭天然的温柔治愈。',
    loveStyle: `Lee's Love Style（游戏 Ludus）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是游戏型。你喜欢轻松愉快的互动，享受情绪的流动感与两人的默契，不希望爱变成一种压力，承载太多变得沉重。`,
    attachment: `Adult Attachment Theory（安全 Secure）

根据成人依恋理论（Adult Attachment Theory），你是安全型，你既不会太粘人又不会太拒绝别人的热情，不焦虑不逃避，是天生的"松弛感爱人"，情绪稳定，也愿意沟通。`,
    loveLanguage: `你喜欢和在乎的人一起轻松地聊聊天、一起做些有趣的小事，一同体验生活的节奏。对你而言对方肯定的语言，和想着你时精心准备的时刻事最重要的爱的表达。`,
    expression: `你的爱不张扬，却很迷人，你用幽默、陪伴与轻盈的能量让关系变得舒适自然，在你的世界里，爱是如游戏般可以迷人又有趣的。`,
    needs: `你最怕的是关系变得"沉重"和"无趣"，你需要轻松、自由、真诚的互动，害怕感情承载过多而变的千篇一律又压抑枯燥。`,
    advice: `与小水獭相处时，请务必和ta进行情绪上的对抗，陪ta一起笑、一同体验生活中细小而有有趣的小瞬间，你会发现ta的爱持续、温柔而治愈。`
  },
  狐狸: {
    name: '狐狸',
    emoji: '🦊',
    description: '你的动物型人格是狐狸，你既有狐狸的聪明与幽默，又有狐狸独特的可爱灵动。',
    loveStyle: `Lee's Love Style（游戏 Ludus）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是游戏型，你喜欢轻松的互动、好玩的氛围，享受探索的过程，不喜欢强行根据定义或按传统节奏推进。`,
    attachment: `Adult Attachment Theory（回避 Avoidant）

根据成人依恋理论（Adult Attachment Theory），你是回避型，你珍惜自由，需要时间和个人空间，太浓烈或太直接的情绪会让你往后退。`,
    loveLanguage: `你偏好以轻松、有趣、有智慧的对话来表达好感，你渴望在交流的过程中产生双方间的默契与认可，而不是浓烈的肢体接触。`,
    expression: `你的爱很特别，你会用玩笑的方式、机灵的回应、偶尔的撩拨来示好，但很少给出沉重的承诺。你不缺爱，但是害怕被情绪牵绊。`,
    needs: `你最怕被控制、被约束、被期待太多，你需要一个能让你"想靠近，而不是被推着靠近"的人。`,
    advice: `抓不住小狐狸，就不要一味努力追着ta的步伐跑。保持幽默、保持轻松、保持界线，反而会让ta自己走回来，当ta愿意欣赏你、与你同频脚步，那就是真心了。`
  },
  浣熊: {
    name: '浣熊',
    emoji: '🦝',
    description: '你的动物型人格是浣熊，你既有浣熊的灵动可爱，又有浣熊那份小心翼翼的敏感。',
    loveStyle: `Lee's Love Style（游戏 Ludus）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是游戏型。你喜欢轻松、自然、带着一点趣味的相处方式，不爱沉重的氛围，希望关系里有笑声、有互动、有生活的小惊喜。`,
    attachment: `Adult Attachment Theory（焦虑 Anxious）

根据成人依恋理论（Adult Attachment Theory），你是焦虑型。你在意关系中的温度，很敏感对方的态度变化，当你感受到冷淡或不确定时，会立刻陷入不知所措当中。`,
    loveLanguage: `你喜欢被肯定、被回应、被关注的感觉。轻松的聊天、及时的互动、甜甜的小举动，都会让你觉得"我们是紧密连接的"。`,
    expression: `你的爱灵活又热情，你会主动靠近、示好、制造小惊喜，但如果得不到回应，又会担心是不是自己做不好、是不是对方不在意你。`,
    needs: `在感情中，你最怕的不是冲突，而是"没有回应"。当你感受到莫名其妙的距离与捉摸不透，你的情绪会立刻产生波动。`,
    advice: `与小浣熊相处，请多回应、多交流、多一点稳定。告诉ta"我在这里"，照顾ta的小情绪，接住ta的小敏感。只要浣熊获得足够的安全感，ta会给你最可爱、最活泼也最甜蜜的爱。`
  },
  章鱼: {
    name: '章鱼',
    emoji: '🐙',
    description: '你的动物型人格是章鱼，你既有章鱼的聪明机灵，又有章鱼的柔软脆弱。',
    loveStyle: `Lee's Love Style（游戏 Ludus）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是游戏型。你喜欢轻松自在的互动，享受两人之间的默契、幽默与自然感，不喜欢关系太沉重、太程式化。`,
    attachment: `Adult Attachment Theory（恐惧 Fearful）

根据成人依恋理论（Adult Attachment Theory），你是恐惧型。你渴望靠近，却又会害怕被脆弱被看穿，你愿意表达，却又害怕对方无法承担自己的情绪。`,
    loveLanguage: `对你来说，温柔但不压迫、轻盈而稳定的陪伴，是最舒服的表达方式。你喜欢逐步靠近、逐步试探后确认安全，而不是被情绪推着走。`,
    expression: `你的爱细腻、安静、有分寸。你会用轻松的方式来靠近，比如玩笑、暗示、温柔的小举动，却常常因为种种顾虑在真正心动时又退回到安全范围。`,
    needs: `你害怕自己会受伤、害怕被误解、害怕关系中的情绪太强烈，你需要"柔软的理解"而不是"强求的靠近"。`,
    advice: `与小章鱼相处，请给ta足够的安全、给ta自由的空间、给ta全部的温柔。不要着急强行靠近ta的心，而是允许ta在自己的节奏里慢慢靠近。只要你获取了ta的信任，ta会伸出柔软的"触角"，把最最深刻的爱交给你。`
  },
  企鹅: {
    name: '企鹅',
    emoji: '🐧',
    description: '你的动物型人格是企鹅，你既有企鹅的可爱黏人，又有企鹅那份真诚执着的深情。',
    loveStyle: `Lee's Love Style（友谊 Storge）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是友谊型，你重视长期的稳定关系，喜欢与伴侣形成像家人般的默契，一点一点累积亲密。`,
    attachment: `Adult Attachment Theory（焦虑 Anxious）

根据成人依恋理论（Adult Attachment Theory），你是焦虑型。你对关系敏感、上心，也很在意自己在对方心里的位置，你需要确认、需要回应，也需要知道"你不是一个人"。`,
    loveLanguage: `你在意日常的陪伴，也在意对方的回应，对你来说，一句"我在这里"、"我想你啦"，或一个贴心的小举动，都是令人感到安定、表达爱意的语言。`,
    expression: `你的爱温柔绵长，你会关心、会倾听、会努力靠近对方，也会时不时通过陪伴、粘人等方式表达在乎。也许感情中的你会有一定的控制欲，但这只是因为害怕失去，正因如此才会如此珍惜关系。`,
    needs: `你最怕被冷落，被敷衍，或被"忽如其来的态度"绊住情绪，你的不安并不是不信任，而是在乎欲用心的表现。`,
    advice: `与小企鹅相处，最重要的是"稳定"。请抱抱ta、回应ta、让ta感受到被包括进了你的世界，只要让企鹅感到踏实安心，ta会给你全心、全意、最忠诚的爱。`
  },
  仓鼠: {
    name: '仓鼠',
    emoji: '🐹',
    description: '你的动物型人格是仓鼠，你既有仓鼠的温柔贴心，又有仓鼠的敏感努力。',
    loveStyle: `Lee's Love Style（利他 Agape）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是利他型。你会默默付出、主动照顾别人，让对方舒适安心是你表达爱的方式。`,
    attachment: `Adult Attachment Theory（焦虑 Anxious）

根据成人依恋理论（Adult Attachment Theory），你是焦虑型。你会担心自己做得不够好、担心自己在关系里付出的不够多、担心自己不被珍惜，而这些想法恰恰都是你太在乎的表现。`,
    loveLanguage: `你的爱表现为"服务行动"：帮对方处理事情、替对方做准备、确保对方过得好。而在这其中，你也需要被肯定、被感谢，来让你感到自己的情绪被接住。`,
    expression: `你的爱温柔又努力，你很在乎细节，在乎对方需要什么，也能在关系里为对方承担很多，可是有的时候，你也需要允许自己松一口气休息一下，不然也会在付出太多时感到累。`,
    needs: `你最怕你的付出被忽视、被认为理所当然，或者没有得到回应。你需要的只是一个"看到你努力"的人。`,
    advice: `与小仓鼠相处，请给予ta最大程度的温柔，回应ta的付出，对ta说："你已经做得很好啦。"当ta被理解、被看见时，ta会把最真诚、最有耐心的爱都给你。`
  },
  天鹅: {
    name: '天鹅',
    emoji: '🦢',
    description: '你的动物型人格是天鹅，你既有天鹅的深情执着，又有天鹅那份坚贞不渝的忠诚。',
    loveStyle: `Lee's Love Style（痴狂 Mania）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是痴狂型，你的爱通常深情、投入多、情绪浓度高，只要认定一个人，你就会义无反顾。`,
    attachment: `Adult Attachment Theory（焦虑 Anxious）

根据成人依恋理论（Adult Attachment Theory），你是焦虑型，你很在乎关系的温度，对外界的变化与在乎之人的表达非常敏感，你时常担心自己是否足够好、是否被放在心上。`,
    loveLanguage: `你喜欢亲密的互动、重复的确认，这些使你感受到自己被放在"心之所向"的位置。你需要知道自己对对方来说是独一无二的。`,
    expression: `你的爱纯粹而直接，你渴望强烈的情感连结，也愿意在关系中付出很多，只要能换来对方同等的爱意与稳定陪伴。`,
    needs: `在关系中你最怕的是冷淡与忽视，对你来说，逃避沟通与没有回应比争吵更令人受伤。`,
    advice: `与小天鹅相处，请多给ta一点回应、多一点肯定、多一点耐心。天鹅会因为你时时刻刻表现出来的在乎而变得安心，并把无比忠诚的深情全部留给你。`
  },
  雪兔: {
    name: '雪兔',
    emoji: '🐇',
    description: '你的动物型人格是雪兔，你既有雪兔的温柔善良，又有雪兔容易受伤的敏锐。',
    loveStyle: `Lee's Love Style（利他 Agape）

根据心理学中的爱情模型Lee的爱情风格（Lee's Love Style），你是利他型。你习惯照顾别人、为别人付出，把自己细腻的温柔融进日常小细节，而不是轰轰烈烈的表达。`,
    attachment: `Adult Attachment Theory（恐惧 Fearful）

根据成人依恋理论（Adult Attachment Theory），你是恐惧型，对于在乎的人你会想要靠近，却害怕冲突、害怕暴露脆弱、害怕让对方为难，因此你常常选择温柔地退后一步。`,
    loveLanguage: `生活中的你习惯透过细微体贴来表达爱，例如为对方准备生活中的小事、默默支持，为对方留意到很多不说出口的需求。`,
    expression: `你的爱轻柔而温暖，你会静静靠近，却不敢过度打扰，你会关心，却不过多强求回报。`,
    needs: `在感情中你最怕情绪化、争吵和压迫感，也害怕自己做得不好给他人造成负担，你需要的是柔软的理解和舒服自在的关系。`,
    advice: `与小雪兔相处，请保持温柔、稳定，不要逼ta做决定，也不要急着推进关系，只要你给ta足够的安全与空间，ta会在自己的节奏里，悄悄把最干净、柔软的爱展示给你。`
  }
}

/**
 * 获取动物报告
 */
export function getAnimalReport(animal: AnimalType): AnimalReport {
  return ANIMAL_REPORTS[animal] || ANIMAL_REPORTS['海豚']
}

