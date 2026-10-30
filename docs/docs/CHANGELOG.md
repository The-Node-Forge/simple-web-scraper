---
title: Changelog
description: A detailed changelog.
sidebar_position: 5
---

### v2.0.0 - 2026-10-30

**Breaking Changes:**

- Upgraded `puppeteer` from ^24 to ^25, which requires **Node.js >= 22.12**
  (`engines.node` raised from `>=18`). Puppeteer 25 is ESM-only; the CommonJS build
  loads it via `require(esm)`, which is available on Node 22.12+. Earlier releases of
  this package are unaffected and keep working on older Node versions.

**Security Updates:**

- `exportToCSV` now neutralizes CSV/formula injection: string cells and headers
  starting with `=`, `+`, `-`, `@`, tab or CR are prefixed with `'`. Opt out with
  `{ sanitizeFormulas: false }`.
- `scrape()` now rejects non-`http(s)` URLs (e.g. `file://`, `chrome://`), which
  Puppeteer would otherwise load and expose through the extraction rules.
- Added a `timeout` option (default 30s) for Puppeteer navigation and Axios requests,
  and a 10 MB response size cap for Cheerio mode.
- The Puppeteer browser is now always closed, even when navigation or extraction
  throws, preventing leaked Chromium processes.
- Clears the Puppeteer-related advisories (`zod`, `basic-ftp`, `proxy-agent` tree).
- Ran `npm audit fix` to pick up patched transitive dependencies (`undici`,
  `follow-redirects`, `ip-address`, `js-yaml`).

**Bug Fixes:**

- Fixed the ESM build:
  `import { WebScraper } from '@the-node-forge/simple-web-scraper'` previously failed
  because `dist/mjs` was emitted as CommonJS. `dist/mjs` is now real ESM, and
  `exports`/`types` point at the correct declaration files.
- `throttle: 0` is now respected; previously it was silently replaced by the 1000ms
  default.

**Documentation:**

- Added `SECURITY.md` describing private vulnerability reporting via GitHub.

### v1.1.3 - 2026-06-12

**Security Updates:**

- Updated axios from ^1.3.5 to ^1.17.0 to address 11 critical security
  vulnerabilities:
  - CVE-2025-62718: Prototype pollution gadgets in config.proxy enabling MITM attacks
  - Proxy-Authorization credential leaks across HTTP-to-HTTPS redirects
  - NO_PROXY protection bypass via RFC 1122 loopback subnet (127.0.0.0/8)
  - Credential theft and response hijacking via prototype pollution
  - Regular Expression Denial of Service (ReDoS) via cookie name injection
  - Unrestricted cloud metadata exfiltration via header injection chains
  - SSRF via hostname normalization bypass
  - Resource allocation issues without throttling

**Documentation Improvements:**

- Updated documentation across README.md, installation guides, usage examples, and
  API references

### v1.0.0 - 2025-03-06

- Initial release

<!-- ### v1.0.1 - YYYY-MM-DD

- Bug fix -->
