import { render, screen } from '@testing-library/react'
import FlexCenter from '../FlexCenter'

describe('FlexCenter', () => {
  describe('Basic Functionality', () => {
    it('renders children correctly', () => {
      render(
        <FlexCenter>
          <div>フレックス内容</div>
        </FlexCenter>
      )
      
      expect(screen.getByText('フレックス内容')).toBeInTheDocument()
    })

    it('applies default classes (row, center, center)', () => {
      render(
        <FlexCenter>
          <div>デフォルト</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('デフォルト').parentElement
      expect(container).toHaveClass('flex', 'flex-row', 'justify-center', 'items-center')
    })

    it('applies custom className while preserving base styles', () => {
      render(
        <FlexCenter className="custom-flex">
          <div>カスタム</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('カスタム').parentElement
      expect(container).toHaveClass('custom-flex', 'flex', 'justify-center', 'items-center')
    })
  })

  describe('Direction Variants', () => {
    it('applies row direction correctly (default)', () => {
      render(
        <FlexCenter direction="row">
          <div>横並び</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('横並び').parentElement
      expect(container).toHaveClass('flex-row')
    })

    it('applies col direction correctly', () => {
      render(
        <FlexCenter direction="col">
          <div>縦並び</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('縦並び').parentElement
      expect(container).toHaveClass('flex-col')
    })

    it('applies row-reverse direction correctly', () => {
      render(
        <FlexCenter direction="row-reverse">
          <div>横並び逆順</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('横並び逆順').parentElement
      expect(container).toHaveClass('flex-row-reverse')
    })

    it('applies col-reverse direction correctly', () => {
      render(
        <FlexCenter direction="col-reverse">
          <div>縦並び逆順</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('縦並び逆順').parentElement
      expect(container).toHaveClass('flex-col-reverse')
    })
  })

  describe('Justify Content Variants', () => {
    it('applies justify-start correctly', () => {
      render(
        <FlexCenter justify="start">
          <div>開始位置</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('開始位置').parentElement
      expect(container).toHaveClass('justify-start')
    })

    it('applies justify-end correctly', () => {
      render(
        <FlexCenter justify="end">
          <div>終了位置</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('終了位置').parentElement
      expect(container).toHaveClass('justify-end')
    })

    it('applies justify-center correctly (default)', () => {
      render(
        <FlexCenter justify="center">
          <div>中央位置</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('中央位置').parentElement
      expect(container).toHaveClass('justify-center')
    })

    it('applies justify-between correctly', () => {
      render(
        <FlexCenter justify="between">
          <div>間隔均等</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('間隔均等').parentElement
      expect(container).toHaveClass('justify-between')
    })

    it('applies justify-around correctly', () => {
      render(
        <FlexCenter justify="around">
          <div>周囲均等</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('周囲均等').parentElement
      expect(container).toHaveClass('justify-around')
    })

    it('applies justify-evenly correctly', () => {
      render(
        <FlexCenter justify="evenly">
          <div>完全均等</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('完全均等').parentElement
      expect(container).toHaveClass('justify-evenly')
    })
  })

  describe('Align Items Variants', () => {
    it('applies items-start correctly', () => {
      render(
        <FlexCenter align="start">
          <div>上揃え</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('上揃え').parentElement
      expect(container).toHaveClass('items-start')
    })

    it('applies items-end correctly', () => {
      render(
        <FlexCenter align="end">
          <div>下揃え</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('下揃え').parentElement
      expect(container).toHaveClass('items-end')
    })

    it('applies items-center correctly (default)', () => {
      render(
        <FlexCenter align="center">
          <div>中央揃え</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('中央揃え').parentElement
      expect(container).toHaveClass('items-center')
    })

    it('applies items-baseline correctly', () => {
      render(
        <FlexCenter align="baseline">
          <div>ベースライン</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('ベースライン').parentElement
      expect(container).toHaveClass('items-baseline')
    })

    it('applies items-stretch correctly', () => {
      render(
        <FlexCenter align="stretch">
          <div>伸縮</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('伸縮').parentElement
      expect(container).toHaveClass('items-stretch')
    })
  })

  describe('Gap Variants', () => {
    it('applies no gap by default', () => {
      render(
        <FlexCenter>
          <div>ギャップなし</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('ギャップなし').parentElement
      expect(container).not.toHaveClass('gap-2', 'gap-4', 'gap-6', 'gap-8')
    })

    it('applies sm gap correctly', () => {
      render(
        <FlexCenter gap="sm">
          <div>小ギャップ</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('小ギャップ').parentElement
      expect(container).toHaveClass('gap-2')
    })

    it('applies md gap correctly', () => {
      render(
        <FlexCenter gap="md">
          <div>中ギャップ</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('中ギャップ').parentElement
      expect(container).toHaveClass('gap-4')
    })

    it('applies lg gap correctly', () => {
      render(
        <FlexCenter gap="lg">
          <div>大ギャップ</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('大ギャップ').parentElement
      expect(container).toHaveClass('gap-6')
    })

    it('applies xl gap correctly', () => {
      render(
        <FlexCenter gap="xl">
          <div>特大ギャップ</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('特大ギャップ').parentElement
      expect(container).toHaveClass('gap-8')
    })
  })

  describe('Size Modifiers', () => {
    it('applies full height when fullHeight=true', () => {
      render(
        <FlexCenter fullHeight>
          <div>フル高さ</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('フル高さ').parentElement
      expect(container).toHaveClass('h-full')
    })

    it('does not apply full height by default', () => {
      render(
        <FlexCenter>
          <div>通常高さ</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('通常高さ').parentElement
      expect(container).not.toHaveClass('h-full')
    })

    it('applies full width when fullWidth=true', () => {
      render(
        <FlexCenter fullWidth>
          <div>フル幅</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('フル幅').parentElement
      expect(container).toHaveClass('w-full')
    })

    it('does not apply full width by default', () => {
      render(
        <FlexCenter>
          <div>通常幅</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('通常幅').parentElement
      expect(container).not.toHaveClass('w-full')
    })

    it('applies both full height and width', () => {
      render(
        <FlexCenter fullHeight fullWidth>
          <div>フルサイズ</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('フルサイズ').parentElement
      expect(container).toHaveClass('h-full', 'w-full')
    })
  })

  describe('Combined Props', () => {
    it('combines direction, justify, and align props', () => {
      render(
        <FlexCenter direction="col" justify="start" align="stretch">
          <div>複合設定</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('複合設定').parentElement
      expect(container).toHaveClass('flex-col', 'justify-start', 'items-stretch')
    })

    it('combines all props correctly', () => {
      render(
        <FlexCenter 
          direction="row-reverse" 
          justify="between" 
          align="end" 
          gap="lg"
          fullHeight
          fullWidth
          className="bg-blue-500"
        >
          <div>全設定</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('全設定').parentElement
      expect(container).toHaveClass(
        'flex',
        'flex-row-reverse',
        'justify-between',
        'items-end',
        'gap-6',
        'h-full',
        'w-full',
        'bg-blue-500'
      )
    })
  })

  describe('Use Cases', () => {
    it('works well for button groups', () => {
      render(
        <FlexCenter gap="md">
          <button>ボタン1</button>
          <button>ボタン2</button>
        </FlexCenter>
      )
      
      const container = screen.getByText('ボタン1').parentElement
      expect(container).toHaveClass('flex', 'justify-center', 'items-center', 'gap-4')
    })

    it('works well for vertical layouts', () => {
      render(
        <FlexCenter direction="col" gap="lg" fullHeight>
          <div>ヘッダー</div>
          <div>コンテンツ</div>
          <div>フッター</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('ヘッダー').parentElement
      expect(container).toHaveClass('flex-col', 'gap-6', 'h-full')
    })

    it('works well for navigation bars', () => {
      render(
        <FlexCenter justify="between" align="center" fullWidth>
          <div>ロゴ</div>
          <div>メニュー</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('ロゴ').parentElement
      expect(container).toHaveClass('justify-between', 'items-center', 'w-full')
    })

    it('works well for card content', () => {
      render(
        <FlexCenter direction="col" align="start" gap="sm">
          <h3>タイトル</h3>
          <p>説明文</p>
        </FlexCenter>
      )
      
      const container = screen.getByText('タイトル').parentElement
      expect(container).toHaveClass('flex-col', 'items-start', 'gap-2')
    })
  })

  describe('Mobile-First Responsive Design', () => {
    it('provides flexible layout options for mobile', () => {
      render(
        <FlexCenter direction="col" gap="md" className="sm:flex-row">
          <div>レスポンシブ1</div>
          <div>レスポンシブ2</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('レスポンシブ1').parentElement
      expect(container).toHaveClass('flex-col', 'gap-4', 'sm:flex-row')
    })

    it('supports responsive gap adjustments', () => {
      render(
        <FlexCenter gap="sm" className="md:gap-8">
          <div>レスポンシブギャップ</div>
        </FlexCenter>
      )
      
      const container = screen.getByText('レスポンシブギャップ').parentElement
      expect(container).toHaveClass('gap-2', 'md:gap-8')
    })
  })
})