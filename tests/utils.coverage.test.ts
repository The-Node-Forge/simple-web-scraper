import * as fs from 'fs';

import { exportToJSON, exportToCSV } from '../src/utils';

jest.mock('fs');

describe('utils coverage gaps', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const csv = (): string => (fs.writeFileSync as jest.Mock).mock.calls[0][1];

  it('exportToJSON propagates write errors and does not log success', () => {
    (fs.writeFileSync as jest.Mock).mockImplementationOnce(() => {
      throw new Error('EACCES');
    });

    expect(() => exportToJSON({ a: 1 }, '/nope.json')).toThrow('EACCES');
    expect(console.log).not.toHaveBeenCalled();
  });

  it('exportToJSON serializes arrays and nested data', () => {
    exportToJSON([{ a: { b: [1, 2] } }], 'o.json');

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'o.json',
      JSON.stringify([{ a: { b: [1, 2] } }], null, 2),
    );
  });

  it('exportToCSV propagates write errors and does not log success', () => {
    (fs.writeFileSync as jest.Mock).mockImplementationOnce(() => {
      throw new Error('ENOSPC');
    });

    expect(() => exportToCSV({ a: 1 }, 'o.csv')).toThrow('ENOSPC');
    expect(console.log).not.toHaveBeenCalled();
  });

  it('uses the first row for headers; missing keys become empty cells', () => {
    exportToCSV([{ a: 1, b: 2 }, { a: 3 }, { b: 9, c: 'ignored' }], 'o.csv');

    expect(csv()).toBe(`"a","b"\n"1","2"\n"3",""\n"","9"`);
  });

  it('keeps embedded newlines and commas inside quoted cells', () => {
    exportToCSV({ a: 'line1\nline2, still one cell' }, 'o.csv');

    expect(csv()).toBe(`"a"\n"line1\nline2, still one cell"`);
  });

  it('stringifies numbers, booleans and falsy values without dropping them', () => {
    exportToCSV({ n: 0, f: false, e: '' }, 'o.csv');

    expect(csv()).toBe(`"n","f","e"\n"0","false",""`);
  });

  it('JSON.stringify-style objects become [object Object] (documents current behavior)', () => {
    exportToCSV({ o: { x: 1 } }, 'o.csv');

    expect(csv()).toBe(`"o"\n"[object Object]"`);
  });
});
