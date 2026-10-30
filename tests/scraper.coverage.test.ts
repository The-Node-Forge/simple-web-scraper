import puppeteer from 'puppeteer';
import axios from 'axios';

import { WebScraper } from '../src/scraper';

jest.mock('puppeteer');
jest.mock('axios');

const mockBrowser = (evaluate: jest.Mock) => {
  const close = jest.fn().mockResolvedValue(undefined);
  (puppeteer.launch as jest.Mock).mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      goto: jest.fn().mockResolvedValue(undefined),
      evaluate,
    }),
    close,
  });
  return close;
};

describe('WebScraper coverage gaps', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    delete (global as { document?: unknown }).document;
  });

  describe('Puppeteer in-page evaluation', () => {
    // page.evaluate is mocked, so run the callback ourselves against a fake DOM
    const runCallback = (el: { innerText: string } | null) =>
      jest
        .fn()
        .mockImplementation(async (fn: (s: string) => unknown, sel: string) => {
          (global as { document?: unknown }).document = {
            querySelector: jest.fn().mockReturnValue(el),
          };
          return fn(sel);
        });

    it('returns the element innerText when the selector matches', async () => {
      mockBrowser(runCallback({ innerText: 'Hello' }));
      const scraper = new WebScraper({ throttle: 0, rules: { t: 'h1' } });

      expect(await scraper.scrape('https://example.com')).toEqual({ t: 'Hello' });
    });

    it('returns null when the selector matches nothing', async () => {
      mockBrowser(runCallback(null));
      const scraper = new WebScraper({ throttle: 0, rules: { t: '.missing' } });

      expect(await scraper.scrape('https://example.com')).toEqual({ t: null });
    });

    it('evaluates every rule', async () => {
      const evaluate = jest
        .fn()
        .mockResolvedValueOnce('A')
        .mockResolvedValueOnce('B');
      const close = mockBrowser(evaluate);
      const scraper = new WebScraper({ throttle: 0, rules: { a: 'h1', b: 'p' } });

      expect(await scraper.scrape('https://example.com')).toEqual({
        a: 'A',
        b: 'B',
      });
      expect(evaluate).toHaveBeenCalledTimes(2);
      expect(close).toHaveBeenCalled();
    });
  });

  describe('Cheerio edge cases', () => {
    const cheerioScraper = (rules: Record<string, string>) =>
      new WebScraper({ usePuppeteer: false, throttle: 0, rules });

    it('returns null for missing or whitespace-only elements', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: '<div id="e">   </div>' });

      expect(
        await cheerioScraper({ missing: 'h1', blank: '#e' }).scrape('https://x.com'),
      ).toEqual({ missing: null, blank: null });
    });

    it('only returns the first match', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: '<p>one</p><p>two</p>' });

      expect(await cheerioScraper({ p: 'p' }).scrape('https://x.com')).toEqual({
        p: 'one',
      });
    });

    it('propagates network errors', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('ECONNREFUSED'));

      await expect(
        cheerioScraper({ t: 'h1' }).scrape('https://x.com'),
      ).rejects.toThrow('ECONNREFUSED');
    });
  });

  describe('defaults', () => {
    it('uses Puppeteer by default', async () => {
      mockBrowser(jest.fn().mockResolvedValue('x'));
      // throttle: 0 is falsy and currently falls back to 1000ms, so use fake timers
      jest.useFakeTimers();
      const scraper = new WebScraper({ rules: { t: 'h1' } });

      const promise = scraper.scrape('https://example.com');
      await jest.advanceTimersByTimeAsync(1000);
      await promise;

      expect(puppeteer.launch).toHaveBeenCalled();
      expect(axios.get).not.toHaveBeenCalled();
    });

    it('waits the full throttle before making any request', async () => {
      jest.useFakeTimers();
      (axios.get as jest.Mock).mockResolvedValue({ data: '<h1>x</h1>' });
      const scraper = new WebScraper({
        usePuppeteer: false,
        throttle: 500,
        rules: { t: 'h1' },
      });

      const promise = scraper.scrape('https://example.com');
      await jest.advanceTimersByTimeAsync(499);
      expect(axios.get).not.toHaveBeenCalled();

      await jest.advanceTimersByTimeAsync(1);
      await promise;
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });
});
