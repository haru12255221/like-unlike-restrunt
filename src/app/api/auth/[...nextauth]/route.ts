/**
 * NextAuth.js APIルート (App Router対応 - v5)
 * 要件: 1.1, 1.2, 1.3 - 認証APIエンドポイント
 */

import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth';

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };