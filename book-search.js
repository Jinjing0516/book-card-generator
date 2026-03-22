// 图书搜索模块 - 使用Google Books API搜索图书和封面

class BookSearch {
  constructor() {
    this.apiUrl = 'https://www.googleapis.com/books/v1/volumes';
  }

  async searchBook(title, author) {
    try {
      let query = `${title} ${author}`.trim();
      const url = `${this.apiUrl}?q=${encodeURIComponent(query)}&maxResults=5`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        // 尝试只搜书名
        const url2 = `${this.apiUrl}?q=${encodeURIComponent(title)}&maxResults=5`;
        const response2 = await fetch(url2);
        const data2 = await response2.json();
        if (!data2.items || data2.items.length === 0) {
          throw new Error('未找到图书，请检查书名是否正确');
        }
        data.items = data2.items;
      }

      // 找到最匹配的结果
      const item = this.findBestMatch(data.items, title, author);
      
      return {
        title: item.volumeInfo.title || title,
        subtitle: item.volumeInfo.subtitle || '',
        authors: item.volumeInfo.authors || [author],
        description: item.volumeInfo.description || '',
        coverUrl: this.getLargeCoverUrl(item.volumeInfo.imageLinks),
      };
    } catch (error) {
      console.error('图书搜索失败:', error);
      throw error;
    }
  }

  findBestMatch(items, title, author) {
    // 简单匹配：优先选择标题包含关键词且有作者匹配的
    let bestScore = 0;
    let bestItem = items[0];
    
    const titleLower = title.toLowerCase();
    const authorLower = author.toLowerCase();
    
    for (const item of items) {
      let score = 0;
      const bookTitle = (item.volumeInfo.title || '').toLowerCase();
      const authors = (item.volumeInfo.authors || []).join(' ').toLowerCase();
      
      // 标题匹配
      if (bookTitle.includes(titleLower)) score += 10;
      // 作者匹配
      if (authors.includes(authorLower)) score += 5;
      // 有封面加分
      if (item.volumeInfo.imageLinks) score += 3;
      
      if (score > bestScore) {
        bestScore = score;
        bestItem = item;
      }
    }
    
    return bestItem;
  }

  getLargeCoverUrl(imageLinks) {
    if (!imageLinks) return null;
    // 优先用大尺寸封面
    return imageLinks.extraLarge || imageLinks.large || imageLinks.medium || imageLinks.thumbnail;
  }

  // 代理图片解决CORS问题 - 优先使用谷歌代理，如果不行回退到其他方案
  proxyImageUrl(url) {
    // 使用免费的CORS代理
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  }
}

window.BookSearch = BookSearch;
