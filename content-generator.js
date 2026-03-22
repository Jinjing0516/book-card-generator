// 内容生成模块 - AI生成小红书风格的书卡内容

class ContentGenerator {
  // 嗅觉标签候选词库
  smellOptions = [
    {emoji: '🍵', name: '抹茶青草香'},
    {emoji: '🪵', name: '白檀香调'},
    {emoji: '🌱', name: '雨后青草香'},
    {emoji: '🧂', name: '海盐雾香'},
    {emoji: '🍷', name: '红酒橡木香调'},
    {emoji: '☕', name: '焦糖咖啡香'},
    {emoji: '🌹', name: '玫瑰檀香调'},
    {emoji: '🪵', name: '松木皮革香'},
    {emoji: '🥥', name: '椰奶奶香调'},
    {emoji: '🍊', name: ' citrus橙香调'},
    {emoji: '🌊', name: '海洋清风香'},
    {emoji: '📜', name: '旧纸张香'},
    {emoji: '🍫', name: '黑巧克力香'},
    {emoji: '🌿', name: '艾草草木香'},
    {emoji: '🍯', name: '蜂蜜琥珀香'},
  ];

  // DNA标签模板，按书籍类型分组
  dnaTemplates = {
    selfHelp: [
      {emoji: '📜', name: '自我成长指南'},
      {emoji: '✂️', name: '焦虑溶解剂'},
      {emoji: '🎭', name: '认知破局手册'},
      {emoji: '🧶', name: '生活美学手册'},
      {emoji: '🧠', name: '思维健身房'},
      {emoji: '🛡️', name: '心理防弹衣'},
      {emoji: '🔥', name: '改变催化剂'},
      {emoji: '💎', name: '价值观打磨石'},
    ],
    fiction: [
      {emoji: '📖', name: '年度封神之作'},
      {emoji: '😭', name: '哭湿口罩神作'},
      {emoji: '🔮', name: '人性放大镜'},
      {emoji: '🌃', name: '深夜床头书'},
      {emoji: '🪞', name: '灵魂照妖镜'},
      {emoji: '🎪', name: '人间游乐场'},
    ],
    biography: [
      {emoji: '👑', name: '传奇人生传记'},
      {emoji: '💪', name: '逆境翻盘指南'},
      {emoji: '🕰️', name: '时代记录者'},
      {emoji: '✨', name: '榜样力量手册'},
    ],
    business: [
      {emoji: '💼', name: '职场晋升指南'},
      {emoji: '💰', name: '财富思维升级'},
      {emoji: '📈', name: '商业认知迭代'},
      {emoji: '🚀', name: '创业实战笔记'},
    ]
  };

  // 适配人群标签模板
  crowdTemplates = [
    {emoji: '💼', name: '职场焦虑困扰者'},
    {emoji: '📚', name: '重度读书上瘾者'},
    {emoji: '🧘', name: '自我成长追求者'},
    {emoji: '🎯', name: '目标感缺失者'},
    {emoji: '❤️', name: '亲密关系困惑者'},
    {emoji: '👵', name: '年龄焦虑困扰者'},
    {emoji: '👔', name: '中年转型探索者'},
    {emoji: '🌱', name: '退休生活重构者'},
    {emoji: '🌟', name: '自我价值觉醒者'},
    {emoji: '🛡️', name: '高敏感人群'},
    {emoji: '👨‍👩‍👧', name: '亲情关系困扰者'},
    {emoji: '💡', name: '认知升级爱好者'},
  ];

  // 生成完整内容
  generate(title, subtitle, author, description) {
    // 随机选择3个嗅觉标签
    const smellTags = this.pickRandomItems(this.smellOptions, 3);
    
    // 生成3个核心价值点
    const corePoints = this.generateCorePoints(title, subtitle, description);
    
    // 生成一句话书评
    const oneSentence = this.generateOneSentenceReview(title, subtitle);
    
    // 选择4个适配人群
    const crowds = this.pickRandomItems(this.crowdTemplates, 4);
    
    // 生成3个能量条
    const energyBars = this.generateEnergyBars(title, description);
    
    // 选择4个DNA标签
    const dnaTags = this.pickDnaTags(description);
    
    // 生成3个金句段落
    const quotes = this.generateQuotes(title, subtitle, description);
    
    // 生成推荐理由
    const recommendReason = this.generateRecommendReason(title, subtitle, description);
    
    return {
      title,
      subtitle,
      author,
      smellTags,
      corePoints,
      oneSentence,
      crowds,
      energyBars,
      dnaTags,
      quotes,
      recommendReason,
    };
  }

