import puppeteer from 'puppeteer';
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScraperOptions {
  usePuppeteer?: boolean;
  throttle?: number;
  rules?: Record<string, string>;
}

export class WebScraper {
  private usePuppeteer: boolean;
  private throttle: number;
  private rules: Record<string, string>;

  constructor(options: ScraperOptions = {}) {
    this.usePuppeteer = options.usePuppeteer !== undefined ? options.usePuppeteer : true;
    this.throttle = options.throttle || 1000;
    this.rules = options.rules || {};
  }

  /**
   * Scrapes the provided URL based on the configured options.
   * @param url - The URL to scrape.
   * @returns A promise resolving to an object with the scraped data.
   */
  async scrape(url: string): Promise<Record<string, any>> {
    await this.delay(this.throttle);

    if (this.usePuppeteer) {
      return this.scrapeWithPuppeteer(url);
    } else {
      return this.scrapeWithCheerio(url);
    }
  }

  private async scrapeWithPuppeteer(url: string): Promise<Record<string, any>> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const data: Record<string, any> = {};
    for (const key in this.rules) {
      const selector = this.rules[key];
      data[key] = await page.evaluate((sel: string) => {
        const el = document.querySelector(sel);
        return el ? el.innerText : null;
      }, selector);
    }

    await browser.close();
    return data;
  }

  private async scrapeWithCheerio(url: string): Promise<Record<string, any>> {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const data: Record<string, any> = {};
    for (const key in this.rules) {
      const selector = this.rules[key];
      data[key] = $(selector).first().text().trim() || null;
    }
    return data;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
