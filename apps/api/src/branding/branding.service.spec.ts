import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { BrandingService } from './branding.service';

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

import axios from 'axios';

describe('BrandingService', () => {
  let service: BrandingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrandingService],
    }).compile();

    service = module.get<BrandingService>(BrandingService);
    vi.clearAllMocks();
  });

  describe('extractFromUrl', () => {
    it('should extract branding from a valid URL', async () => {
      const mockHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Test Company</title>
            <meta name="description" content="A test company description">
            <link rel="icon" href="/favicon.ico">
            <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
            <style>
              .primary { color: #3B82F6; }
              .secondary { color: #10B981; }
            </style>
          </head>
          <body>
            <header>
              <img class="logo" src="/images/logo.png" alt="Logo">
            </header>
          </body>
        </html>
      `;

      vi.mocked(axios.get).mockResolvedValue({ data: mockHtml });

      const result = await service.extractFromUrl('https://test.com');

      expect(result.metadata?.title).toBe('Test Company');
      expect(result.metadata?.description).toBe('A test company description');
      expect(result.logo).toBe('https://test.com/images/logo.png');
      expect(result.fonts?.heading).toBe('Roboto');
    });

    it('should throw BadRequestException for invalid protocol', async () => {
      await expect(service.extractFromUrl('ftp://test.com')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid URL', async () => {
      await expect(service.extractFromUrl('not-a-url')).rejects.toThrow(BadRequestException);
    });

    it('should handle axios errors gracefully', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('Network error'));

      await expect(service.extractFromUrl('https://unreachable.com')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should use favicon as fallback when no logo found', async () => {
      const mockHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Test</title>
            <link rel="icon" href="/favicon.ico">
          </head>
          <body></body>
        </html>
      `;

      vi.mocked(axios.get).mockResolvedValue({ data: mockHtml });

      const result = await service.extractFromUrl('https://test.com');

      expect(result.logo).toBe('https://test.com/favicon.ico');
    });

    it('should extract colors from inline styles', async () => {
      const mockHtml = `
        <!DOCTYPE html>
        <html>
          <head><title>Test</title></head>
          <body>
            <div style="color: #FF5733;"></div>
            <div style="background-color: #33FF57;"></div>
          </body>
        </html>
      `;

      vi.mocked(axios.get).mockResolvedValue({ data: mockHtml });

      const result = await service.extractFromUrl('https://test.com');

      expect(result.colors.primary).toBeDefined();
    });

    it('should use default fonts when none found', async () => {
      const mockHtml = `
        <!DOCTYPE html>
        <html>
          <head><title>Test</title></head>
          <body></body>
        </html>
      `;

      vi.mocked(axios.get).mockResolvedValue({ data: mockHtml });

      const result = await service.extractFromUrl('https://test.com');

      expect(result.fonts?.heading).toBe('Inter');
      expect(result.fonts?.body).toBe('Inter');
    });

    it('should handle protocol-relative URLs', async () => {
      const mockHtml = `
        <!DOCTYPE html>
        <html>
          <head><title>Test</title></head>
          <body>
            <img class="logo" src="//cdn.test.com/logo.png">
          </body>
        </html>
      `;

      vi.mocked(axios.get).mockResolvedValue({ data: mockHtml });

      const result = await service.extractFromUrl('https://test.com');

      expect(result.logo).toBe('https://cdn.test.com/logo.png');
    });
  });
});