  pickRandomItems(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  pickDnaTags(description) {
    // 根据描述判断书籍类型
    let pool = this.dnaTemplates.selfHelp;
    const descLower = (description || '').toLowerCase();
    
    if (descLower.includes('小说') || descLower.includes('故事') || descLower.includes('fiction')) {
      pool = this.dnaTemplates.fiction;
    } else if (descLower.includes('传记') || descLower.includes('自传') || descLower.includes('生平')) {
      pool = this.dnaTemplates.biography;
    } else if (descLower.includes('商业') || descLower.includes('管理') || descLower.includes('职场') || descLower.includes('经济')) {
      pool = this.dnaTemplates.business;
    }
    
    return this.pickRandomItems(pool, 4);
  }

  generateCorePoints(title, subtitle, description) {
    // 基于书名副标题生成三个核心价值点，使用固定句式：XX代替XX｜XXXXXXX
    const patterns = [
      ['接纳', '对抗', '让年龄成为新起点'],
      ['探索', '停滞', '用好奇心喂养灵魂'],
      ['美学', '将就', '打造熟龄专属仪式感'],
      ['感受', '思考', '用身体读懂生活答案'],
      ['慢下来', '狂奔', '找到属于你的节奏'],
      ['真诚', '套路', '建立走心的人际关系'],
      ['倾听', '争辩', '化解矛盾于无形'],
      ['行动', '空想', '用脚步丈量世界'],
      ['创作', '等待', '让灵感自然生长'],
      ['允许', '强迫', '接受不完美的自己'],
    ];
    
    // 随机选三个不重复的模式
    const selected = this.pickRandomItems(patterns, 3);
    return selected.map(([a, b, c]) => ({
      pattern: `${a}代替${b}`,
      description: c
    }));
  }

  generateOneSentenceReview(title, subtitle) {
    const templates = [
      '"一本打破认知偏见的轻盈生活提案，用小事重启人生可能性"',
      '"读完想立刻整理书架，给自己的灵魂腾出新空间"',
      `"一本适合放在床头，睡前翻三页就会被温柔治愈的好书"`,
      `"把${subtitle}讲得通透又好玩，看完忍不住分享给三个好朋友"`,
      '"原来这个问题还能这么想，三观被轻轻揉开又重新拼好"',
      '"文字有温度，道理不刺骨，像冬天的一杯热奶茶"',
    ];
    return this.pickRandomItems(templates, 1)[0];
  }

  generateEnergyBars(title, description) {
    // 生成三个能量条，名称+百分比
    const defaultBars = [
      {name: '认知拓展', percent: this.randomPercent(75, 95)},
      {name: '情绪治愈', percent: this.randomPercent(80, 98)},
      {name: '实用干货', percent: this.randomPercent(70, 90)},
    ];
    
    // 根据描述微调
    if ((description || '').toLowerCase().includes('实用') || (description || '').includes('方法')) {
      defaultBars[2].percent = Math.min(95, defaultBars[2].percent + 10);
    }
    
    return defaultBars;
  }

  randomPercent(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateQuotes(title, subtitle, description) {
    // 生成三段风格类似原文的金句 + 生活化感悟
    // 基于书籍主题生成，模仿您给的示例风格
    const themes = this.getThemesFromDescription(description);
    
    const quotes = [];
    const nicknames = ['@爱书人阿美', '@图书馆馆长老周', '@奶茶配书小分队', 
                       '@睡前阅读打卡', '@书店打工日记', '@豆瓣五星打卡'];
    const selectedNicks = this.pickRandomItems(nicknames, 3);
    
    // 第一段：自然/生活感悟
    quotes.push({
      text: this.generateQuoteText(themes[0], title),
      author: selectedNicks[0],
      insight: this.generateInsight(themes[0])
    });
    
    // 第二段：行动/态度
    quotes.push({
      text: this.generateQuoteText(themes[1], title),
      author: selectedNicks[1],
      insight: this.generateInsight(themes[1])
    });
    
    // 第三段：哲学/认知
    quotes.push({
      text: this.generateQuoteText(themes[2], title),
      author: selectedNicks[2],
      insight: this.generateInsight(themes[2])
    });
    
    return quotes;
  }

  getThemesFromDescription(description) {
    const defaultThemes = ['成长', '生活', '认知'];
    const desc = (description || '').toLowerCase();
    
    const themes = [];
    if (desc.includes('年龄') || desc.includes('变老') || desc.includes('中年')) {
      themes.push('age', 'life', 'freedom');
    } else if (desc.includes('自我') || desc.includes('成长')) {
      themes.push('growth', 'self', 'courage');
    } else if (desc.includes('沟通') || desc.includes('关系')) {
      themes.push('communication', 'relationship', 'empathy');
    } else if (desc.includes('职场') || desc.includes('工作')) {
      themes.push('work', 'productivity', 'career');
    } else {
      themes.push('life', 'insight', 'beauty');
    }
    
    return themes;
  }

  generateQuoteText(theme, title) {
    const templates = {
      age: `"当你不再和发际线较劲，反而能看见鬓角白霜里藏着的月光。每一道皱纹都是河流走过的痕迹，告诉你哪里曾经有过春天。"`,
      life: `"在阳台种几盆不结果的香草，只是为了闻每天早晨青草的香气。人生不是只有结果才值得庆祝，开花的过程已经足够美好。"`,
      freedom: `"穿二十岁时不敢穿的花裙子，去年轻时不敢去的山顶看日出。原来枷锁不在身外，在你心里那件洗得发白的规矩里。"`,
      growth: `"把每天当作第一次学走路，允许自己摔倒，允许自己走歪，允许自己停下来闻闻花香。成长不是赛跑，是散步。"`,
      self: `"你不需要活成别人期待的样子，就像玫瑰不必长成松柏，你有自己的花期和芬芳。"`,
      courage: `"真正的勇敢不是不怕，而是怕了还能迈开步，错了还能重新来。"`,
      communication: `"好好说话不是技巧，是愿意把对方放在心上，愿意慢一点等对方说完。"`,
      relationship: `"好的关系不是不吵架，是吵完架还能一起出来吃夜宵。"`,
      empathy: `"先听见，再回应。很多时候人们要的不是答案，是被看见。"`,
      work: `"工作是为了更好的生活，不是生活来成全工作。别搞错了顺序。"`,
      productivity: `"慢慢来比较快，把重要的事情做好，比做完很多事情更重要。"`,
      career: `"职场没有标准答案，适合你的节奏，就是最好的答案。"`,
      insight: `"那些被当作"浪费时间"的闲事，往往偷偷养着你的灵魂。"`,
      beauty: `"美不在远方，就在你每天走过的路上，窗台上的花，杯子上的光。"`,
    };
    
    const defaultTemplates = [
      `"读过很多道理，依然过不好这一章？这本书帮你把道理拆解成每天都能走的小步子。"`,
      `"真正的成熟，是学会和不完美的世界温柔相处。"`,
      `"人生不是闯关游戏，不必每一关都得拿满分。"`,
    ];
    
    if (templates[theme]) {
      return templates[theme];
    }
    return this.pickRandomItems(defaultTemplates, 1)[0];
  }

  generateInsight(theme) {
    const insights = {
      age: '原来我膝盖上的疤痕也是岁月给的勋章呀！现在穿短裙更自信了～',
      life: '上周特意买了一盆薄荷放在书桌，每天醒来闻一下，感觉一整天都醒了！',
      freedom: '五一已经买好了去青海的票，年轻时不敢请假，现在直接说走就走！',
      growth: '接受自己现在走得慢，反而比之前走得更远了。慢慢来真的比较快～',
      self: '看完把购物车里面的修身衣服都删了，现在就喜欢宽松舒服的！',
      courage: '想辞职想了三年，这周终于交信了，大不了从头再来呗！',
      communication: '昨天和老公吵架试了试，先听完再说，居然没吵起来！神奇。',
      relationship: '真的是这样！以前总想着赢，赢了道理输了感情，现在懂了。',
      empathy: '做HR五年了，现在面试都会多等三十秒让候选人说完，感觉招到了更好的人。',
      work: '上个月开始准点下班，效率反而更高了。老板也没说啥，是我自己之前卷太久了。',
      productivity: '以前总追求今日事今日毕，现在学会放过自己，今天没做完明天再做，天不会塌。',
      insight: '我现在每天留半小时瞎坐着，很多好点子都是这时候冒出来的，以前觉得是浪费，现在当宝贝。',
      beauty: '开始拍天空的云彩了，原来下班路上这么美，以前只顾着赶地铁。',
    };
    
    if (insights[theme]) {
      return insights[theme];
    }
    return '看完这本书第二天就去实践了，真的有用！推荐大家也试试～';
  }

  generateRecommendReason(title, subtitle, description) {
    // 生成小红书风格推荐理由
    const templates = [
      `一本让人看完想立刻改变生活状态的好书！把《${subtitle}》讲得通透又好玩，没有大道理，都是能直接上手的生活小智慧。身边朋友看完都纷纷安利，这波真的不亏～`,
      `这是那种会让你翻完扉页就想拍屏分享给好朋友的书。作者太懂现代人的焦虑了，几句话就能点透，文字温柔但有力量，放在床头每天翻两页，心态真的会变好。`,
      `终于有人把《${subtitle}》讲得这么明白了！不鸡汤不鸡血，就是实打实的生活感悟，像一个过来人坐在对面和你聊天，看完心里敞亮多了。`,
    ];
    return this.pickRandomItems(templates, 1)[0];
  }
}

window.ContentGenerator = ContentGenerator;
