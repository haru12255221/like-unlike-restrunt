/**
 * NextAuth.js設定 (v5対応)
 * 要件: 1.1, 1.2, 1.3 - Google認証によるユーザー認証
 */

import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      // JWTトークンにユーザー情報を追加
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // セッションにユーザーIDを追加
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // 認証後のリダイレクト処理
      // 相対URLの場合はbaseUrlを使用
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // 同じオリジンの場合はそのまま
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      // それ以外はホームページにリダイレクト
      return baseUrl;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24時間
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// v4互換性のためのエクスポート
export const authOptions = authConfig;