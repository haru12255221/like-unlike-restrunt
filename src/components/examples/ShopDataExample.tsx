/**
 * Example component demonstrating shop data usage
 * This shows how to use the shop data functions in a React component
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Shop, ShopDataError } from '@/types/shop';
import { getAllShops, getShopById, shuffleShops, validateImageUrl } from '@/lib/shopData';

export const ShopDataExample: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 店舗データを取得する関数
  const fetchShops = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const allShops = await getAllShops();
      const shuffledShops = shuffleShops(allShops);
      setShops(shuffledShops);
    } catch (err) {
      if (err instanceof ShopDataError) {
        setError(`データ取得エラー: ${err.message} (${err.code})`);
      } else {
        setError('予期しないエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // 特定の店舗を取得する関数
  const fetchShopById = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const shop = await getShopById(id);
      setSelectedShop(shop);
    } catch (err) {
      if (err instanceof ShopDataError) {
        setError(`店舗取得エラー: ${err.message} (${err.code})`);
      } else {
        setError('予期しないエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // コンポーネントマウント時に店舗データを取得
  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-brand-primary">
        店舗データ使用例
      </h1>

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* ローディング表示 */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      )}

      {/* 操作ボタン */}
      <div className="mb-6 space-x-4">
        <button
          onClick={fetchShops}
          disabled={loading}
          className="bg-brand-primary text-white px-4 py-2 rounded hover:bg-brand-secondary disabled:opacity-50"
        >
          店舗データを再取得
        </button>
        
        <button
          onClick={() => setShops(shuffleShops(shops))}
          disabled={loading || shops?.length === 0}
          className="bg-brand-accent text-white px-4 py-2 rounded hover:opacity-80 disabled:opacity-50"
        >
          シャッフル
        </button>
      </div>

      {/* 店舗一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {shops.map((shop) => (
          <div
            key={shop.id}
            className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
            onClick={() => fetchShopById(shop.id)}
          >
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <img
                src={validateImageUrl(shop.imageUrl)}
                alt={shop.name}
                className="w-full h-48 object-cover rounded-t-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/shops/default-shop.jpg';
                }}
              />
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {shop.name}
              </h3>
              
              <p className="text-sm text-gray-600 mb-2">
                {shop.genre} • {shop.address}
              </p>
              
              <p className="text-sm text-gray-700 line-clamp-2">
                {shop.story}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 選択された店舗の詳細 */}
      {selectedShop && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-brand-primary">
            店舗詳細
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src={validateImageUrl(selectedShop.imageUrl)}
                alt={selectedShop.name}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/shops/default-shop.jpg';
                }}
              />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {selectedShop.name}
              </h3>
              
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">ID:</span> {selectedShop.id}
                </p>
                <p>
                  <span className="font-medium">ジャンル:</span> {selectedShop.genre}
                </p>
                <p>
                  <span className="font-medium">住所:</span> {selectedShop.address}
                </p>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">ストーリー</h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedShop.story}
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setSelectedShop(null)}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            閉じる
          </button>
        </div>
      )}

      {/* データが空の場合 */}
      {!loading && shops?.length === 0 && !error && (
        <div className="text-center py-8 text-gray-500">
          店舗データがありません
        </div>
      )}
    </div>
  );
};

export default ShopDataExample;