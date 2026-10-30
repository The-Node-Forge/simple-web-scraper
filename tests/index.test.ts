import DefaultExport, * as api from '../src/index';
import { WebScraper } from '../src/scraper';
import { exportToJSON, exportToCSV } from '../src/utils';

describe('public API surface', () => {
  it('exports the documented members', () => {
    expect(Object.keys(api).sort()).toEqual(
      ['WebScraper', 'default', 'exportToCSV', 'exportToJSON'].sort(),
    );
    expect(api.WebScraper).toBe(WebScraper);
    expect(api.exportToJSON).toBe(exportToJSON);
    expect(api.exportToCSV).toBe(exportToCSV);
  });

  it('default export is WebScraper', () => {
    expect(DefaultExport).toBe(WebScraper);
  });
});
