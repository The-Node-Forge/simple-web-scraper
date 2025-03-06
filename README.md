<div align="center">

# Simple Web Scraper

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Made with TypeScript](https://img.shields.io/badge/Made%20with-TypeScript-007acc)

[![NPM Version](https://img.shields.io/npm/v/@the-node-forge/simple-web-scraper)](https://www.npmjs.com/package/@the-node-forge/simple-web-scraper)
![Platform](https://img.shields.io/badge/platform-node.js%20%7C%20browser-brightgreen)

[Live Documentation](https://The-Node-Forge.github.io/simple-web-scraper/)

</div>

A **lightweight and efficient web scraping package** for JavaScript/TypeScript
applications. This package helps developers **fetch HTML content**, **parse web
pages**, and **extract data** effortlessly.

---

## ✨ Features

- ✅ **Fetch Web Content** – Retrieve HTML from any URL with ease.
- ✅ **Parse and Extract Data** – Utilize integrated parsing tools to extract
  information.
- ✅ **Configurable Options** – Customize scraping behaviors using CSS selectors.
- ✅ **Headless Browser Support** – Optionally use Puppeteer for JavaScript-rendered
  pages.
- ✅ **Lightweight & Fast** – Uses Cheerio for static HTML scraping.
- ✅ **TypeScript Support** – Fully typed for robust development.
- ✅ **Data Export Support** – Export scraped data in JSON or CSV formats.
- ✅ **CSV Import Support** – Read CSV files and convert them to JSON.

---

## 📚 Installation

Install via npm:

```sh
npm install simple-web-scraper
```

or using Yarn:

```sh
yarn add simple-web-scraper
```

---

## 🚀 Why Use Cheerio and Puppeteer?

This package leverages **Cheerio** and **Puppeteer** for powerful web scraping
capabilities:

### 🔹 **Cheerio (Fast and Lightweight)**

- Ideal for **static HTML parsing** (like `jQuery` for the backend).
- Extremely **fast** and **lightweight** – perfect for pages **without JavaScript**
  rendering.
- Provides **easy CSS selector querying** for extracting structured data.

### 🔹 **Puppeteer (Headless Browser Automation)**

- **Handles JavaScript-rendered pages** – essential for scraping dynamic content.
- Can **interact with pages**, click buttons, and fill out forms.
- Allows **screenshot capturing**, **PDF generation**, and full-page automation.

### ✅ **Best of Both Worlds**

- Use **Cheerio** for **speed** when scraping static pages.
- Switch to **Puppeteer** for **JavaScript-heavy** sites requiring full rendering.
- Provides **flexibility** to choose the best approach for your project.

---

## ✅ **API Reference**

### **WebScraper Class**

```typescript
new WebScraper(options?: ScraperOptions)
```

## 📊 Props

| Parameter      | Type                     | Description                                                     |
| -------------- | ------------------------ | --------------------------------------------------------------- |
| `usePuppeteer` | `boolean` (optional)     | Whether to use Puppeteer (default: `true`)                      |
| `throttle`     | `number` (optional)      | Delay in milliseconds between requests (default: `1000`)        |
| `rules`        | `Record<string, string>` | [CSS selectors defining data extraction rules](#rule-set-table) |

---

## **Methods**

#### **`scrape(url: string): Promise<Record<string, any>>`**

- Scrapes the given URL based on the configured options.

#### **`exportToJSON(data: any, filePath: string): void`**

- Exports the given data to a JSON file.

#### **`exportToCSV(data: any | any[], filePath: string): void`**

- Exports the given data to a CSV file.

---

## 🛠️ Basic Usage

### **1. Scraping Web Pages**

You can scrape web pages using either Puppeteer (for JavaScript-heavy pages) or
Cheerio (for static HTML pages).

```typescript
import { WebScraper } from 'simple-web-scraper';

const scraper = new WebScraper({
  usePuppeteer: false, // Set to true for dynamic pages
  rules: {
    title: 'h1',
    description: 'meta[name=\"description\"]',
  },
});

(async () => {
  const data = await scraper.scrape('https://example.com');
  console.log(data);
})();
```

---

### **2. Using Puppeteer for JavaScript-heavy Pages**

To scrape pages that require JavaScript execution:

```typescript
const scraper = new WebScraper({
  usePuppeteer: true, // Enable Puppeteer for JavaScript-rendered content
  rules: {
    heading: 'h1',
    price: '.product-price',
  },
});

(async () => {
  const data = await scraper.scrape('https://example.com/product');
  console.log(data);
})();
```

---

### **3. Exporting Data**

- Scraped data can be exported to JSON or CSV files using utility functions.

#### **Export to JSON**

```typescript
import { exportToJSON } from 'simple-web-scraper';

const data = { name: 'Example', value: 42 };
exportToJSON(data, 'output.json');
```

#### **Export to CSV**

```typescript
import { exportToCSV } from 'simple-web-scraper';

const data = [
  { name: 'Example 1', value: 42 },
  { name: 'Example 2', value: 99 },
];
exportToCSV(data, 'output.csv');

// Preserve null and undefined values as null
exportToCSV(data, 'output.csv', { preserveNulls: true });
```

---

## 🖥 Backend Example - Module (import)

This example demonstrates how to use `simple-web-scraper` in a Node.js backend:

```typescript
import express from 'express';
import { WebScraper, exportToJSON, exportToCSV } from 'simple-web-scraper';

const app = express();
const scraper = new WebScraper({
  usePuppeteer: true,
  rules: { title: 'h1', content: 'p' },
});

app.get('/scrape-example', async (req, res) => {
  try {
    const url = 'https://github.com/The-Node-Forge';
    const data = await scraper.scrape(url);

    exportToJSON(data, 'output.json'); // export JSON
    exportToCSV(data, 'output.csv', { preserveNulls: true }); // export CSV

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## 🖥 Backend Example - CommonJS (require)

This example demonstrates how to use `simple-web-scraper` in a Node.js backend:

```typescript
const {
  WebScraper,
  exportToJSON,
  exportToCSV,
} = require('@the-node-forge/simple-web-scraper/dist');

const scraper = new WebScraper({
  usePuppeteer: true,
  rules: {
    fullHTML: 'html', // Entire page HTML
    title: 'head > title', // Page title
    description: 'meta[name="description"]', // Meta description
    keywords: 'meta[name="keywords"]', // Meta keywords
    favicon: 'link[rel="icon"]', // Favicon URL
    mainHeading: 'h1', // First H1 heading
    allHeadings: 'h1, h2, h3, h4, h5, h6', // All headings on the page
    firstParagraph: 'p', // First paragraph
    allParagraphs: 'p', // All paragraphs on the page
    links: 'a', // All links on the page
    images: 'img', // All image URLs
    imageAlts: 'img', // Alternative text for images
    videos: 'video, iframe[src*="youtube.com"], iframe[src*="vimeo.com"]', // Video sources
    tables: 'table', // Capture table elements
    tableData: 'td', // Capture table cells
    lists: 'ul, ol', // Capture all lists
    listItems: 'li', // Capture all list items
    scripts: 'script', // JavaScript file sources
    stylesheets: 'link[rel="stylesheet"]', // External CSS files
    structuredData: 'script[type="application/ld+json"]', // JSON-LD structured data
    socialLinks:
      'a[href*="facebook.com"], a[href*="twitter.com"], a[href*="linkedin.com"], a[href*="instagram.com"]', // Social media links
    author: 'meta[name="author"]', // Author meta tag
    publishDate: 'meta[property="article:published_time"], time', // Publish date
    modifiedDate: 'meta[property="article:modified_time"]', // Last modified date
    canonicalURL: 'link[rel="canonical"]', // Canonical URL
    openGraphTitle: 'meta[property="og:title"]', // OpenGraph title
    openGraphDescription: 'meta[property="og:description"]', // OpenGraph description
    openGraphImage: 'meta[property="og:image"]', // OpenGraph image
    twitterCard: 'meta[name="twitter:card"]', // Twitter card type
    twitterTitle: 'meta[name="twitter:title"]', // Twitter title
    twitterDescription: 'meta[name="twitter:description"]', // Twitter description
    twitterImage: 'meta[name="twitter:image"]', // Twitter image
  },
});

app.get('/test-scraper', async (req, res) => {
  try {
    const url = 'https://github.com/The-Node-Forge';
    const data = await scraper.scrape(url);

    exportToJSON(data, 'output.json'); // export JSON
    exportToCSV(data, 'output.csv'); // export CSV

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## 🛠️ Full Usage Example

```typescript
import { WebScraper } from 'simple-web-scraper';

const scraper = new WebScraper({
  usePuppeteer: true, // Set to false if scraping static pages
  rules: {
    fullHTML: 'html', // Entire page HTML
    title: 'head > title', // Page title
    description: 'meta[name="description"]', // Meta description
    keywords: 'meta[name="keywords"]', // Meta keywords
    favicon: 'link[rel="icon"]', // Favicon URL
    mainHeading: 'h1', // First H1 heading
    allHeadings: 'h1, h2, h3, h4, h5, h6', // All headings on the page
    firstParagraph: 'p', // First paragraph
    allParagraphs: 'p', // All paragraphs on the page
    links: 'a', // All links on the page
    images: 'img', // All image URLs
    imageAlts: 'img', // Alternative text for images
    videos: 'video, iframe[src*="youtube.com"], iframe[src*="vimeo.com"]', // Video sources
    tables: 'table', // Capture table elements
    tableData: 'td', // Capture table cells
    lists: 'ul, ol', // Capture all lists
    listItems: 'li', // Capture all list items
    scripts: 'script', // JavaScript file sources
    stylesheets: 'link[rel="stylesheet"]', // External CSS files
    structuredData: 'script[type="application/ld+json"]', // JSON-LD structured data
    socialLinks:
      'a[href*="facebook.com"], a[href*="twitter.com"], a[href*="linkedin.com"], a[href*="instagram.com"]', // Social media links
    author: 'meta[name="author"]', // Author meta tag
    publishDate: 'meta[property="article:published_time"], time', // Publish date
    modifiedDate: 'meta[property="article:modified_time"]', // Last modified date
    canonicalURL: 'link[rel="canonical"]', // Canonical URL
    openGraphTitle: 'meta[property="og:title"]', // OpenGraph title
    openGraphDescription: 'meta[property="og:description"]', // OpenGraph description
    openGraphImage: 'meta[property="og:image"]', // OpenGraph image
    twitterCard: 'meta[name="twitter:card"]', // Twitter card type
    twitterTitle: 'meta[name="twitter:title"]', // Twitter title
    twitterDescription: 'meta[name="twitter:description"]', // Twitter description
    twitterImage: 'meta[name="twitter:image"]', // Twitter image
  },
});

(async () => {
  const data = await scraper.scrape('https://example.com');
  console.log(data);
})();
```

---

## 📊 Rule Set Table

| Rule                 | CSS Selector                                                                                         | Target Data                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| fullHTML             | `html`                                                                                               | The entire HTML of the page                          |
| title                | `head > title`                                                                                       | The `<title>` of the page                            |
| description          | `meta[name="description"]`                                                                           | Meta description for SEO                             |
| keywords             | `meta[name="keywords"]`                                                                              | Meta keywords                                        |
| favicon              | `link[rel="icon"]`                                                                                   | Website icon                                         |
| mainHeading          | `h1`                                                                                                 | The first `<h1>` heading                             |
| allHeadings          | `h1, h2, h3, h4, h5, h6`                                                                             | All headings (`h1`-`h6`)                             |
| firstParagraph       | `p`                                                                                                  | The first paragraph (`<p>`)                          |
| allParagraphs        | `p`                                                                                                  | All paragraphs on the page                           |
| links                | `a`                                                                                                  | All anchor `<a>` links                               |
| images               | `img`                                                                                                | All image `<img>` sources                            |
| imageAlts            | `img`                                                                                                | All image alt texts                                  |
| videos               | `video, iframe[src*="youtube.com"], iframe[src*="vimeo.com"]`                                        | Video sources (`<video>`, YouTube, Vimeo)            |
| tables               | `table`                                                                                              | All `<table>` elements                               |
| tableData            | `td`                                                                                                 | Individual `<td>` elements                           |
| lists                | `ul, ol`                                                                                             | All ordered `<ol>` and unordered `<ul>` lists        |
| listItems            | `li`                                                                                                 | All list `<li>` items                                |
| scripts              | `script`                                                                                             | JavaScript files included (`<script src="...">`)     |
| stylesheets          | `link[rel="stylesheet"]`                                                                             | Stylesheets (`<link rel="stylesheet">`)              |
| structuredData       | `script[type="application/ld+json"]`                                                                 | JSON-LD structured data for SEO                      |
| socialLinks          | `a[href*="facebook.com"], a[href*="twitter.com"], a[href*="linkedin.com"], a[href*="instagram.com"]` | Facebook, Twitter, LinkedIn, Instagram links         |
| author               | `meta[name="author"]`                                                                                | Page author (`meta[name="author"]`)                  |
| publishDate          | `meta[property="article:published_time"], time`                                                      | Date article was published                           |
| modifiedDate         | `meta[property="article:modified_time"]`                                                             | Last modified date                                   |
| canonicalURL         | `link[rel="canonical"]`                                                                              | Canonical URL (avoids duplicate content)             |
| openGraphTitle       | `meta[property="og:title"]`                                                                          | OpenGraph metadata for social sharing                |
| openGraphDescription | `meta[property="og:description"]`                                                                    | OpenGraph description                                |
| openGraphImage       | `meta[property="og:image"]`                                                                          | OpenGraph image URL                                  |
| twitterCard          | `meta[name="twitter:card"]`                                                                          | Twitter card type (`summary`, `summary_large_image`) |
| twitterTitle         | `meta[name="twitter:title"]`                                                                         | Twitter title metadata                               |
| twitterDescription   | `meta[name="twitter:description"]`                                                                   | Twitter description metadata                         |
| twitterImage         | `meta[name="twitter:image"]`                                                                         | Twitter image metadata                               |

---

## 💡 **Contributing**

Contributions are welcome! Please submit
[issues](https://github.com/The-Node-Forge/simple-web-scraper/issues) or
[pull requests](https://github.com/The-Node-Forge/simple-web-scraper/pulls).

---
