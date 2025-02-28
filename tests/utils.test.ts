import * as fs from 'fs';

import { exportToJSON, exportToCSV } from '../src/utils';

jest.mock('fs');

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
});
