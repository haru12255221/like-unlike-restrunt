import type { Metadata } from 'next'
import { AuthProvider } from '@/components/providers/AuthProvider'
import './globals.css'

export const metadata: Metadata = {
  title: '一瞥（いちべつ）',
  description: '地域のお店と感性で出会う「偶然」を提供するローカルガイドアプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="font-sans bg-kinari text-sumi antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}