import { Shop, ShopDataError } from '@/types/shop';

/**
 * 店舗データを取得する関数
 * 要件5.1: 事前登録された店舗データの取得
 */
export async function getAllShops(): Promise<Shop[]> {
  try {
    const response = await fetch('/api/shops');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const shops: Shop[] = await response.json();
    return shops;
  } catch (error) {
    console.error('Failed to fetch shops:', error);
    throw new ShopDataError(
      'Failed to fetch shop data',
      'FETCH_ERROR'
    );
  }
}

/**
 * 特定の店舗データを取得する関数
 * 要件3.2: 店舗詳細ページでの詳細情報表示
 */
export async function getShopById(id: string): Promise<Shop | null> {
  try {
    const shops = await getAllShops();
    const shop = shops.find(shop => shop.id === id);
    
    if (!shop) {
      throw new ShopDataError(
        `Shop with id ${id} not found`,
        'NOT_FOUND'
      );
    }
    
    return shop;
  } catch (error) {
    if (error instanceof ShopDataError) {
      throw error;
    }
    
    console.error('Failed to fetch shop by id:', error);
    throw new ShopDataError(
      'Failed to fetch shop data',
      'FETCH_ERROR'
    );
  }
}

/**
 * 開発用: JSONファイルから直接店舗データを取得する関数
 * 本番環境ではAPIエンドポイントを使用
 */
export async function getShopsFromJSON(): Promise<Shop[]> {
  try {
    // 開発環境では直接JSONファイルを読み込み
    const response = await fetch('/data/shops.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const shops: Shop[] = await response.json();
    
    // データの妥当性チェック
    const validatedShops = shops.filter(shop => 
      shop.id && 
      shop.name && 
      shop.address && 
      shop.genre && 
      shop.imageUrl && 
      shop.story
    );
    
    if (validatedShops.length !== shops.length) {
      console.warn('Some shop data was invalid and filtered out');
    }
    
    return validatedShops;
  } catch (error) {
    console.error('Failed to fetch shops from JSON:', error);
    throw new ShopDataError(
      'Failed to parse shop data',
      'PARSE_ERROR'
    );
  }
}

/**
 * 店舗データをシャッフルする関数
 * 要件2.1: ランダムな順序での店舗表示
 */
export function shuffleShops(shops: Shop[]): Shop[] {
  const shuffled = [...shops];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * デフォルト画像のパスを取得する関数
 * 要件3.1: 画像が登録されていない場合のデフォルト画像表示
 */
export function getDefaultImageUrl(): string {
  return '/images/shops/default-shop.jpg';
}

/**
 * 画像URLの妥当性をチェックし、必要に応じてデフォルト画像を返す関数
 */
export function validateImageUrl(imageUrl: string): string {
  if (!imageUrl || imageUrl.trim() === '') {
    return getDefaultImageUrl();
  }
  
  return imageUrl;
}

