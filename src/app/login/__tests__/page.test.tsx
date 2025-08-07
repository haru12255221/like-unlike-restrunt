/**
 * ログインページのテスト
 * 要件: 1.1, 1.2, 1.3 - Googleログイン機能のテスト
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import LoginPage from '../page';

// Next.jsルーターのモック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// NextAuth.jsのモック
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  getSession: jest.fn(),
}));

// UIコンポーネントのモック
jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, disabled, className }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={className}
      data-testid="login-button"
    >
      {children}
    </button>
  ),
}));

jest.mock('@/components/layout/FlexCenter', () => ({
  FlexCenter: ({ children, className }: any) => (
    <div className={className} data-testid="flex-center">
      {children}
    </div>
  ),
}));

describe('ログインページ', () => {
  const mockPush = jest.fn();
  const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
  const mockGetSession = getSession as jest.MockedFunction<typeof getSession>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  describe('ページの表示', () => {
    it('ブランドタイトルが表示される', () => {
      // 要件1.1: ログインページの基本表示
      mockGetSession.mockResolvedValue(null);
      
      render(<LoginPage />);
      
      expect(screen.getByText('一瞥')).toBeInTheDocument();
      expect(screen.getByText('地域のお店と感性で出会う')).toBeInTheDocument();
    });

    it('Googleログインボタンが表示される', () => {
      // 要件1.1: Googleログインボタンの表示
      mockGetSession.mockResolvedValue(null);
      
      render(<LoginPage />);
      
      const loginButton = screen.getByTestId('login-button');
      expect(loginButton).toBeInTheDocument();
      expect(screen.getByText('Googleでログイン')).toBeInTheDocument();
    });

    it('説明文が表示される', () => {
      // 要件1.1: ユーザーへの説明
      mockGetSession.mockResolvedValue(null);
      
      render(<LoginPage />);
      
      expect(screen.getByText('ログインすることで、お気に入りの店舗を保存できます')).toBeInTheDocument();
    });
  });

  describe('認証状態の確認', () => {
    it('既にログイン済みの場合はホームページにリダイレクトする', async () => {
      // 要件1.2: 既認証ユーザーのリダイレクト
      const mockSession = {
        user: {
          id: 'test-user-id',
          name: 'テストユーザー',
          email: 'test@example.com',
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
      
      mockGetSession.mockResolvedValue(mockSession);
      
      render(<LoginPage />);
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('未認証の場合はログインページを表示する', async () => {
      // 要件1.1: 未認証ユーザーへのログインページ表示
      mockGetSession.mockResolvedValue(null);
      
      render(<LoginPage />);
      
      await waitFor(() => {
        expect(mockPush).not.toHaveBeenCalled();
      });
      
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });
  });

  describe('Googleログイン機能', () => {
    it('ログインボタンクリック時にGoogle認証が開始される', async () => {
      // 要件1.1: Googleログイン機能
      mockGetSession.mockResolvedValue(null);
      mockSignIn.mockResolvedValue({ ok: true, error: null, status: 200, url: '/' });
      
      render(<LoginPage />);
      
      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('google', {
          callbackUrl: '/',
          redirect: true,
        });
      });
    });

    it('ログイン中はローディング状態を表示する', async () => {
      // 要件1.2: ログイン処理中のUI状態
      mockGetSession.mockResolvedValue(null);
      mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
      
      render(<LoginPage />);
      
      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText('ログイン中...')).toBeInTheDocument();
      });
      
      expect(loginButton).toBeDisabled();
    });

    it('ログインエラー時は適切にハンドリングされる', async () => {
      // 要件1.3: ログインエラーのハンドリング
      mockGetSession.mockResolvedValue(null);
      mockSignIn.mockRejectedValue(new Error('認証エラー'));
      
      // コンソールエラーをモック
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      render(<LoginPage />);
      
      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('ログインエラー:', expect.any(Error));
      });
      
      // ローディング状態が解除される
      expect(loginButton).not.toBeDisabled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('UI状態の管理', () => {
    it('初期状態ではローディングが無効', () => {
      // UI状態の初期値確認
      mockGetSession.mockResolvedValue(null);
      
      render(<LoginPage />);
      
      const loginButton = screen.getByTestId('login-button');
      expect(loginButton).not.toBeDisabled();
      expect(screen.queryByText('ログイン中...')).not.toBeInTheDocument();
    });

    it('適切なCSSクラスが適用される', () => {
      // デザインシステムの適用確認
      mockGetSession.mockResolvedValue(null);
      
      render(<LoginPage />);
      
      // 背景色の確認
      const container = screen.getByTestId('flex-center').parentElement;
      expect(container).toHaveClass('bg-kinari');
      
      // ボタンのスタイル確認
      const loginButton = screen.getByTestId('login-button');
      expect(loginButton).toHaveClass('w-full', 'py-4', 'text-lg');
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なセマンティック要素が使用される', () => {
      // アクセシビリティ要件
      mockGetSession.mockResolvedValue(null);
      
      render(<LoginPage />);
      
      // 見出し要素の確認
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent('一瞥');
      
      // ボタン要素の確認
      const loginButton = screen.getByRole('button');
      expect(loginButton).toBeInTheDocument();
    });

    it('ローディング中のアクセシビリティ', async () => {
      // ローディング状態のアクセシビリティ
      mockGetSession.mockResolvedValue(null);
      mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
      
      render(<LoginPage />);
      
      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(loginButton).toBeDisabled();
        expect(loginButton).toHaveAttribute('disabled');
      });
    });
  });
});