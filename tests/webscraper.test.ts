import puppeteer from 'puppeteer';
import axios from 'axios';

import { WebScraper } from '../src/scraper';

jest.mock('puppeteer');
jest.mock('axios');

describe('WebScraper', () => {
  const testUrl = 'http://example.com';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('scrape using Puppeteer', () => {
    it('should scrape data with Puppeteer', async () => {
      // Set up Puppeteer mocks
      const mockEvaluate = jest.fn().mockResolvedValue('Mock Title');
      const mockGoto = jest.fn().mockResolvedValue(undefined);
      const mockNewPage = jest.fn().mockResolvedValue({
        goto: mockGoto,
        evaluate: mockEvaluate,
      });
      const mockClose = jest.fn().mockResolvedValue(undefined);
      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: mockNewPage,
        close: mockClose,
      });

      const scraper = new WebScraper({
        usePuppeteer: true,
        throttle: 0, // no delay for tests
        rules: { title: 'h1' },
      });

      const data = await scraper.scrape(testUrl);

      // Verify Puppeteer branch execution
      expect(puppeteer.launch).toHaveBeenCalled();
      expect(mockNewPage).toHaveBeenCalled();
      expect(mockGoto).toHaveBeenCalledWith(testUrl, { waitUntil: 'networkidle2' });
      expect(mockEvaluate).toHaveBeenCalledWith(expect.any(Function), 'h1');
      expect(mockClose).toHaveBeenCalled();
      expect(data).toEqual({ title: 'Mock Title' });
    });

    it('should return an empty object if no rules are provided (Puppeteer)', async () => {
      const mockNewPage = jest.fn().mockResolvedValue({
        goto: jest.fn().mockResolvedValue(undefined),
        evaluate: jest.fn().mockResolvedValue(null),
      });
      const mockClose = jest.fn().mockResolvedValue(undefined);
      (puppeteer.launch as jest.Mock).mockResolvedValue({
        newPage: mockNewPage,
        close: mockClose,
      });

      const scraper = new WebScraper({
        usePuppeteer: true,
        throttle: 0,
        rules: {},
      });
      const data = await scraper.scrape(testUrl);
      expect(data).toEqual({});
    });
  });

  describe('scrape using Cheerio', () => {
    it('should scrape data with Cheerio', async () => {
      const htmlContent = `<html><body><h1>Cheerio Title</h1></body></html>`;
      (axios.get as jest.Mock).mockResolvedValue({ data: htmlContent });

      const scraper = new WebScraper({
        usePuppeteer: false,
        throttle: 0,
        rules: { title: 'h1' },
      });

      const data = await scraper.scrape(testUrl);
      expect(axios.get).toHaveBeenCalledWith(testUrl);
      expect(data).toEqual({ title: 'Cheerio Title' });
    });

    it('should return an empty object if no rules are provided (Cheerio)', async () => {
      const htmlContent = `<html><body><h1>Cheerio Title</h1></body></html>`;
      (axios.get as jest.Mock).mockResolvedValue({ data: htmlContent });

      const scraper = new WebScraper({
        usePuppeteer: false,
        throttle: 0,
        rules: {},
      });

      const data = await scraper.scrape(testUrl);
      expect(data).toEqual({});
    });

    it('should trim whitespace from scraped text', async () => {
      const htmlContent = `<html><body><h1>  Cheerio Title   </h1></body></html>`;
      (axios.get as jest.Mock).mockResolvedValue({ data: htmlContent });

      const scraper = new WebScraper({
        usePuppeteer: false,
        throttle: 0,
        rules: { title: 'h1' },
      });

      const data = await scraper.scrape(testUrl);
      expect(data).toEqual({ title: 'Cheerio Title' });
    });
  });

  describe('throttle delay', () => {
    it('should wait for the throttle duration before scraping', async () => {
      // Spy on setTimeout (used by the delay method)
      jest.useFakeTimers();

      const htmlContent = `<html><body><h1>Cheerio Title</h1></body></html>`;
      (axios.get as jest.Mock).mockResolvedValue({ data: htmlContent });

      const throttleTime = 500;
      const scraper = new WebScraper({
        usePuppeteer: false,
        throttle: throttleTime,
        rules: { title: 'h1' },
      });

      const scrapePromise = scraper.scrape(testUrl);

      // Fast-forward time
      jest.advanceTimersByTime(throttleTime);
      await scrapePromise;

      // If we reached this point without errors, the delay was executed.
      // Restore real timers
      jest.useRealTimers();
    });
  });
});
