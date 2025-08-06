import { 
  getAllShops, 
  getShopById, 
  getShopsFromJSON, 
  shuffleShops, 
  getDefaultImageUrl, 
  validateImageUrl 
} from '../shopData';
import { Shop } from '@/types/shop';

// モックデータ
const mockShops: Shop[] = [
  {
    id: 'test-001',
    name: 'テストカフェ',
    address: '東京都テスト区1-1-1',
    genre: 'カフェ',
    imageUrl: '/images/shops/test-cafe.jpg',
    story: 'テスト用のカフェです。'
  },
  {
    id: 'test-002',
    name: 'テスト蕎麦屋',
    address: '東京都テスト区2-2-2',
    genre: '蕎麦屋',
    imageUrl: '/images/shops/test-soba.jpg',
    story: 'テスト用の蕎麦屋です。'
  }
];

// fetchのモック
global.fetch = jest.fn();

describe('shopData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllShops', () => {
    it('should fetch all shops successfully', async () => {
      // fetchのモック設定
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockShops,
      });

      const result = await getAllShops();

      expect(fetch).toHaveBeenCalledWith('/api/shops');
      expect(result).toEqual(mockShops);
    });

    it('should throw error when fetch fails', async () => {
      // fetchのモック設定（エラー）
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(getAllShops()).rejects.toThrow('Failed to fetch shop data');
    });

    it('should throw error when network error occurs', async () => {
      // fetchのモック設定（ネットワークエラー）
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(getAllShops()).rejects.toThrow('Failed to fetch shop data');
    });
  });

  describe('getShopById', () => {
    it('should return shop when found', async () => {
      // getAllShopsのモック
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockShops,
      });

      const result = await getShopById('test-001');

      expect(result).toEqual(mockShops[0]);
    });

    it('should throw error when shop not found', async () => {
      // getAllShopsのモック
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockShops,
      });

      await expect(getShopById('non-existent')).rejects.toThrow('Shop with id non-existent not found');
    });
  });

  describe('getShopsFromJSON', () => {
    it('should fetch shops from JSON successfully', async () => {
      // fetchのモック設定
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockShops,
      });

      const result = await getShopsFromJSON();

      expect(fetch).toHaveBeenCalledWith('/data/shops.json');
      expect(result).toEqual(mockShops);
    });

    it('should filter out invalid shop data', async () => {
      const invalidShops = [
        ...mockShops,
        {
          id: '',
          name: 'Invalid Shop',
          address: '',
          genre: 'カフェ',
          imageUrl: '/test.jpg',
          story: 'Invalid'
        }
      ];

      // fetchのモック設定
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => invalidShops,
      });

      const result = await getShopsFromJSON();

      expect(result).toEqual(mockShops);
      expect(result).toHaveLength(2);
    });

    it('should throw error when JSON fetch fails', async () => {
      // fetchのモック設定（エラー）
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(getShopsFromJSON()).rejects.toThrow('Failed to parse shop data');
    });
  });

  describe('shuffleShops', () => {
    it('should return shuffled array with same length', () => {
      const result = shuffleShops(mockShops);

      expect(result).toHaveLength(mockShops.length);
      expect(result).toEqual(expect.arrayContaining(mockShops));
    });

    it('should not modify original array', () => {
      const original = [...mockShops];
      shuffleShops(mockShops);

      expect(mockShops).toEqual(original);
    });

    it('should handle empty array', () => {
      const result = shuffleShops([]);

      expect(result).toEqual([]);
    });
  });

  describe('getDefaultImageUrl', () => {
    it('should return default image URL', () => {
      const result = getDefaultImageUrl();

      expect(result).toBe('/images/shops/default-shop.jpg');
    });
  });

  describe('validateImageUrl', () => {
    it('should return original URL when valid', () => {
      const validUrl = '/images/shops/test.jpg';
      const result = validateImageUrl(validUrl);

      expect(result).toBe(validUrl);
    });

    it('should return default URL when empty string', () => {
      const result = validateImageUrl('');

      expect(result).toBe('/images/shops/default-shop.jpg');
    });

    it('should return default URL when whitespace only', () => {
      const result = validateImageUrl('   ');

      expect(result).toBe('/images/shops/default-shop.jpg');
    });

    it('should return default URL when null or undefined', () => {
      const result1 = validateImageUrl(null as any);
      const result2 = validateImageUrl(undefined as any);

      expect(result1).toBe('/images/shops/default-shop.jpg');
      expect(result2).toBe('/images/shops/default-shop.jpg');
    });
  });
});