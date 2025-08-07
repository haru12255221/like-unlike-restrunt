/**
 * 認証ヘルパー関数
 * 要件: 1.1, 1.2, 1.3 - 認証状態の管理とユーティリティ
 */

/**
 * サーバーサイドで認証状態を取得する関数の型定義
 * 要件1.3: サーバーサイドでの認証状態確認
 * 注意: 実際の実装は使用する場所で getServerSession(authConfig) を呼び出してください
 */
export type GetAuthSessionFunction = () => Promise<any>;

/**
 * ユーザーが認証済みかどうかを確認する
 * 要件1.1: 認証状態の確認
 */
export function isAuthenticated(session: any): boolean {
  return !!(session && session.user && session.user.id);
}

/**
 * セッションが有効期限内かどうかを確認する
 * 要件1.3: セッション有効期限の確認
 */
export function isSessionValid(session: any): boolean {
  if (!session || !session.expires) {
    return false;
  }
  
  const expirationTime = new Date(session.expires).getTime();
  const currentTime = Date.now();
  
  return expirationTime > currentTime;
}

/**
 * ユーザー情報を安全に取得する
 * 要件1.2: ユーザー情報の安全な取得
 */
export function getUserInfo(session: any) {
  if (!isAuthenticated(session)) {
    return null;
  }
  
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };
}

/**
 * 認証が必要なページかどうかを判定する
 * 要件1.2: ページアクセス制御
 */
export function requiresAuth(pathname: string): boolean {
  const publicPaths = ['/login', '/auth/error'];
  return !publicPaths.includes(pathname);
}

/**
 * リダイレクトURLを生成する
 * 要件1.2: 認証後のリダイレクト処理
 */
export function getRedirectUrl(callbackUrl?: string): string {
  // デフォルトはホームページ
  const defaultUrl = '/';
  
  if (!callbackUrl) {
    return defaultUrl;
  }
  
  // 相対URLの場合はそのまま使用
  if (callbackUrl.startsWith('/')) {
    return callbackUrl;
  }
  
  // 絶対URLの場合は同じオリジンのみ許可
  try {
    const url = new URL(callbackUrl);
    const baseUrl = new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000');
    
    if (url.origin === baseUrl.origin) {
      return callbackUrl;
    }
  } catch (error) {
    // 無効なURLの場合はデフォルトを返す
    console.warn('Invalid callback URL:', callbackUrl);
  }
  
  return defaultUrl;
}