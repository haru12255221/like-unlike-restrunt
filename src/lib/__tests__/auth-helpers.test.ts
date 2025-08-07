/**
 * 認証ヘルパー関数のテスト
 * 要件: 1.1, 1.2, 1.3 - 認証ヘルパー関数のテスト
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { 
  isAuthenticated, 
  isSessionValid, 
  getUserInfo, 
  requiresAuth, 
  getRedirectUrl 
} from '../auth-helpers';

describe('認証ヘルパー関数のテスト', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      NEXTAUTH_URL: 'http://localhost:3000',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('isAuthenticated', () => {
    it('有効なセッションの場合はtrueを返す', () => {
      // 要件1.1: 認証状態の確認
      const validSession = {
        user: {
          id: 'test-user-id',
          name: 'テストユーザー',
          email: 'test@example.com',
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      expect(isAuthenticated(validSession)).toBe(true);
    });

    it('セッションがnullの場合はfalseを返す', () => {
      // 要件1.1: 未認証状態の確認
      expect(isAuthenticated(null)).toBe(false);
    });

    it('ユーザー情報がないセッションの場合はfalseを返す', () => {
      // 要件1.1: 不完全なセッションの確認
      const invalidSession = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      expect(isAuthenticated(invalidSession)).toBe(false);
    });

    it('ユーザーIDがないセッションの場合はfalseを返す', () => {
      // 要件1.1: 不完全なユーザー情報の確認
      const invalidSession = {
        user: {
          name: 'テストユーザー',
          email: 'test@example.com',
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      expect(isAuthenticated(invalidSession)).toBe(false);
    });
  });

  describe('isSessionValid', () => {
    it('有効期限内のセッションの場合はtrueを返す', () => {
      // 要件1.3: セッション有効期限の確認
      const validSession = {
        user: { id: 'test-user-id' },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24時間後
      };

      expect(isSessionValid(validSession)).toBe(true);
    });

    it('有効期限切れのセッションの場合はfalseを返す', () => {
      // 要件1.3: 期限切れセッションの確認
      const expiredSession = {
        user: { id: 'test-user-id' },
        expires: new Date(Date.now() - 1000).toISOString(), // 1秒前
      };

      expect(isSessionValid(expiredSession)).toBe(false);
    });

    it('expiresがないセッションの場合はfalseを返す', () => {
      // 要件1.3: 不完全なセッションの確認
      const invalidSession = {
        user: { id: 'test-user-id' },
      };

      expect(isSessionValid(invalidSession)).toBe(false);
    });

    it('セッションがnullの場合はfalseを返す', () => {
      // 要件1.3: nullセッションの確認
      expect(isSessionValid(null)).toBe(false);
    });
  });

  describe('getUserInfo', () => {
    it('有効なセッションからユーザー情報を取得する', () => {
      // 要件1.2: ユーザー情報の安全な取得
      const validSession = {
        user: {
          id: 'test-user-id',
          name: 'テストユーザー',
          email: 'test@example.com',
          image: 'https://example.com/avatar.jpg',
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      const userInfo = getUserInfo(validSession);
      
      expect(userInfo).toEqual({
        id: 'test-user-id',
        name: 'テストユーザー',
        email: 'test@example.com',
        image: 'https://example.com/avatar.jpg',
      });
    });

    it('無効なセッションの場合はnullを返す', () => {
      // 要件1.2: 無効なセッションの処理
      expect(getUserInfo(null)).toBeNull();
      
      const invalidSession = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
      expect(getUserInfo(invalidSession)).toBeNull();
    });
  });

  describe('requiresAuth', () => {
    it('認証が必要なページの場合はtrueを返す', () => {
      // 要件1.2: ページアクセス制御
      expect(requiresAuth('/')).toBe(true);
      expect(requiresAuth('/likes')).toBe(true);
      expect(requiresAuth('/shop/123')).toBe(true);
    });

    it('公開ページの場合はfalseを返す', () => {
      // 要件1.2: 公開ページの確認
      expect(requiresAuth('/login')).toBe(false);
      expect(requiresAuth('/auth/error')).toBe(false);
    });
  });

  describe('getRedirectUrl', () => {
    it('callbackUrlがない場合はデフォルトURLを返す', () => {
      // 要件1.2: デフォルトリダイレクト
      expect(getRedirectUrl()).toBe('/');
      expect(getRedirectUrl(undefined)).toBe('/');
    });

    it('相対URLの場合はそのまま返す', () => {
      // 要件1.2: 相対URLの処理
      expect(getRedirectUrl('/dashboard')).toBe('/dashboard');
      expect(getRedirectUrl('/likes')).toBe('/likes');
    });

    it('同じオリジンの絶対URLの場合はそのまま返す', () => {
      // 要件1.2: 同一オリジンURLの処理
      const sameOriginUrl = 'http://localhost:3000/profile';
      expect(getRedirectUrl(sameOriginUrl)).toBe(sameOriginUrl);
    });

    it('異なるオリジンの絶対URLの場合はデフォルトURLを返す', () => {
      // 要件1.2: セキュリティ - 外部URLの拒否
      const externalUrl = 'https://malicious-site.com/steal-data';
      expect(getRedirectUrl(externalUrl)).toBe('/');
    });

    it('無効なURLの場合はデフォルトURLを返す', () => {
      // 要件1.2: 無効URLの処理
      const invalidUrl = 'not-a-valid-url';
      expect(getRedirectUrl(invalidUrl)).toBe('/');
    });

    it('環境変数のベースURLを正しく使用する', () => {
      // 要件1.2: 環境設定の使用
      process.env.NEXTAUTH_URL = 'https://example.com';
      
      const sameOriginUrl = 'https://example.com/dashboard';
      expect(getRedirectUrl(sameOriginUrl)).toBe(sameOriginUrl);
      
      const differentOriginUrl = 'https://other-site.com/page';
      expect(getRedirectUrl(differentOriginUrl)).toBe('/');
    });
  });
});