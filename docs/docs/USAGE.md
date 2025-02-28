---
title: Usage
description: Basic examples and configuration for Simple Web Scraper.
sidebar_position: 3
---

## 📌 Basic Example

You can use `simple-web-scraper` with either ES Modules or CommonJS.

### **Using ES Modules (Recommended)**

```typescript
import { WebScraper } from 'simple-web-scraper';

const scraper = new WebScraper({
  usePuppeteer: true,
  rules: { title: 'h1', content: 'p' },
});

(async () => {
  const data = await scraper.scrape('https://example.com');
  console.log(data);
})();
```

### **Using CommonJS (Node.js Default)**

```javascript
const { WebScraper } = require('simple-web-scraper');

const scraper = new WebScraper({
  usePuppeteer: true,
  rules: { title: 'h1', content: 'p' },
});

(async () => {
  const data = await scraper.scrape('https://example.com');
  console.log(data);
})();
```

## ⚙️ Configuration Options

You can customize the scraper's behavior using the following options:

```json
{
  "usePuppeteer": true,
  "throttle": 1000,
  "rules": {
    "title": "h1",
    "content": "p"
  }
}
```

### **Option Details**

| Option         | Type                     | Description                                                          |
| -------------- | ------------------------ | -------------------------------------------------------------------- |
| `usePuppeteer` | `boolean` (optional)     | Whether to use Puppeteer for JavaScript-heavy pages. Default: `true` |
| `throttle`     | `number` (optional)      | Delay in milliseconds between requests. Default: `1000`              |
| `rules`        | `Record<string, string>` | CSS selectors defining the data to extract                           |

## 📖 More Details

For full API details, see [API_REFERENCE.md](API_REFERENCE.md).
