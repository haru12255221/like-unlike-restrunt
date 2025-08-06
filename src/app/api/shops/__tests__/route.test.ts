/**
 * @jest-environment node
 */
import { GET } from '../route';
import fs from 'fs';
import path from 'path';

// fsモジュールのモック
jest.mock('fs');
jest.mock('path');

const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;

describe('/api/shops', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return shop data successfully', async () => {
      const mockShopData = [
        {
          id: 'test-001',
          name: 'テストカフェ',
          address: '東京都テスト区1-1-1',
          genre: 'カフェ',
          imageUrl: '/images/shops/test-cafe.jpg',
          story: 'テスト用のカフェです。'
        }
      ];

      // モックの設定
      mockPath.join.mockReturnValue('/mock/path/data/shops.json');
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockShopData));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockShopData);
      expect(mockPath.join).toHaveBeenCalledWith(process.cwd(), 'data', 'shops.json');
      expect(mockFs.existsSync).toHaveBeenCalledWith('/mock/path/data/shops.json');
      expect(mockFs.readFileSync).toHaveBeenCalledWith('/mock/path/data/shops.json', 'utf8');
    });

    it('should return 404 when file does not exist', async () => {
      // モックの設定
      mockPath.join.mockReturnValue('/mock/path/data/shops.json');
      mockFs.existsSync.mockReturnValue(false);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Shop data file not found' });
    });

    it('should return 500 when file read fails', async () => {
      // モックの設定
      mockPath.join.mockReturnValue('/mock/path/data/shops.json');
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File read error');
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to load shop data' });
    });

    it('should filter out invalid shop data', async () => {
      const mockShopDataWithInvalid = [
        {
          id: 'test-001',
          name: 'テストカフェ',
          address: '東京都テスト区1-1-1',
          genre: 'カフェ',
          imageUrl: '/images/shops/test-cafe.jpg',
          story: 'テスト用のカフェです。'
        },
        {
          id: '',
          name: 'Invalid Shop',
          address: '',
          genre: 'カフェ',
          imageUrl: '/test.jpg',
          story: 'Invalid'
        }
      ];

      const expectedValidData = [mockShopDataWithInvalid[0]];

      // モックの設定
      mockPath.join.mockReturnValue('/mock/path/data/shops.json');
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockShopDataWithInvalid));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(expectedValidData);
      expect(data).toHaveLength(1);
    });

    it('should return 500 when JSON parsing fails', async () => {
      // モックの設定
      mockPath.join.mockReturnValue('/mock/path/data/shops.json');
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue('invalid json');

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to load shop data' });
    });
  });
});