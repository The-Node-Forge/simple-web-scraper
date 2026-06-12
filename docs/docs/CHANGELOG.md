---
title: Changelog
description: A detailed changelog.
sidebar_position: 5
---

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

- Removed non-professional emojis from all documentation files for a more
  professional appearance
- Maintained checkmarks for feature lists and completed tasks
- Updated documentation across README.md, installation guides, usage examples, and
  API references

### v1.0.0 - 2025-03-06

- Initial release

<!-- ### v1.0.1 - YYYY-MM-DD

- Bug fix -->
