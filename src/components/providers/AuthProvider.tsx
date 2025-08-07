/**
 * 認証プロバイダーコンポーネント
 * 要件: 1.1, 1.2, 1.3 - アプリ全体での認証状態管理
 */

'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
};