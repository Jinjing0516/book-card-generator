// 主应用逻辑

// 全局状态
let appState = {
  currentContent: null,
  currentColors: null,
  coverUrl: null,
  infoCardHtml: null,
  quoteCardHtml: null,
  remainingRetries: 3,
  generation: 0, // 当前第几代 (0-3)
};

// 初始化模块
const colorGenerator = new window.ColorGenerator();
const contentGenerator = new window.ContentGenerator();
const cardTemplates = new window.CardTemplates();
const imageExporter = new window.ImageExporter();

// DOM元素
const form = document.getElementById('generatorForm');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const placeholderArea = document.getElementById('placeholderArea');
const previewArea = document.getElementById('previewArea');
const regenerateContainer = document.getElementById('regenerateContainer');
const remainingRetriesEl = document.getElementById('remainingRetries');
const generateBtn = document.getElementById('generateBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const infoCardContainer = document.getElementById('infoCardContainer');
const quoteCardContainer = document.getElementById('quoteCardContainer');
const downloadInfoBtn = document.getElementById('downloadInfoBtn');
const downloadQuoteBtn = document.getElementById('downloadQuoteBtn');

// 事件监听
form.addEventListener('submit', handleGenerate);
regenerateBtn.addEventListener('click', handleRegenerate);
downloadInfoBtn.addEventListener('click', downloadInfoCard);
downloadQuoteBtn.addEventListener('click', downloadQuoteCard);

// 封面上传预览
document.getElementById('coverImage').addEventListener('change', handleCoverUpload);

function handleCoverUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  // 预览
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('coverPreview').classList.remove('hidden');
    document.getElementById('previewImg').src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// 从用户上传文件读取封面
async function getUserCoverImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      resolve(e.target.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 主生成流程
async function handleGenerate(e) {
  e.preventDefault();
  
  const title = document.getElementById('bookTitle').value.trim();
  const subtitle = document.getElementById('bookSubtitle').value.trim();
  const author = document.getElementById('author').value.trim();
  const coverFile = document.getElementById('coverImage').files[0];
  
  if (!title || !subtitle || !author || !coverFile) {
    alert('请填写所有必填项（书名、副标题、作者、封面图片）');
    return;
  }
  
  try {
    // 重置状态
    appState.remainingRetries = 3;
    appState.generation = 0;
    updateRetryCount();
    progressContainer.classList.remove('hidden');
    generateBtn.disabled = true;
    
    // 步骤1: 读取用户上传封面
    updateProgress(20, '正在处理封面图片...');
    const coverUrl = await getUserCoverImage(coverFile);
    appState.coverUrl = coverUrl;
    
    // 步骤2: 提取配色
    updateProgress(30, '正在分析封面配色...');
    const { dominant } = await colorGenerator.extractColors(coverUrl);
    const colorScheme = colorGenerator.generateScheme(dominant, 0);
    appState.currentColors = colorScheme;
    console.log('生成配色:', colorScheme);
    
    // 步骤3: 生成内容
    updateProgress(60, '正在生成小红书内容...');
    const content = contentGenerator.generate(title, subtitle, author, `${title} ${subtitle} ${author}`);
    appState.currentContent = content;
    console.log('生成内容:', content);
    
    // 步骤4: 生成HTML
    updateProgress(80, '正在渲染卡片...');
    const infoHtml = cardTemplates.generateInfoCard(content, colorScheme, coverUrl);
    const quoteHtml = cardTemplates.generateQuoteCard(content, colorScheme, coverUrl);
    appState.infoCardHtml = infoHtml;
    appState.quoteCardHtml = quoteHtml;
    
    // 步骤5: 渲染预览
    updateProgress(90, '正在加载预览...');
    renderPreview(infoHtml, quoteHtml);
    
    // 完成
    updateProgress(100, '生成完成！');
    progressContainer.classList.add('hidden');
    placeholderArea.classList.add('hidden');
    previewArea.classList.remove('hidden');
    regenerateContainer.classList.remove('hidden');
    generateBtn.disabled = false;
    
  } catch (error) {
    console.error('生成失败:', error);
    alert(`生成失败: ${error.message}`);
    progressContainer.classList.add('hidden');
    generateBtn.disabled = false;
  }
}

// 重新生成配色
async function handleRegenerate() {
  if (appState.remainingRetries <= 0 || !appState.currentContent || !appState.coverUrl) {
    alert('没有剩余重新生成机会了');
    return;
  }
  
  try {
    regenerateBtn.disabled = true;
    
    // 重新生成配色，增加随机种子
    appState.generation++;
    // 重新提取主色但加入随机扰动
    const { dominant } = await colorGenerator.extractColors(appState.coverUrl);
    const colorScheme = colorGenerator.generateScheme(dominant, appState.generation);
    appState.currentColors = colorScheme;
    
    // 重新生成HTML
    const infoHtml = cardTemplates.generateInfoCard(appState.currentContent, colorScheme, appState.coverUrl);
    const quoteHtml = cardTemplates.generateQuoteCard(appState.currentContent, colorScheme, appState.coverUrl);
    appState.infoCardHtml = infoHtml;
    appState.quoteCardHtml = quoteHtml;
    
    // 重新渲染
    renderPreview(infoHtml, quoteHtml);
    
    // 更新计数
    appState.remainingRetries--;
    updateRetryCount();
    
    if (appState.remainingRetries <= 0) {
      regenerateContainer.classList.add('hidden');
    }
    
    regenerateBtn.disabled = false;
    
  } catch (error) {
    console.error('重新生成失败:', error);
    alert(`重新生成失败: ${error.message}`);
    regenerateBtn.disabled = false;
  }
}

// 更新进度
function updateProgress(percent, text) {
  progressBar.style.width = `${percent}%`;
  progressText.textContent = text;
}

// 更新重试计数
function updateRetryCount() {
  remainingRetriesEl.textContent = appState.remainingRetries;
}

// 渲染预览
function renderPreview(infoHtml, quoteHtml) {
  // 渲染信息卡 - 需要缩放适应容器
  const infoContainer = document.createElement('div');
  infoContainer.innerHTML = infoHtml;
  
  // 获取卡片元素，在预览容器中缩放显示
  const infoCard = infoContainer.querySelector('.card');
  infoCard.classList.add('book-card-preview');
  
  // 计算缩放比例，适应容器宽度
  const containerWidth = infoCardContainer.clientWidth;
  const scale = Math.min(1, containerWidth / 750);
  if (scale < 1) {
    infoCard.style.transform = `scale(${scale})`;
    infoCard.style.transformOrigin = 'top left';
    // 调整高度以适应缩放
    const scaledHeight = 1000 * scale;
    infoContainer.style.height = `${scaledHeight}px`;
  }
  
  infoCardContainer.innerHTML = '';
  infoCardContainer.appendChild(infoCard);
  
  // 同样处理金句卡
  const quoteContainer = document.createElement('div');
  quoteContainer.innerHTML = quoteHtml;
  const quoteCard = quoteContainer.querySelector('.card');
  quoteCard.classList.add('book-card-preview');
  if (scale < 1) {
    quoteCard.style.transform = `scale(${scale})`;
    quoteCard.style.transformOrigin = 'top left';
    const scaledHeight = 1000 * scale;
    quoteContainer.style.height = `${scaledHeight}px`;
  }
  
  quoteCardContainer.innerHTML = '';
  quoteCardContainer.appendChild(quoteCard);
}

// 下载信息卡
async function downloadInfoCard() {
  try {
    downloadInfoBtn.disabled = true;
    downloadInfoBtn.textContent = '生成中...';
    
    // 我们需要重新在隐藏容器中渲染以正确导出
    // 解析HTML，获取卡片
    const parser = new DOMParser();
    const doc = parser.parseFromString(appState.infoCardHtml, 'text/html');
    const card = doc.querySelector('.card');
    
    // 创建临时容器
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.appendChild(card);
    document.body.appendChild(tempContainer);
    
    // 等待字体加载
    await document.fonts.ready;
    await new Promise(r => setTimeout(r, 300));
    
    const dataUrl = await imageExporter.exportFromElement(card);
    const title = document.getElementById('bookTitle').value.trim();
    imageExporter.downloadImage(dataUrl, `${title}-信息卡.png`);
    
    document.body.removeChild(tempContainer);
    downloadInfoBtn.disabled = false;
    downloadInfoBtn.textContent = '下载信息卡';
  } catch (error) {
    console.error('下载失败:', error);
    alert(`下载失败: ${error.message}`);
    downloadInfoBtn.disabled = false;
    downloadInfoBtn.textContent = '下载信息卡';
  }
}

// 下载金句卡
async function downloadQuoteCard() {
  try {
    downloadQuoteBtn.disabled = true;
    downloadQuoteBtn.textContent = '生成中...';
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(appState.quoteCardHtml, 'text/html');
    const card = doc.querySelector('.card');
    
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.appendChild(card);
    document.body.appendChild(tempContainer);
    
    await document.fonts.ready;
    await new Promise(r => setTimeout(r, 300));
    
    const dataUrl = await imageExporter.exportFromElement(card);
    const title = document.getElementById('bookTitle').value.trim();
    imageExporter.downloadImage(dataUrl, `${title}-金句卡.png`);
    
    document.body.removeChild(tempContainer);
    downloadQuoteBtn.disabled = false;
    downloadQuoteBtn.textContent = '下载金句卡';
  } catch (error) {
    console.error('下载失败:', error);
    alert(`下载失败: ${error.message}`);
    downloadQuoteBtn.disabled = false;
    downloadQuoteBtn.textContent = '下载金句卡';
  }
}

console.log('📚 读书卡片生成器 已就绪');
