import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShopDataExample from '../ShopDataExample';
import { getAllShops, getShopById } from '@/lib/shopData';
import { Shop } from '@/types/shop';

// モック関数
jest.mock('@/lib/shopData');

const mockGetAllShops = getAllShops as jest.MockedFunction<typeof getAllShops>;
const mockGetShopById = getShopById as jest.MockedFunction<typeof getShopById>;

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

describe('ShopDataExample', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render shop data example component', async () => {
    mockGetAllShops.mockResolvedValue(mockShops);

    render(<ShopDataExample />);

    expect(screen.getByText('店舗データ使用例')).toBeInTheDocument();
    expect(screen.getByText('店舗データを再取得')).toBeInTheDocument();
    expect(screen.getByText('シャッフル')).toBeInTheDocument();

    // 店舗データが表示されるまで待機
    await waitFor(() => {
      expect(screen.getByText('テストカフェ')).toBeInTheDocument();
      expect(screen.getByText('テスト蕎麦屋')).toBeInTheDocument();
    });
  });

  it('should display loading state', () => {
    mockGetAllShops.mockImplementation(() => new Promise(() => {})); // 永続的にpending

    render(<ShopDataExample />);

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('should handle shop selection', async () => {
    mockGetAllShops.mockResolvedValue(mockShops);
    mockGetShopById.mockResolvedValue(mockShops[0]);

    render(<ShopDataExample />);

    // 店舗データが表示されるまで待機
    await waitFor(() => {
      expect(screen.getByText('テストカフェ')).toBeInTheDocument();
    });

    // 店舗をクリック
    fireEvent.click(screen.getByText('テストカフェ'));

    // 詳細が表示されるまで待機
    await waitFor(() => {
      expect(screen.getByText('店舗詳細')).toBeInTheDocument();
      expect(screen.getByText('ID:')).toBeInTheDocument();
      expect(screen.getByText('test-001')).toBeInTheDocument();
    });

    expect(mockGetShopById).toHaveBeenCalledWith('test-001');
  });

  it('should handle refresh button click', async () => {
    mockGetAllShops.mockResolvedValue(mockShops);

    render(<ShopDataExample />);

    // 初回読み込み完了まで待機
    await waitFor(() => {
      expect(screen.getByText('テストカフェ')).toBeInTheDocument();
    });

    // リフレッシュボタンをクリック
    fireEvent.click(screen.getByText('店舗データを再取得'));

    // getAllShopsが2回呼ばれることを確認（初回 + リフレッシュ）
    await waitFor(() => {
      expect(mockGetAllShops).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle shuffle button click', async () => {
    mockGetAllShops.mockResolvedValue(mockShops);

    render(<ShopDataExample />);

    // 初回読み込み完了まで待機
    await waitFor(() => {
      expect(screen.getByText('テストカフェ')).toBeInTheDocument();
    });

    // シャッフルボタンをクリック
    const shuffleButton = screen.getByText('シャッフル');
    expect(shuffleButton).not.toBeDisabled();
    
    fireEvent.click(shuffleButton);

    // 店舗は同じだが順序が変わる可能性がある
    expect(screen.getByText('テストカフェ')).toBeInTheDocument();
    expect(screen.getByText('テスト蕎麦屋')).toBeInTheDocument();
  });

  it('should close shop details', async () => {
    mockGetAllShops.mockResolvedValue(mockShops);
    mockGetShopById.mockResolvedValue(mockShops[0]);

    render(<ShopDataExample />);

    // 店舗データが表示されるまで待機
    await waitFor(() => {
      expect(screen.getByText('テストカフェ')).toBeInTheDocument();
    });

    // 店舗をクリックして詳細を表示
    fireEvent.click(screen.getByText('テストカフェ'));

    await waitFor(() => {
      expect(screen.getByText('店舗詳細')).toBeInTheDocument();
    });

    // 閉じるボタンをクリック
    fireEvent.click(screen.getByText('閉じる'));

    // 詳細が非表示になることを確認
    expect(screen.queryByText('店舗詳細')).not.toBeInTheDocument();
  });

  it('should display empty state when no shops', async () => {
    mockGetAllShops.mockResolvedValue([]);

    render(<ShopDataExample />);

    await waitFor(() => {
      expect(screen.getByText('店舗データがありません')).toBeInTheDocument();
    });
  });
});