// 图书搜索模块 - 多引擎聚合搜索
// 优先级：豆瓣图书API (国内首选) → Google Books API → OpenLibrary

class BookSearch {
  constructor() {
    this.doubanApiUrl = 'https://api.douban.com/v2/book/search';
    this.googleApiUrl = 'https://www.googleapis.com/books/v1/volumes';
    this.openlibraryApiUrl = 'https://openlibrary.org/search.json';
  }

  async searchBook(title, author) {
    // 优先级1: 先试豆瓣
    try {
      console.log('尝试豆瓣搜索...');
      const result = await this.searchDouban(title, author);
      if (result && result.coverUrl) {
        console.log('豆瓣搜索成功');
        return result;
      }
    } catch (error) {
      console.log('豆瓣搜索失败，尝试Google...', error);
    }

    // 优先级2: 再试Google Books
    try {
      console.log('尝试Google Books搜索...');
      const result = await this.searchGoogle(title, author);
      if (result && result.coverUrl) {
        console.log('Google Books搜索成功');
        return result;
      }
    } catch (error) {
      console.log('Google搜索失败，尝试Open Library...', error);
    }

    // 优先级3: 最后试Open Library
    try {
      console.log('尝试Open Library搜索...');
      const result = await this.searchOpenLibrary(title, author);
      if (result && result.coverUrl) {
        console.log('Open Library搜索成功');
        return result;
      }
    } catch (error) {
      console.log('Open Library搜索失败', error);
    }

    // 全都失败了
    throw new Error('未找到图书，请检查书名/作者是否正确');
  }

  // 豆瓣搜索
  async searchDouban(title, author) {
    const query = `${title} ${author}`.trim();
    const url = `${this.doubanApiUrl}?q=${encodeURIComponent(query)}&count=5`;
    // 使用CORS代理
    const proxiedUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxiedUrl);
    const data = await response.json();
    
    if (!data.books || data.books.length === 0) {
      return null;
    }

    // 找最匹配的
    const item = this.findBestMatchDouban(data.books, title, author);
    if (!item) return null;

    return {
      title: item.title || title,
      subtitle: '',
      authors: item.author ? [item.author] : [author],
      description: item.summary || '',
      coverUrl: this.getLargeCoverUrlDouban(item.id),
    };
  }

  // 豆瓣封面URL
  getLargeCoverUrlDouban(bookId) {
    // 豆瓣封面 -> L = large
    return `https://img3.doubanio.com/spic/s1000000/${bookId}.jpg`;
  }

  findBestMatchDouban(books, title, author) {
    let bestScore = 0;
    let bestItem = null;
    
    const titleLower = title.toLowerCase();
    const authorLower = author.toLowerCase();
    
    for (const item of books) {
      let score = 0;
      const bookTitle = (item.title || '').toLowerCase();
      const bookAuthor = (item.author || '').toLowerCase();
      
      if (bookTitle.includes(titleLower)) score += 10;
      if (bookAuthor.includes(authorLower)) score += 5;
      if (item.image) score += 3;
      
      if (score > bestScore) {
        bestScore = score;
        bestItem = item;
      }
    }
    
    return bestItem;
  }

  // Google Books搜索
  async searchGoogle(title, author) {
    let query = `${title} ${author}`.trim();
    const url = `${this.googleApiUrl}?q=${encodeURIComponent(query)}&maxResults=5`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      // 尝试只搜书名
      const url2 = `${this.googleApiUrl}?q=${encodeURIComponent(title)}&maxResults=5`;
      const response2 = await fetch(url2);
      const data2 = await response2.json();
      if (!data2.items || data2.items.length === 0) {
        return null;
      }
      data.items = data2.items;
    }

    const item = this.findBestMatchGoogle(data.items, title, author);
    if (!item) return null;
    
    return {
      title: item.volumeInfo.title || title,
      subtitle: item.volumeInfo.subtitle || '',
      authors: item.volumeInfo.authors || [author],
      description: item.volumeInfo.description || '',
      coverUrl: this.getLargeCoverUrlGoogle(item.volumeInfo.imageLinks),
    };
  }

  getLargeCoverUrlGoogle(imageLinks) {
    if (!imageLinks) return null;
    return imageLinks.extraLarge || imageLinks.large || imageLinks.medium || imageLinks.thumbnail;
  }

  findBestMatchGoogle(items, title, author) {
    let bestScore = 0;
    let bestItem = items[0];
    
    const titleLower = title.toLowerCase();
    const authorLower = author.toLowerCase();
    
    for (const item of items) {
      let score = 0;
      const bookTitle = (item.volumeInfo.title || '').toLowerCase();
      const authors = (item.volumeInfo.authors || []).join(' ').toLowerCase();
      
      if (bookTitle.includes(titleLower)) score += 10;
      if (authors.includes(authorLower)) score += 5;
      if (item.volumeInfo.imageLinks) score += 3;
      
      if (score > bestScore) {
        bestScore = score;
        bestItem = item;
      }
    }
    
    return bestItem;
  }

  // Open Library搜索
  async searchOpenLibrary(title, author) {
    const query = `${title} ${author}`.trim();
    const url = `${this.openlibraryApiUrl}?q=${encodeURIComponent(query)}&limit=5`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.docs || data.docs.length === 0) {
      return null;
    }

    const item = this.findBestMatchOpenLibrary(data.docs, title, author);
    if (!item) return null;
    
    const coverId = item.cover_i || item.cover_edition_key;
    if (!coverId) return null;

    return {
      title: item.title || title,
      subtitle: item.subtitle || '',
      authors: item.author_name ? item.author_name : [author],
      description: item.description || '',
      coverUrl: `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`,
    };
  }

  findBestMatchOpenLibrary(items, title, author) {
    let bestScore = 0;
    let bestItem = null;
    
    const titleLower = title.toLowerCase();
    const authorLower = author.toLowerCase();
    
    for (const item of items) {
      let score = 0;
      const bookTitle = (item.title || '').toLowerCase();
      const authors = (item.author_name || []).join(' ').toLowerCase();
      
      if (bookTitle.includes(titleLower)) score += 10;
      if (authors.includes(authorLower)) score += 5;
      if (item.cover_i || item.cover_edition_key) score += 3;
      
      if (score > bestScore) {
        bestScore = score;
        bestItem = item;
      }
    }
    
    return bestItem;
  }

  // 代理图片解决CORS问题
  proxyImageUrl(url) {
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  }
}

window.BookSearch = BookSearch;
