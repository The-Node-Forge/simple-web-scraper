import puppeteer from 'puppeteer';
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScraperOptions {
  usePuppeteer?: boolean;
  throttle?: number;
  timeout?: number; // max time in ms for a page load / HTTP request (default 30000)
  rules?: Record<string, string>; // object defining CSS selectors for extracting specific data
}

const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_CONTENT_LENGTH = 10 * 1024 * 1024; // 10 MB cap on static HTML responses

/**
 * Only http(s) URLs are scraped. Puppeteer would otherwise happily load
 * `file://` or `chrome://` URLs and return their contents through the rules.
 */
function assertHttpUrl(url: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('Invalid URL');
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Unsupported URL protocol: ${parsed.protocol}`);
  }
}

export class WebScraper {
  private usePuppeteer: boolean;
  private throttle: number;
  private timeout: number;
  private rules: Record<string, string>;

  constructor(options: ScraperOptions = {}) {
    this.usePuppeteer =
      options.usePuppeteer !== undefined ? options.usePuppeteer : true;

    this.throttle = options.throttle || 1000;

    this.timeout = options.timeout ?? DEFAULT_TIMEOUT_MS;

    this.rules = options.rules || {};
  }

  /**
   * Scrapes a webpage based on the provided URL.
   * @param url - The webpage URL to scrape.
   * @returns A promise resolving to an object with extracted data.
   */
  async scrape(url: string): Promise<Record<string, unknown>> {
    assertHttpUrl(url);

    await this.delay(this.throttle); // introduce a delay before each request

    if (this.usePuppeteer) {
      return this.scrapeWithPuppeteer(url); // javaScript-heavy sites
    } else {
      return this.scrapeWithCheerio(url); // simple HTML parsing
    }
  }

  /**
   * Uses Puppeteer to scrape data from a webpage.
   * Puppeteer is useful for scraping JavaScript-rendered content.
   * @param url - The webpage URL to scrape.
   * @returns A promise resolving to an object with extracted data.
   */
  private async scrapeWithPuppeteer(url: string): Promise<Record<string, unknown>> {
    const browser = await puppeteer.launch();

    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2', timeout: this.timeout }); // navigate to the URL and wait for network requests to settle

      const data: Record<string, unknown> = {};

      for (const key in this.rules) {
        const selector = this.rules[key];

        data[key] = await page.evaluate((sel: string) => {
          const el = document.querySelector(sel); // find the element using the selector
          return el ? (el as HTMLElement).innerText : null; // return text content
        }, selector);
      }

      return data;
    } finally {
      await browser.close(); // always release the browser, even if navigation/evaluation throws
    }
  }

  /**
   * Uses Cheerio and Axios to scrape static HTML pages.
   * This is faster and more lightweight than Puppeteer for non-JavaScript-heavy pages.
   * @param url - The webpage URL to scrape.
   * @returns A promise resolving to an object with extracted data.
   */
  private async scrapeWithCheerio(url: string): Promise<Record<string, unknown>> {
    const response = await axios.get(url, {
      timeout: this.timeout,
      maxContentLength: MAX_CONTENT_LENGTH,
    });
    const html = response.data;
    const $ = cheerio.load(html); // load the HTML into Cheerio for parsing

    const data: Record<string, unknown> = {};

    for (const key in this.rules) {
      const selector = this.rules[key]; // get the CSS selector

      data[key] = $(selector).first().text().trim() || null; // extract text and remove extra spaces
    }
    return data;
  }

  /**
   * Delays execution for a specified amount of time.
   * @param ms - The number of milliseconds to wait.
   * @returns A promise that resolves after the delay.
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
