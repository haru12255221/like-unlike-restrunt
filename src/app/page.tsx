import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Container from '@/components/layout/Container'
import FlexCenter from '@/components/layout/FlexCenter'

export default function Home() {
  return (
    <main className="min-h-screen py-8">
      <Container>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand-primary mb-4">
            一瞥（いちべつ）
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            地域のお店と感性で出会う「偶然」を提供する
          </p>
        </div>

        {/* デザインシステムのデモ */}
        <div className="space-y-8">
          {/* ボタンのデモ */}
          <section>
            <h2 className="text-xl font-semibold text-sumi mb-4">ボタン</h2>
            <div className="space-y-4">
              <div className="flex gap-4 justify-center">
                <Button variant="primary">プライマリ</Button>
                <Button variant="secondary">セカンダリ</Button>
              </div>
              <FlexCenter className="gap-4">
                <Button variant="like">❤️</Button>
                <Button variant="skip">✕</Button>
              </FlexCenter>
            </div>
          </section>

          {/* カードのデモ */}
          <section>
            <h2 className="text-xl font-semibold text-sumi mb-4">カード</h2>
            <div className="space-y-4">
              <Card variant="list">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-brand-secondary rounded-lg"></div>
                  <div>
                    <h3 className="font-semibold text-sumi">サンプル店舗</h3>
                    <p className="text-sm text-neutral-600">美味しい料理を提供します</p>
                  </div>
                </div>
              </Card>
              
              <FlexCenter>
                <Card variant="swipe" className="w-64">
                  <div className="h-48 bg-gradient-to-br from-brand-secondary to-brand-primary"></div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sumi mb-2">スワイプカード</h3>
                    <p className="text-sm text-neutral-600">
                      「心温まる家庭の味を大切にしています」
                    </p>
                  </div>
                </Card>
              </FlexCenter>
            </div>
          </section>

          {/* カラーパレットのデモ */}
          <section>
            <h2 className="text-xl font-semibold text-sumi mb-4">カラーパレット</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-12 bg-brand-primary rounded flex items-center justify-center text-white text-sm">
                  Primary
                </div>
                <div className="h-12 bg-brand-secondary rounded flex items-center justify-center text-sumi text-sm">
                  Secondary
                </div>
                <div className="h-12 bg-brand-accent rounded flex items-center justify-center text-white text-sm">
                  Accent
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-like rounded flex items-center justify-center text-white text-sm">
                  Like
                </div>
                <div className="h-12 bg-skip rounded flex items-center justify-center text-white text-sm">
                  Skip
                </div>
                <div className="h-12 bg-washi rounded flex items-center justify-center text-sumi text-sm border">
                  Washi
                </div>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </main>
  )
}