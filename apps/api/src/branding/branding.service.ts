import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ExtractedBranding {
  logo?: string;
  colors: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  fonts: {
    heading?: string;
    body?: string;
  };
  metadata: {
    title?: string;
    description?: string;
    favicon?: string;
  };
}

@Injectable()
export class BrandingService {
  async extractFromUrl(url: string): Promise<ExtractedBranding> {
    try {
      // Validate URL
      const parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new BadRequestException('Invalid URL protocol');
      }

      // Fetch the page
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; PitchDeckBot/1.0; +https://pitchdeck.app)',
        },
      });

      const $ = cheerio.load(response.data);
      const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;

      // Extract logo
      const logo = this.extractLogo($, baseUrl);

      // Extract colors from CSS
      const colors = this.extractColors($, response.data);

      // Extract fonts
      const fonts = this.extractFonts($);

      // Extract metadata
      const metadata = this.extractMetadata($, baseUrl);

      return {
        logo,
        colors,
        fonts,
        metadata,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to extract branding: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  private extractLogo($: cheerio.CheerioAPI, baseUrl: string): string | undefined {
    // Try common logo selectors
    const logoSelectors = [
      'img[class*="logo"]',
      'img[id*="logo"]',
      'a[class*="logo"] img',
      'header img:first-of-type',
      '.navbar-brand img',
      '[class*="brand"] img',
    ];

    for (const selector of logoSelectors) {
      const logoEl = $(selector).first();
      if (logoEl.length) {
        let src = logoEl.attr('src');
        if (src) {
          // Make absolute URL
          if (src.startsWith('//')) {
            src = `https:${src}`;
          } else if (src.startsWith('/')) {
            src = `${baseUrl}${src}`;
          } else if (!src.startsWith('http')) {
            src = `${baseUrl}/${src}`;
          }
          return src;
        }
      }
    }

    // Try favicon as fallback
    const favicon =
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href');
    if (favicon) {
      if (favicon.startsWith('/')) {
        return `${baseUrl}${favicon}`;
      }
      return favicon;
    }

    return undefined;
  }

  private extractColors(
    $: cheerio.CheerioAPI,
    html: string,
  ): ExtractedBranding['colors'] {
    const colors: ExtractedBranding['colors'] = {};

    // Extract colors from inline styles and style tags
    const colorRegex =
      /#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)/g;
    const foundColors = new Map<string, number>();

    // Get colors from style tags
    $('style').each((_, el) => {
      const cssText = $(el).text();
      const matches = cssText.match(colorRegex) || [];
      matches.forEach((color) => {
        const normalized = this.normalizeColor(color);
        if (normalized && !this.isGrayscale(normalized)) {
          foundColors.set(normalized, (foundColors.get(normalized) || 0) + 1);
        }
      });
    });

    // Get colors from inline styles
    $('[style]').each((_, el) => {
      const style = $(el).attr('style') || '';
      const matches = style.match(colorRegex) || [];
      matches.forEach((color) => {
        const normalized = this.normalizeColor(color);
        if (normalized && !this.isGrayscale(normalized)) {
          foundColors.set(normalized, (foundColors.get(normalized) || 0) + 1);
        }
      });
    });

    // Sort by frequency and pick top colors
    const sortedColors = Array.from(foundColors.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([color]) => color);

    if (sortedColors.length > 0) colors.primary = sortedColors[0];
    if (sortedColors.length > 1) colors.secondary = sortedColors[1];
    if (sortedColors.length > 2) colors.accent = sortedColors[2];

    // Default background and text
    colors.background = '#ffffff';
    colors.text = '#1a1a1a';

    return colors;
  }

  private normalizeColor(color: string): string | null {
    // Convert to lowercase hex
    if (color.startsWith('#')) {
      const hex = color.toLowerCase();
      if (hex.length === 4) {
        // Expand shorthand
        return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
      }
      return hex;
    }

    // Convert rgb to hex
    if (color.startsWith('rgb')) {
      const match = color.match(/\d+/g);
      if (match && match.length >= 3) {
        const [r, g, b] = match.map(Number);
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      }
    }

    return null;
  }

  private isGrayscale(hex: string): boolean {
    if (!hex.startsWith('#') || hex.length !== 7) return false;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    // Check if all channels are similar (grayscale)
    return Math.max(r, g, b) - Math.min(r, g, b) < 20;
  }

  private extractFonts($: cheerio.CheerioAPI): ExtractedBranding['fonts'] {
    const fonts: ExtractedBranding['fonts'] = {};

    // Look for Google Fonts or other font links
    $('link[href*="fonts.googleapis.com"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        const fontMatch = href.match(/family=([^:&]+)/);
        if (fontMatch) {
          const fontName = decodeURIComponent(fontMatch[1].replace(/\+/g, ' '));
          if (!fonts.heading) fonts.heading = fontName;
          else if (!fonts.body) fonts.body = fontName;
        }
      }
    });

    // Fallback defaults
    if (!fonts.heading) fonts.heading = 'Inter';
    if (!fonts.body) fonts.body = 'Inter';

    return fonts;
  }

  private extractMetadata(
    $: cheerio.CheerioAPI,
    baseUrl: string,
  ): ExtractedBranding['metadata'] {
    const title = $('title').text().trim() || $('meta[property="og:title"]').attr('content');
    const description =
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content');

    let favicon =
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      '/favicon.ico';

    if (favicon.startsWith('/')) {
      favicon = `${baseUrl}${favicon}`;
    }

    return { title, description, favicon };
  }
}
