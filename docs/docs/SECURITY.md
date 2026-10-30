---
title: Security Policy
description: How to privately report a vulnerability.
sidebar_position: 7
---

## Supported Versions

Security fixes are applied to the latest released version of
`@the-node-forge/simple-web-scraper`.

## Reporting a Vulnerability

Please **do not open a public issue** for security problems. Report them privately
through GitHub:

1. Go to the
   [Security tab](https://github.com/The-Node-Forge/simple-web-scraper/security) of
   this repository.
2. Choose **Report a vulnerability**.
3. Include affected versions, a description of the impact, and steps to reproduce (a
   minimal proof of concept helps).

You can expect an acknowledgement within a few days. Once a fix is released, the
advisory will be published and you will be credited unless you prefer otherwise.

## Scope notes

This library fetches and parses untrusted web content. Things worth knowing:

- Only `http:` and `https:` URLs are scraped.
- It does not filter private or internal IP ranges. If you scrape user-supplied URLs,
  validate the host yourself to avoid SSRF.
- `exportToCSV` neutralizes spreadsheet formula injection by default
  (`sanitizeFormulas`).
