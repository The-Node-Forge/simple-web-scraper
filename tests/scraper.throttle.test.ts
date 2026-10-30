import axios from 'axios';

import { WebScraper } from '../src/scraper';

jest.mock('axios');

describe('throttle option', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('honors throttle: 0 instead of falling back to the 1000ms default', async () => {
    jest.useFakeTimers();
    (axios.get as jest.Mock).mockResolvedValue({ data: '<h1>x</h1>' });
    const scraper = new WebScraper({ usePuppeteer: false, throttle: 0 });

    const promise = scraper.scrape('https://example.com');
    await jest.advanceTimersByTimeAsync(0);
    await promise;

    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it('defaults to 1000ms when throttle is omitted', async () => {
    jest.useFakeTimers();
    (axios.get as jest.Mock).mockResolvedValue({ data: '<h1>x</h1>' });
    const scraper = new WebScraper({ usePuppeteer: false });

    const promise = scraper.scrape('https://example.com');
    await jest.advanceTimersByTimeAsync(999);
    expect(axios.get).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(1);
    await promise;
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});
