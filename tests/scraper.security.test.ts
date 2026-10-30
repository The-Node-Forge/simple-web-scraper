import puppeteer from 'puppeteer';
import axios from 'axios';

import { WebScraper } from '../src/scraper';

jest.mock('puppeteer');
jest.mock('axios');

describe('WebScraper security hardening', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('URL validation', () => {
    it.each([
      'file:///etc/passwd',
      'chrome://settings',
      'ftp://example.com/file',
      'javascript:alert(1)',
      'data:text/html,<h1>hi</h1>',
    ])('rejects non-http(s) URL %s without launching anything', async (url) => {
      const scraper = new WebScraper({ throttle: 0, rules: { t: 'h1' } });

      await expect(scraper.scrape(url)).rejects.toThrow('Unsupported URL protocol');
      expect(puppeteer.launch).not.toHaveBeenCalled();
      expect(axios.get).not.toHaveBeenCalled();
    });

    it('rejects malformed URLs', async () => {
      const scraper = new WebScraper({ throttle: 0, usePuppeteer: false });

      await expect(scraper.scrape('not a url')).rejects.toThrow('Invalid URL');
    });

    it('allows http and https URLs', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: '<h1>ok</h1>' });
      const scraper = new WebScraper({
        throttle: 0,
        usePuppeteer: false,
        rules: { t: 'h1' },
      });

      await expect(scraper.scrape('http://example.com')).resolves.toEqual({
        t: 'ok',
      });
      await expect(scraper.scrape('https://example.com')).resolves.toEqual({
        t: 'ok',
      });
    });
  });

  describe('request limits', () => {
    it('applies a default timeout and response size cap to axios', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: '' });
      const scraper = new WebScraper({ throttle: 0, usePuppeteer: false });

      await scraper.scrape('https://example.com');

      expect(axios.get).toHaveBeenCalledWith('https://example.com', {
        timeout: 30000,
        maxContentLength: 10 * 1024 * 1024,
      });
    });

    it('passes a custom timeout to axios and puppeteer', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: '' });
      const goto = jest.fn().mockResolvedValue(undefined);
      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({ goto, evaluate: jest.fn() }),
        close: jest.fn().mockResolvedValue(undefined),
      });

      await new WebScraper({ throttle: 0, usePuppeteer: false, timeout: 5 }).scrape(
        'https://example.com',
      );
      expect(axios.get).toHaveBeenCalledWith(
        'https://example.com',
        expect.objectContaining({ timeout: 5 }),
      );

      await new WebScraper({ throttle: 0, usePuppeteer: true, timeout: 7 }).scrape(
        'https://example.com',
      );
      expect(goto).toHaveBeenCalledWith('https://example.com', {
        waitUntil: 'networkidle2',
        timeout: 7,
      });
    });
  });

  describe('browser cleanup', () => {
    it('closes the browser when navigation fails', async () => {
      const close = jest.fn().mockResolvedValue(undefined);
      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn().mockRejectedValue(new Error('net::ERR_TIMED_OUT')),
          evaluate: jest.fn(),
        }),
        close,
      });
      const scraper = new WebScraper({ throttle: 0, rules: { t: 'h1' } });

      await expect(scraper.scrape('https://example.com')).rejects.toThrow(
        'net::ERR_TIMED_OUT',
      );
      expect(close).toHaveBeenCalledTimes(1);
    });

    it('closes the browser when a selector evaluation fails', async () => {
      const close = jest.fn().mockResolvedValue(undefined);
      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn().mockResolvedValue(undefined),
          evaluate: jest.fn().mockRejectedValue(new Error('bad selector')),
        }),
        close,
      });
      const scraper = new WebScraper({ throttle: 0, rules: { t: '!!!' } });

      await expect(scraper.scrape('https://example.com')).rejects.toThrow(
        'bad selector',
      );
      expect(close).toHaveBeenCalledTimes(1);
    });
  });
});
