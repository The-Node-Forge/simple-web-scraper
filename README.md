<div align="center">

# Simple Web Scraper

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Made with TypeScript](https://img.shields.io/badge/Made%20with-TypeScript-007acc)

[![NPM Version](https://img.shields.io/npm/v/simple-web-scraper)](https://www.npmjs.com/package/simple-web-scraper)
![Platform](https://img.shields.io/badge/platform-node.js%20%7C%20browser-brightgreen)

[Live Documentation](https://The-Node-Forge.github.io/simple-web-scraper/)

</div>

A **lightweight and efficient web scraping package** for JavaScript/TypeScript
applications.  
This package helps developers **fetch HTML content**, **parse web pages**, and
**extract data** effortlessly.

---

## ✨ Features

- ✅ **Fetch Web Content** – Retrieve HTML from any URL with ease.
- ✅ **Parse and Extract Data** – Utilize integrated parsing tools to extract
  information.
- ✅ **Configurable Options** – Customize HTTP requests and parsing behaviors.
- ✅ **Headless Browser Support** – Optionally use headless browsers like Puppeteer
  for dynamic pages.
- ✅ **Lightweight & Fast** – Minimal dependencies ensure quick performance.
- ✅ **TypeScript Support** – Fully typed for robust development.
- ✅ **Unit Tested** – Built with reliable testing frameworks to ensure stability.

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

## 🛠️ Basic Usage

### **1⃣ Fetching HTML Content**

Retrieve the raw HTML of a webpage with a simple function call:

```typescript
import { scrape } from 'simple-web-scraper';

(async () => {
  try {
    const html = await scrape('https://example.com');
    console.log(html);
  } catch (error) {
    console.error('Scraping failed:', error);
  }
})();
```

---

### **2⃣ Extracting Data from a Page**

You can further parse the fetched HTML to extract specific data. For example, using
Cheerio:

```typescript
import { scrape } from 'simple-web-scraper';
import cheerio from 'cheerio';

(async () => {
  const html = await scrape('https://example.com');
  const $ = cheerio.load(html);

  // Extract all headings
  const headings = $('h1, h2, h3')
    .map((_, el) => $(el).text())
    .get();
  console.log('Headings:', headings);
})();
```

---

## ✅ **API Reference**

### **scrape Function**

```typescript
scrape(url: string, options?: ScrapeOptions): Promise<string>;
```

| Parameter | Type                       | Description                                                                     |
| --------- | -------------------------- | ------------------------------------------------------------------------------- |
| `url`     | `string`                   | The URL to scrape.                                                              |
| `options` | `ScrapeOptions` (optional) | Configuration options such as headers, timeouts, and headless browser settings. |

**Returns:**  
`Promise<string>` – Resolves to the HTML content of the page.

> **Note:** Refer to the documentation for additional options and advanced
> configurations.

---

## 💡 **Contributing**

Contributions are welcome! Please submit  
[issues](https://github.com/The-Node-Forge/simple-web-scraper/issues) or  
[pull requests](https://github.com/The-Node-Forge/simple-web-scraper/pulls).

---

### ⭐ Support

If you find this package useful, please **give it a ⭐ on**  
[GitHub](https://github.com/The-Node-Forge/simple-web-scraper 'GitHub Repository').

---

### 🔗 **Links**

- 📚 [NPM Package](https://www.npmjs.com/package/simple-web-scraper)
- 🏗 [The Node Forge](https://github.com/The-Node-Forge)

```

```
