---
title: API Reference
description: API parameters, returns, examples.
sidebar_position: 4
---

## WebScraper Class

### `new WebScraper(options?: ScraperOptions)`

Creates a new instance of the `WebScraper` class.

**Parameters:**

- `options` (optional) - `ScraperOptions` - An object containing configuration
  options for the scraper.

  - `usePuppeteer` - `boolean` (optional) - Whether to use Puppeteer for
    JavaScript-rendered pages. Default: `true`.
  - `throttle` - `number` (optional) - Delay in milliseconds between requests.
    Default: `1000`.
  - `rules` - `Record<string, string>` - CSS selectors defining data extraction
    rules.

**Returns:**

- A new instance of `WebScraper`.

**Example:**

```typescript
import { WebScraper } from 'simple-web-scraper';

const scraper = new WebScraper({
  usePuppeteer: true,
  rules: { title: 'h1', content: 'p' },
});
```

---

## Methods

### `scrape(url: string): Promise<Record<string, any>>`

Scrapes the given URL based on the configured options.

**Parameters:**

- `url` - `string` - The webpage URL to scrape.

**Returns:**

- `Promise<Record<string, any>>` - The extracted data as an object.

**Example:**

```typescript
const data = await scraper.scrape('https://example.com');
console.log(data);
```

---

### `exportToJSON(data: any, filePath: string): void`

Exports the given data to a JSON file.

**Parameters:**

- `data` - `any` - The data to be exported.
- `filePath` - `string` - The path where the JSON file should be saved.

**Returns:**

- `void`

**Example:**

```typescript
import { exportToJSON } from 'simple-web-scraper';

const data = { name: 'Example', value: 42 };
exportToJSON(data, 'output.json');
```

---

### `exportToCSV(data: any | any[], filePath: string): void`

Exports the given data to a CSV file.

**Parameters:**

- `data` - `any | any[]` - The data to be exported.
- `filePath` - `string` - The path where the CSV file should be saved.

**Returns:**

- `void`

**Example:**

```typescript
import { exportToCSV } from 'simple-web-scraper';

const data = [
  { name: 'Example 1', value: 42 },
  { name: 'Example 2', value: 99 },
];
exportToCSV(data, 'output.csv');

// preserve nullish values
exportToCSV(data, 'output.csv', { preserveNulls: true });
```

---

## Backend Example

This example demonstrates how to use `simple-web-scraper` in a Node.js backend:

```typescript
import express from 'express';
import { WebScraper, exportToJSON, exportToCSV } from 'simple-web-scraper';

const app = express();
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

app.get('/scrape-example', async (req, res) => {
  try {
    const url = 'https://github.com/The-Node-Forge';
    const data = await scraper.scrape(url);

    exportToJSON(data, 'output.json'); // export JSON
    exportToCSV(data, 'output.csv'); // export CSV

    // preserve nullish values while exporting to csv
    exportToCSV(data, 'outputPreserveNulls.csv', { preserveNulls: true });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## Contributing

Contributions are welcome! Please submit issues or pull requests on GitHub.
