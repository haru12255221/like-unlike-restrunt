/**
 * Integration tests for shop data functionality
 * Tests the complete flow from API to client-side functions
 */

import { getAllShops, getShopById, shuffleShops } from '../shopData';
import { Shop } from '@/types/shop';

// Mock fetch for integration tests
global.fetch = jest.fn();

describe('Shop Data Integration Tests', () => {
  const mockShops: Shop[] = [
    {
      id: 'integration-001',
      name: '統合テストカフェ',
      address: '東京都テスト区1-1-1',
      genre: 'カフェ',
      imageUrl: '/images/shops/integration-cafe.jpg',
      story: '統合テスト用のカフェです。'
    },
    {
      id: 'integration-002',
      name: '統合テスト蕎麦屋',
      address: '東京都テスト区2-2-2',
      genre: '蕎麦屋',
      imageUrl: '/images/shops/integration-soba.jpg',
      story: '統合テスト用の蕎麦屋です。'
    },
    {
      id: 'integration-003',
      name: '統合テスト雑貨店',
      address: '東京都テスト区3-3-3',
      genre: '雑貨店',
      imageUrl: '/images/shops/integration-zakka.jpg',
      story: '統合テスト用の雑貨店です。'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // デフォルトのfetchモック設定
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockShops,
    });
  });

  describe('Complete shop data flow', () => {
    it('should fetch all shops and allow individual shop retrieval', async () => {
      // 1. 全店舗データを取得
      const allShops = await getAllShops();
      
      expect(allShops).toHaveLength(3);
      expect(allShops[0]).toEqual(mockShops[0]);
      
      // 2. 特定の店舗を取得
      const specificShop = await getShopById('integration-001');
      
      expect(specificShop).toEqual(mockShops[0]);
      expect(specificShop?.name).toBe('統合テストカフェ');
    });

    it('should handle shop data shuffling correctly', async () => {
      // 1. 店舗データを取得
      const shops = await getAllShops();
      
      // 2. シャッフル機能をテスト
      const shuffled1 = shuffleShops(shops);
      const shuffled2 = shuffleShops(shops);
      
      // 長さは同じ
      expect(shuffled1).toHaveLength(shops.length);
      expect(shuffled2).toHaveLength(shops.length);
      
      // 全ての要素が含まれている
      expect(shuffled1).toEqual(expect.arrayContaining(shops));
      expect(shuffled2).toEqual(expect.arrayContaining(shops));
      
      // 元の配列は変更されていない
      expect(shops).toEqual(mockShops);
    });

    it('should handle error scenarios gracefully', async () => {
      // APIエラーのシミュレーション
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(getAllShops()).rejects.toThrow('Failed to fetch shop data');
      
      // 存在しない店舗IDでのテスト
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockShops,
      });

      await expect(getShopById('non-existent-id')).rejects.toThrow('Shop with id non-existent-id not found');
    });

    it('should validate shop data structure', async () => {
      const shops = await getAllShops();
      
      shops.forEach(shop => {
        // 必須フィールドの存在確認
        expect(shop.id).toBeDefined();
        expect(shop.name).toBeDefined();
        expect(shop.address).toBeDefined();
        expect(shop.genre).toBeDefined();
        expect(shop.imageUrl).toBeDefined();
        expect(shop.story).toBeDefined();
        
        // データ型の確認
        expect(typeof shop.id).toBe('string');
        expect(typeof shop.name).toBe('string');
        expect(typeof shop.address).toBe('string');
        expect(typeof shop.genre).toBe('string');
        expect(typeof shop.imageUrl).toBe('string');
        expect(typeof shop.story).toBe('string');
        
        // 空文字列でないことの確認
        expect(shop.id.trim()).not.toBe('');
        expect(shop.name.trim()).not.toBe('');
        expect(shop.address.trim()).not.toBe('');
        expect(shop.genre.trim()).not.toBe('');
        expect(shop.imageUrl.trim()).not.toBe('');
        expect(shop.story.trim()).not.toBe('');
      });
    });

    it('should handle multiple concurrent requests', async () => {
      // 複数の同時リクエストをシミュレート
      const promises = [
        getAllShops(),
        getShopById('integration-001'),
        getShopById('integration-002'),
        getAllShops()
      ];

      const results = await Promise.all(promises);
      
      // 全てのリクエストが成功
      expect(results[0]).toHaveLength(3); // getAllShops
      expect(results[1]?.id).toBe('integration-001'); // getShopById
      expect(results[2]?.id).toBe('integration-002'); // getShopById
      expect(results[3]).toHaveLength(3); // getAllShops
      
      // fetchが適切な回数呼ばれている（各リクエストで1回ずつ）
      expect(fetch).toHaveBeenCalledTimes(4);
    });
  });

  describe('Requirements validation', () => {
    it('should satisfy requirement 3.1: Display shop image, name, and story', async () => {
      const shops = await getAllShops();
      
      shops.forEach(shop => {
        // 要件3.1: 店舗画像、店名、一言ストーリーの表示
        expect(shop.imageUrl).toBeDefined();
        expect(shop.name).toBeDefined();
        expect(shop.story).toBeDefined();
        
        // 画像URLの形式確認
        expect(shop.imageUrl).toMatch(/^\/images\/shops\/.+\.(jpg|jpeg|png|webp)$/);
      });
    });

    it('should satisfy requirement 3.2: Display detailed shop information', async () => {
      const shop = await getShopById('integration-001');
      
      // 要件3.2: 店舗画像、店名、ジャンル、住所、一言ストーリーの表示
      expect(shop?.imageUrl).toBeDefined();
      expect(shop?.name).toBeDefined();
      expect(shop?.genre).toBeDefined();
      expect(shop?.address).toBeDefined();
      expect(shop?.story).toBeDefined();
    });

    it('should satisfy requirement 5.1: Store shop data with required fields', async () => {
      const shops = await getAllShops();
      
      shops.forEach(shop => {
        // 要件5.1: 店名、住所、ジャンル、画像URL、一言ストーリーの保存
        expect(shop.name).toBeDefined();
        expect(shop.address).toBeDefined();
        expect(shop.genre).toBeDefined();
        expect(shop.imageUrl).toBeDefined();
        expect(shop.story).toBeDefined();
        
        // 日本語の店舗情報が含まれていることの確認
        expect(shop.name).toMatch(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/); // ひらがな、カタカナ、漢字
        expect(shop.address).toMatch(/東京都/); // 住所に東京都が含まれている
      });
    });
  });
});