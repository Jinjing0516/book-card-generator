// HTML模板模块 - 生成信息卡和金句卡的HTML

class CardTemplates {
  // 生成信息卡HTML
  generateInfoCard(content, colors, coverUrl) {
    const {title, subtitle, author, smellTags, corePoints, oneSentence, crowds, energyBars, dnaTags} = content;
    const css = this.getFullCss(colors);
    
    return `
<!DOCTYPE html>
<html>
<head>
${css}
</head>
<body>
<div class="card">
<!-- 封面模块 -->
<div class="cover-card">
<img src="${coverUrl}" class="cover-img" crossorigin="anonymous">
<div class="title-group">
  <div class="book-title">${title}</div>
  <div class="author-sub">作者：${author}</div>
  <div class="subtitle-text">${subtitle}</div>

  <!-- 嗅觉标签 -->
  <div class="smell-title">嗅觉标签</div>
  <div class="tag-group">
    ${smellTags.map(t => `<div class="tag">${t.emoji}${t.name}</div>`).join('')}
  </div>
</div>
</div>

<!-- 数据模块 -->
<div class="data-card">
  <h2>📌 核心价值点</h2>
  <div class="grid-3">
    ${corePoints.map(p => `
    <div class="value-point">
      <div class="highlight">${p.pattern}</div>
      <div class="sub-text">${p.description}</div>
    </div>
    `).join('')}
  </div>
</div>

<!-- 合并后的信息卡 -->
<div class="data-card">
  <h2>💡 一句话书评</h2>
  <div class="sub-text" style="margin:12px 0">${oneSentence}</div>
  <div class="dashed-line"></div>
  <h2>🎯 适配人群</h2>
  <div class="sub-text" style="margin:12px 0">
    ${crowds.map(c => `${c.emoji} ${c.name}`).join(' | ')}
  </div>
  <div class="dashed-line"></div>
  <h2>📚 内容解析能量条</h2>
  ${energyBars.map(bar => `
  <div class="progress-container">
    <div class="sub-text">${this.getEmojiForBar()} ${bar.name}</div>
    <div class="progress-bar">
      <div class="progress-fill" style="width:${bar.percent}%"></div>
    </div>
    <div class="progress-info">
      <span class="progress-desc">${this.getDescForBar(bar.name)}</span>
      <span class="progress-percent">${bar.percent}%</span>
    </div>
  </div>
  `).join('')}
  <div class="dashed-line"></div>
  <!-- 书籍DNA -->
  <h2>🔖 书籍DNA</h2>
  <div class="tag-group">
    ${dnaTags.map(t => `<div class="tag">${t.emoji}${t.name}</div>`).join('')}
  </div>
</div>

</div>
</body>
</html>
    `.trim();
  }

  // 生成金句卡HTML
  generateQuoteCard(content, colors, coverUrl) {
    const {title, subtitle, author, quotes, recommendReason} = content;
    const {main1, main2, bg1, bg2, text} = colors;
    const css = this.getFullCssQuote(colors);
    
    return `
<!DOCTYPE html>
<html>
<head>
${css}
</head>
<body>
<div class="card">
<!-- 封面模块 -->
<div class="cover-card">
<img src="${coverUrl}" class="cover-img" crossorigin="anonymous">
<div class="title-group">
  <div class="book-title">${title}</div>
  <div class="sub-text-author">作者：${author}</div>
  <span class="recommend-title">✨<span> 推荐理由</span></span>
  <div class="sub-text">${recommendReason}</div>
</div>
</div>

${quotes.map(q => `
<div class="data-card">
  <h2>📖 原文摘录</h2>
  <div class="sub-text">${q.text}</div>
  <div class="dashed-line"></div>
  <h2>💡 ${q.author}</h2>
  <div class="sub-text">${q.insight}</div>
</div>
`).join('')}

</div>
</body>
</html>
    `.trim();
  }

