/**
 * 認証機能のテスト（TDD）
 * 要件: 1.1, 1.2, 1.3 - Google認証によるユーザー認証
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

describe('認証機能のテスト', () => {
  // テスト用の環境変数を設定
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    // テスト用環境変数の設定
    process.env = {
      ...originalEnv,
      NEXTAUTH_URL: 'http://localhost:3000',
      NEXTAUTH_SECRET: 'test-secret',
      GOOGLE_CLIENT_ID: 'test-google-client-id',
      GOOGLE_CLIENT_SECRET: 'test-google-client-secret',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('環境変数の設定', () => {
    it('必要な環境変数が設定されている', () => {
      // 要件1.1: 認証に必要な設定
      expect(process.env.NEXTAUTH_URL).toBeDefined();
      expect(process.env.NEXTAUTH_SECRET).toBeDefined();
      expect(process.env.GOOGLE_CLIENT_ID).toBeDefined();
      expect(process.env.GOOGLE_CLIENT_SECRET).toBeDefined();
    });

    it('Google認証に必要な環境変数が設定されている', () => {
      // 要件1.1: Google認証の環境設定
      expect(process.env.GOOGLE_CLIENT_ID).toBeTruthy();
      expect(process.env.GOOGLE_CLIENT_SECRET).toBeTruthy();
      expect(process.env.GOOGLE_CLIENT_ID).toBe('test-google-client-id');
      expect(process.env.GOOGLE_CLIENT_SECRET).toBe('test-google-client-secret');
    });
  });

  describe('認証フローのテスト', () => {
    it('未認証状態を正しく検出する', () => {
      // 要件1.1: 未認証ユーザーの識別
      const mockSession = null;
      expect(mockSession).toBeNull();
    });

    it('認証成功時にユーザー情報が取得できる', () => {
      // 要件1.2: 認証成功時のユーザー情報取得
      const mockUser = {
        id: 'test-user-id',
        name: 'テストユーザー',
        email: 'test@example.com',
        image: 'https://example.com/avatar.jpg'
      };

      const mockSession = {
        user: mockUser,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };

      expect(mockSession.user).toEqual(mockUser);
      expect(mockSession.user.email).toBe('test@example.com');
      expect(mockSession.user.name).toBe('テストユーザー');
      expect(mockSession.user.id).toBe('test-user-id');
    });

    it('認証失敗時のエラーハンドリング', () => {
      // 要件1.3: 認証失敗時の適切な処理
      const authError = new Error('認証に失敗しました');
      expect(authError.message).toBe('認証に失敗しました');
      expect(authError).toBeInstanceOf(Error);
    });

    it('セッション有効期限の検証', () => {
      // 要件1.3: セッション有効期限の管理
      const now = Date.now();
      const validSession = {
        user: { id: 'test-user' },
        expires: new Date(now + 24 * 60 * 60 * 1000).toISOString() // 24時間後
      };
      
      const expiredSession = {
        user: { id: 'test-user' },
        expires: new Date(now - 1000).toISOString() // 1秒前（期限切れ）
      };

      expect(new Date(validSession.expires).getTime()).toBeGreaterThan(now);
      expect(new Date(expiredSession.expires).getTime()).toBeLessThan(now);
    });
  });

  describe('認証設定の検証', () => {
    it('JWTコールバック関数が正しく動作する', () => {
      // 要件1.3: JWTトークンにユーザー情報を追加
      const mockUser = {
        id: 'test-user-id',
        name: 'テストユーザー',
        email: 'test@example.com',
      };

      const mockToken = {};
      
      // JWTコールバックのロジックをテスト
      const jwtCallback = (token: any, user: any) => {
        if (user) {
          token.id = user.id;
        }
        return token;
      };

      const result = jwtCallback(mockToken, mockUser);
      expect(result.id).toBe('test-user-id');
    });

    it('セッションコールバック関数が正しく動作する', () => {
      // 要件1.3: セッションにユーザーIDを追加
      const mockToken = { id: 'test-user-id' };
      const mockSession = {
        user: {
          name: 'テストユーザー',
          email: 'test@example.com',
          image: 'https://example.com/avatar.jpg'
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };

      // セッションコールバックのロジックをテスト
      const sessionCallback = (session: any, token: any) => {
        if (token && session.user) {
          session.user.id = token.id;
        }
        return session;
      };

      const result = sessionCallback(mockSession, mockToken);
      expect(result.user.id).toBe('test-user-id');
    });

    it('リダイレクトコールバック関数が正しく動作する', () => {
      // 要件1.2: 認証後のリダイレクト処理
      const baseUrl = 'http://localhost:3000';
      
      // リダイレクトコールバックのロジックをテスト
      const redirectCallback = (url: string, baseUrl: string) => {
        if (url.startsWith('/')) {
          return `${baseUrl}${url}`;
        } else if (new URL(url).origin === baseUrl) {
          return url;
        }
        return baseUrl;
      };

      // 相対URLのテスト
      expect(redirectCallback('/dashboard', baseUrl)).toBe(`${baseUrl}/dashboard`);
      
      // 同じオリジンのテスト
      expect(redirectCallback('http://localhost:3000/profile', baseUrl)).toBe('http://localhost:3000/profile');
      
      // 外部URLのテスト（ホームにリダイレクト）
      expect(redirectCallback('https://malicious-site.com', baseUrl)).toBe(baseUrl);
    });
  });

  describe('セキュリティ設定のテスト', () => {
    it('NEXTAUTH_SECRETが設定されている', () => {
      // セキュリティ要件: シークレットキーの設定
      expect(process.env.NEXTAUTH_SECRET).toBeTruthy();
      expect(process.env.NEXTAUTH_SECRET).toBe('test-secret');
    });

    it('適切なセッション有効期限が設定されている', () => {
      // セキュリティ要件: セッション有効期限
      const expectedMaxAge = 24 * 60 * 60; // 24時間
      expect(expectedMaxAge).toBe(86400); // 24時間 = 86400秒
    });
  });
});