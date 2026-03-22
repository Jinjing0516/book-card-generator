// 图片导出模块 - HTML转PNG图片

class ImageExporter {
  constructor() {
    this.options = {
      width: 750,
      height: 1000,
      quality: 0.95,
      pixelRatio: 2, // 高清导出
    };
  }

  async exportToPng(htmlContent) {
    // 创建一个隐藏的iframe来渲染HTML
    return new Promise((resolve, reject) => {
      // 将HTML内容转换为Blob
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      iframe.onload = async () => {
        try {
          // 等待渲染完成
          await new Promise(r => setTimeout(r, 500));
          
          const cardElement = iframe.contentDocument.querySelector('.card');
          if (!cardElement) {
            throw new Error('找不到卡片元素');
          }
          
          // 使用html-to-image导出
          const dataUrl = await htmlToImage.toPng(cardElement, {
            width: 750 * this.options.pixelRatio,
            height: 1000 * this.options.pixelRatio,
            quality: this.options.quality,
            pixelRatio: this.options.pixelRatio,
          });
          
          URL.revokeObjectURL(url);
          document.body.removeChild(iframe);
          resolve(dataUrl);
        } catch (error) {
          URL.revokeObjectURL(url);
          document.body.removeChild(iframe);
          reject(error);
        }
      };
      iframe.onerror = () => {
        URL.revokeObjectURL(url);
        document.body.removeChild(iframe);
        reject(new Error('加载HTML失败'));
      };
      document.body.appendChild(iframe);
    });
  }

  // 下载图片
  downloadImage(dataUrl, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 从已有的DOM元素直接导出（预览用）
  async exportFromElement(element) {
    try {
      // 导出时用原尺寸
      const dataUrl = await htmlToImage.toPng(element, {
        width: 750 * this.options.pixelRatio,
        height: 1000 * this.options.pixelRatio,
        quality: this.options.quality,
        pixelRatio: this.options.pixelRatio,
      });
      return dataUrl;
    } catch (error) {
      throw error;
    }
  }
}

window.ImageExporter = ImageExporter;