  // 获取金句卡完整CSS
  getFullCssQuote(colors) {
    const {main1, main2, bg1, bg2, text} = colors;
    return `
<style>
* { margin:0; padding:0; box-sizing:border-box }
body { background:${bg1}; display:flex; justify-content:center; padding:0 }
.card {
  width:750px;
  min-height:1000px;
  background: linear-gradient(135deg, ${bg1} 0%, ${bg2} 100%);
  border-radius: 24px;
  padding: 32px;
  position: relative;
  box-shadow: 0 12px 24px ${this.hexToRgba(main1, 0.1)};
  font-family: 'PingFang SC', 'Noto Sans SC', system-ui, -apple-system, sans-serif;
  color: ${text};
}
/* 封面模块 */
.cover-card {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}
.cover-img {
  width: 180px;
  height: 240px;
  border-radius: 12px;
  box-shadow: 4px 6px 12px ${this.hexToRgba(text, 0.1)};
  object-fit: cover;
}
.title-group {
  flex:1;
}
.book-title {
  font-size:44px;
  line-height: 1.1;
  margin-bottom:8px;
  background: linear-gradient(45deg, ${main1}, ${main2});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}
/* 推荐理由 */
.recommend-title {
  font-weight: 700;
  display: block;
  margin: 20px 0 12px;
  font-size: 20px;
}
.recommend-title span {
  color: ${main1};
}
/* 数据模块 */
.data-card {
  background: rgba(255,255,255,0.9);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
}
.dashed-line {
  border: 1px dashed ${main2};
  margin: 16px 0;
  opacity:0.6;
}
.sub-text {
  opacity:0.8;
  font-size:16px;
  line-height: 1.7;
  margin-bottom: 8px;
}
h2 {
  color: ${main1};
  margin-bottom:12px;
  font-size:20px;
  padding-bottom: 8px;
  font-weight: 600;
}
.sub-text-author {
  color: ${text};
  opacity: 0.9;
  font-size: 18px;
  margin-bottom: 8px;
}
</style>
    `;
  }
}

  // 获取完整的CSS样式，用于预览
  getFullCss(colors) {
    const {main1, main2, bg1, bg2, text} = colors;
    return `
<style>
* { margin:0; padding:0; box-sizing:border-box }
body { background:${bg1}; display:flex; justify-content:center; padding:0 }
.card {
  width:750px;
  height:1000px;
  background: linear-gradient(135deg, ${bg1} 0%, ${bg2} 100%);
  border-radius: 24px;
  padding: 32px;
  position: relative;
  box-shadow: 0 12px 24px ${this.hexToRgba(main1, 0.1)};
  font-family: 'PingFang SC', 'Noto Sans SC', system-ui, -apple-system, sans-serif;
}
/* 封面模块 */
.cover-card {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}
.cover-img {
  width: 180px;
  height: 240px;
  border-radius: 12px;
  box-shadow: 4px 6px 12px ${this.hexToRgba(text, 0.1)};
  object-fit: cover;
}
.title-group {
  color: ${text};
  flex:1;
}
.book-title {
  font-size:44px;
  line-height: 1.1;
  margin-bottom:8px;
  background: linear-gradient(45deg, ${main1}, ${main2});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}
/* 嗅觉标签 */
.smell-title {
  color: ${main1};
  font-size: 16px;
  margin: 12px 0 8px;
  font-weight: 500;
}
.smell-title::before {
  content: "🌸 ";
}
/* 数据模块 */
.data-card {
  background: rgba(255,255,255,0.9);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
}
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 16px;
  margin: 16px 0;
}
.value-point {
  background: ${this.hexToRgba(main1, 0.08)};
  padding: 12px;
  border-radius: 8px;
  border-left: 3px solid ${main2};
}
/* 进度条 */
.progress-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 12px 0;
}
.progress-bar {
  height: 20px;
  width: 60%;
  background: ${this.hexToRgba(main2, 0.2)};
  border-radius: 6px;
  position: relative;
}
.progress-fill {
  height:100%;
  border-radius:10px;
  position: absolute;
  background: linear-gradient(90deg, ${main1}, ${main2});
}
.progress-info {
  width: 28%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.progress-desc {
  font-size:14px;
  color: ${main2};
  font-weight: 500;
}
.progress-percent {
  font-size:14px;
  color: ${main1};
  font-weight: 600;
}
/* 标签系统 */
.tag-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin: 12px 0;
}
.tag {
  padding: 4px 12px;
  border-radius: 16px;
  font-size:13px;
  background: linear-gradient(45deg, ${main1}, ${main2});
  color: white;
  font-weight: 500;
}
/* 版式优化 */
h2 { color: ${main1}; margin-bottom:8px; font-size:20px; font-weight: 600; }
.dashed-line {
  border: 1px dashed ${main2};
  margin: 16px 0;
  opacity:0.6;
}
.sub-text { color: ${text}; opacity:0.8; font-size:16px; line-height: 1.6; }
.highlight { color: ${main2}; font-weight:bold; font-size: 18px; }
.author-sub {
  color: ${text};
  opacity: 0.9;
  font-size: 18px;
  margin-top: 8px;
}
.subtitle-text {
  color: ${text};
  opacity: 0.85;
  font-size: 18px;
  margin-top: 4px;
}
</style>
    `;
  }

  // 工具函数
  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  getEmojiForBar() {
    const emojis = ['🎨', '🔍', '🕯️', '🚧', '🔄', '🌐', '💡', '⚡', '🌟', '🧠'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  getDescForBar(name) {
    if (name.includes('认知')) return '认知拓展力';
    if (name.includes('情绪')) return '情绪治愈力';
    if (name.includes('活力')) return '活力激活率';
    if (name.includes('幸福')) return '幸福感知值';
    if (name.includes('实用')) return '干货密度';
    return '推荐指数';
  }
}

window.CardTemplates = CardTemplates;
