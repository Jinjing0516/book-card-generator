// 配色生成模块 - 从封面提取颜色并生成协调配色方案

class ColorGenerator {
  constructor() {
    this.colorThief = null;
  }

  async extractColors(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const palette = colorThief.getPalette(img, 5);
          const dominant = colorThief.getColor(img);
          resolve({
            dominant: dominant,
            palette: palette
          });
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('加载图片失败'));
      img.src = imageUrl;
    });
  }

  // RGB 转 HSL
  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  }

  // HSL 转 RGB
  hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  // RGB 转 十六进制
  rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  // 十六进制转 RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  }

  // 生成配色方案
  generateScheme(dominantRgb, seed = 0) {
    const [r, g, b] = dominantRgb;
    let [h, s, l] = this.rgbToHsl(r, g, b);
    
    // 加入随机扰动用于重新生成
    if (seed > 0) {
      h += (Math.random() * 60 - 30);
      s += (Math.random() * 20 - 10);
      l += (Math.random() * 10 - 5);
    }
    
    // 限制范围
    h = (h + 360) % 360;
    s = Math.max(20, Math.min(80, s));
    l = Math.max(20, Math.min(70, l));

    // 主色调1（提取的主色）
    const main1Hsl = [h, s, l];
    const main1Rgb = this.hslToRgb(...main1Hsl);
    const main1Hex = this.rgbToHex(...main1Rgb);

    // 主色调2（互补色偏移180度，如果太接近就偏移90度）
    const main2Hsl = [(h + 180) % 360, Math.max(s - 10, 15), Math.min(l + 15, 85)];
    const main2Rgb = this.hslToRgb(...main2Hsl);
    const main2Hex = this.rgbToHex(...main2Rgb);

    // 背景渐变颜色 - 降低饱和度提高明度
    const bg1Hsl = [h, Math.max(s - 40, 10), Math.min(l + 35, 95)];
    const bg2Hsl = [main2Hsl[0], Math.max(main2Hsl[1] - 40, 10), Math.min(main2Hsl[2] + 35, 95)];
    const bg1Hex = this.rgbToHex(...this.hslToRgb(...bg1Hsl));
    const bg2Hex = this.rgbToHex(...this.hslToRgb(...bg2Hsl));

    // 文字颜色 - 保证对比度
    const textL = (l < 40) ? 90 : 15;
    const textRgb = this.hslToRgb(h, 80, textL);
    const textHex = this.rgbToHex(...textRgb);

    // 辅助色（浅点缀）
    const accentRgb = this.hslToRgb(h, s, Math.min(l + 30, 90));
    const accentHex = this.rgbToHex(...accentRgb);

    return {
      main1: main1Hex,
      main2: main2Hex,
      bg1: bg1Hex,
      bg2: bg2Hex,
      text: textHex,
      accent: accentHex,
      // 计算对比度，确保可读性
      contrast: this.getContrastRatio(main1Rgb, [255, 255, 255])
    };
  }

  // 计算对比度
  getContrastRatio(rgb1, rgb2) {
    const l1 = this.getLuminance(rgb1);
    const l2 = this.getLuminance(rgb2);
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  getLuminance(rgb) {
    const [r, g, b] = rgb.map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
}

window.ColorGenerator = ColorGenerator;
