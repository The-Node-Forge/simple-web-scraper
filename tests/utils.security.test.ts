import * as fs from 'fs';

import { exportToCSV } from '../src/utils';

jest.mock('fs');

describe('exportToCSV formula injection', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const written = (): string => (fs.writeFileSync as jest.Mock).mock.calls[0][1];

  it.each(['=1+1', '+1', '-1+2', '@SUM(A1)', '\tcmd', '\rcmd'])(
    'prefixes a quote on string value %j',
    (value) => {
      exportToCSV({ a: value }, 'out.csv');

      expect(written()).toBe(`"a"\n"'${value}"`);
    },
  );

  it('neutralizes dangerous payloads that also contain quotes', () => {
    exportToCSV({ a: '=HYPERLINK("http://evil","click")' }, 'out.csv');

    expect(written()).toBe(`"a"\n"'=HYPERLINK(""http://evil"",""click"")"`);
  });

  it('neutralizes formula-like headers', () => {
    exportToCSV({ '=cmd': 'x' }, 'out.csv');

    expect(written()).toBe(`"'=cmd"\n"x"`);
  });

  it('does not alter numeric values or safe strings', () => {
    exportToCSV({ n: -5, s: 'hello-world', b: true }, 'out.csv');

    expect(written()).toBe(`"n","s","b"\n"-5","hello-world","true"`);
  });

  it('can be disabled with sanitizeFormulas: false', () => {
    exportToCSV({ a: '=1+1' }, 'out.csv', { sanitizeFormulas: false });

    expect(written()).toBe(`"a"\n"=1+1"`);
  });
});
