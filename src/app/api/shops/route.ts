import { NextResponse } from 'next/server';
import { Shop } from '@/types/shop';
import fs from 'fs';
import path from 'path';

/**
 * 店舗データを取得するAPIエンドポイント
 * GET /api/shops
 */
export async function GET() {
  try {
    // JSONファイルのパスを取得
    const filePath = path.join(process.cwd(), 'data', 'shops.json');
    
    // ファイルの存在確認
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Shop data file not found' },
        { status: 404 }
      );
    }
    
    // JSONファイルを読み込み
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const shops: Shop[] = JSON.parse(fileContents);
    
    // データの妥当性チェック
    const validatedShops = shops.filter(shop => 
      shop.id && 
      shop.name && 
      shop.address && 
      shop.genre && 
      shop.imageUrl && 
      shop.story
    );
    
    return NextResponse.json(validatedShops);
  } catch (error) {
    console.error('Error reading shop data:', error);
    return NextResponse.json(
      { error: 'Failed to load shop data' },
      { status: 500 }
    );
  }
}