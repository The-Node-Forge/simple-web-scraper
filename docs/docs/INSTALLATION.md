---
title: Installation
description: How to install and set up Simple Web Scraper.
sidebar_position: 2
---

## 📌 Prerequisites

Before installing, ensure you have the following:

- **Node.js** (Version `16.x` or higher recommended)
- **npm** (included with Node.js) or **Yarn**

## 📥 Installation

You can install `simple-web-scraper` using npm or Yarn:

### **Using npm**

```sh
npm install simple-web-scraper
```

### **Using Yarn**

```sh
yarn add simple-web-scraper
```

## 📦 Importing the Package

After installation, you can import it into your project:

### **For ES Modules (Recommended)**

```typescript
import { WebScraper, exportToJSON, exportToCSV } from 'simple-web-scraper';
```

### **For CommonJS (Node.js Default)**

```javascript
const { WebScraper, exportToJSON, exportToCSV } = require('simple-web-scraper');
```

## 🚀 Next Steps

After installation, check out the [Usage Guide](USAGE.md) for how to integrate
`simple-web-scraper` into your project.
