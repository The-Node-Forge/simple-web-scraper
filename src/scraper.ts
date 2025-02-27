import puppeteer from 'puppeteer';
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScraperOptions {
  usePuppeteer?: boolean;
  throttle?: number; // delay between requests to avoid overwhelming the server
  rules?: Record<string, string>; // object defining CSS selectors for extracting specific data
}

export class WebScraper {
  private usePuppeteer: boolean;
  private throttle: number;
  private rules: Record<string, string>;

  constructor(options: ScraperOptions = {}) {
    this.usePuppeteer =
      options.usePuppeteer !== undefined ? options.usePuppeteer : true;

    this.throttle = options.throttle || 1000; // set a default throttle delay of 1 second

    this.rules = options.rules || {}; // use provided extraction rules or default to an empty object
  }

  /**
   * Scrapes a webpage based on the provided URL.
   * @param url - The webpage URL to scrape.
   * @returns A promise resolving to an object with extracted data.
   */
  async scrape(url: string): Promise<Record<string, any>> {
    await this.delay(this.throttle); // introduce a delay before each request

    if (this.usePuppeteer) {
      return this.scrapeWithPuppeteer(url); // uses Puppeteer for rendering JavaScript-heavy sites
    } else {
      return this.scrapeWithCheerio(url); // usesCheerio for simple HTML parsing
    }
  }

  /**
   * Uses Puppeteer to scrape data from a webpage.
   * Puppeteer is useful for scraping JavaScript-rendered content.
   * @param url - The webpage URL to scrape.
   * @returns A promise resolving to an object with extracted data.
   */
  private async scrapeWithPuppeteer(url: string): Promise<Record<string, any>> {
    const browser = await puppeteer.launch(); // launch a headless browser instance
    const page = await browser.newPage(); // open a new page/tab
    await page.goto(url, { waitUntil: 'networkidle2' }); // navigtae to the URL and wait for network requests to settle

    const data: Record<string, any> = {}; // initialize an object to store extracted data

    // iterate over the rules (CSS selectors) and extract data
    for (const key in this.rules) {
      const selector = this.rules[key];
      data[key] = await page.evaluate((sel: string) => {
        const el = document.querySelector(sel); // find the element using the selector
        return el ? (el as HTMLElement).innerText : null; // extract and return text content
      }, selector);
    }

    await browser.close();
    return data;
  }

  /**
   * Uses Cheerio and Axios to scrape static HTML pages.
   * This is faster and more lightweight than Puppeteer for non-JavaScript-heavy pages.
   * @param url - The webpage URL to scrape.
   * @returns A promise resolving to an object with extracted data.
   */
  private async scrapeWithCheerio(url: string): Promise<Record<string, any>> {
    const response = await axios.get(url); // fetch the webpage HTML using Axios
    const html = response.data; // get the raw HTML content
    const $ = cheerio.load(html); // load the HTML into Cheerio for parsing

    const data: Record<string, any> = {}; // initialize an object to store extracted data

    // iterate over the rules (CSS selectors) and extract data
    for (const key in this.rules) {
      const selector = this.rules[key]; // get the CSS selector for the specific data
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
