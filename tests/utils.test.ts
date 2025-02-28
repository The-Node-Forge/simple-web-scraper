import * as fs from 'fs';
import csvParser from 'csv-parser';

import { exportToJSON, exportToCSV, readCSV } from '../src/utils';

jest.mock('fs');

jest.mock('csv-parser', () =>
  jest.fn(() => ({
    pipe: jest.fn().mockReturnThis(),
    on: jest.fn(function (
      this: any,
      event: string,
      callback: (...args: any[]) => void,
    ) {
      if (event === 'data') {
        callback({ name: 'Alice', age: '30' });
        callback({ name: 'Bob', age: '25' });
      }
      if (event === 'end') callback();
      return this;
    }),
  })),
);

describe('Utils functions', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('exportToJSON', () => {
    it('should write JSON data to a file and log a message', () => {
      const data = { a: 1, b: 2 };
      const filePath = 'output.json';
      exportToJSON(data, filePath);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        filePath,
        JSON.stringify(data, null, 2),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `Data exported to JSON file at: ${filePath}`,
      );
    });
  });

  describe('exportToCSV', () => {
    it('should write CSV data to a file for a single object', () => {
      const data = { name: 'Alice', age: 30 };
      const filePath = 'output.csv';
      exportToCSV(data, filePath);

      const expectedCSV = `name,age\nAlice,30`;
      expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, expectedCSV, 'utf-8');
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `Data exported to CSV file at: ${filePath}`,
      );
    });

    it('should write CSV data to a file for an array of objects', () => {
      const data = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
      ];
      const filePath = 'output.csv';
      exportToCSV(data, filePath);

      const expectedCSV = `name,age\nAlice,30\nBob,25`;
      expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, expectedCSV, 'utf-8');
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `Data exported to CSV file at: ${filePath}`,
      );
    });

    it('should log a message and not write file when data array is empty', () => {
      const data: any[] = [];
      const filePath = 'empty.csv';
      exportToCSV(data, filePath);

      expect(fs.writeFileSync).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('No data to export');
    });

    it('should properly escape values containing commas and double quotes', () => {
      const data = { name: 'Alice, "The Great"', age: 30 };
      const filePath = 'output.csv';
      exportToCSV(data, filePath);

      const expectedCSV = `name,age\n"Alice, ""The Great""",30`;
      expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, expectedCSV, 'utf-8');
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `Data exported to CSV file at: ${filePath}`,
      );
    });
  });

  describe('readCSV', () => {
    it('should correctly parse a valid CSV file into JSON', async () => {
      const filePath = 'test.csv';

      jest.spyOn(fs, 'createReadStream').mockImplementation(
        () =>
          ({
            pipe: jest.fn().mockReturnThis(),
            on: jest.fn().mockImplementation(function (
              this: any,
              event: string,
              callback: (...args: any[]) => void,
            ) {
              if (event === 'data') {
                callback({ name: 'Alice', age: '30' });
                callback({ name: 'Bob', age: '25' });
              }
              if (event === 'end') callback();
              return this;
            }),
          }) as unknown as fs.ReadStream,
      );

      const result = await readCSV(filePath);
      expect(result).toEqual([
        { name: 'Alice', age: '30' },
        { name: 'Bob', age: '25' },
      ]);

      expect(csvParser).toHaveBeenCalled();
    });

    it('should handle empty values and ensure they are converted to empty strings', async () => {
      const filePath = 'test.csv';

      jest.spyOn(fs, 'createReadStream').mockImplementation(
        () =>
          ({
            pipe: jest.fn().mockReturnThis(),
            on: jest.fn().mockImplementation(function (
              this: any,
              event: string,
              callback: (...args: any[]) => void,
            ) {
              if (event === 'data') {
                callback({ name: 'Alice', age: '30' });
                callback({ name: 'Bob', age: '' });
              }
              if (event === 'end') callback();
              return this;
            }),
          }) as unknown as fs.ReadStream,
      );

      const result = await readCSV(filePath);
      expect(result).toEqual([
        { name: 'Alice', age: '30' },
        { name: 'Bob', age: '' },
      ]);

      expect(csvParser).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const filePath = 'test.csv';
      jest.spyOn(fs, 'createReadStream').mockImplementation(
        () =>
          ({
            pipe: jest.fn().mockReturnThis(),
            on: jest.fn().mockImplementation(function (
              this: any,
              event: string,
              callback: (...args: any[]) => void,
            ) {
              if (event === 'error') callback(new Error('CSV Parsing Error'));
              return this;
            }),
          }) as unknown as fs.ReadStream,
      );

      await expect(readCSV(filePath)).rejects.toThrow('CSV Parsing Error');

      expect(csvParser).toHaveBeenCalled();
    });
  });
});
