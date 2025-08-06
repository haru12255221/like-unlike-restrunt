/**
 * 店舗データの型定義
 * 要件3.1, 3.2, 5.1に基づく店舗情報の構造
 */
export interface Shop {
  /** 店舗の一意識別子 */
  id: string;
  /** 店舗名 */
  name: string;
  /** 店舗住所 */
  address: string;
  /** 店舗ジャンル（例: カフェ、レストラン、雑貨店など） */
  genre: string;
  /** 店舗画像のURL（public/images/shops/ 内の画像パス） */
  imageUrl: string;
  /** 一言ストーリー（店舗の魅力を表現する短いメッセージ） */
  story: string;
}

/**
 * ユーザーのLike履歴管理用の型定義
 * LocalStorageで管理される
 */
export interface UserData {
  /** ユーザーの一意識別子 */
  userId: string;
  /** Likeした店舗IDの配列 */
  likedShops: string[];
}

/**
 * データ取得時のエラー型
 */
export class ShopDataError extends Error {
  public code: 'FETCH_ERROR' | 'PARSE_ERROR' | 'NOT_FOUND';
  
  constructor(message: string, code: 'FETCH_ERROR' | 'PARSE_ERROR' | 'NOT_FOUND') {
    super(message);
    this.name = 'ShopDataError';
    this.code = code;
  }
}