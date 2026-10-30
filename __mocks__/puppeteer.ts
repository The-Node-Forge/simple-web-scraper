// puppeteer >=25 is ESM-only and Jest can't load (or automock) it. Jest picks up
// this root-level manual mock for every test automatically; tests configure
// behavior via `(puppeteer.launch as jest.Mock).mockResolvedValue(...)`.
export default { launch: jest.fn() };
