# 一瞥（いちべつ）- デザイン設計書

## 概要

一瞥（いちべつ）は、Next.js 14 (App Router) + TypeScriptをベースとした、Tinderライクなスワイプ式ローカルガイドアプリです。和風デザインとMUJI Passportのような温かみのあるUIを採用し、モバイルファーストで設計します。

## アーキテクチャ

### 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript
- **スタイリング**: Tailwind CSS + カスタム和風テーマ
- **アニメーション**: Framer Motion（スワイプ操作）
- **認証**: NextAuth.js v5 (Google Provider)
- **データベース**: SQLite (開発用) / Vercel Postgres (本番用)
- **ORM**: Prisma
- **画像管理**: public/images フォルダ (開発用)
- **デプロイ**: Vercel

### システム構成

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │     SQLite      │    │  public/images  │
│   (Frontend)    │◄──►│   (Database)    │    │   (Static)      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│  NextAuth.js    │
│  (Google Auth)  │
└─────────────────┘
```

## コンポーネント設計

### ページ構成

1. **ログインページ** (`/login`)
   - Googleログインボタン
   - 和風ブランディング

2. **ホーム画面** (`/`)
   - スワイプカードコンポーネント
   - 下部ナビゲーション

3. **Like一覧ページ** (`/likes`)
   - Likeした店舗のグリッド表示
   - 戻るボタン

4. **店舗詳細ページ** (`/shop/[id]`)
   - 店舗情報の詳細表示
   - 戻るボタン

### 主要コンポーネント

#### 1. SwipeCard コンポーネント
```typescript
// スワイプイベントの詳細情報
interface SwipeEvent {
  shop: Shop;           // 店舗情報全体
  direction: 'left' | 'right';  // スワイプ方向
  velocity: number;     // スワイプの速度
  distance: number;     // スワイプの距離
}

interface SwipeCardProps {
  shop: Shop;
  onSwipe: (event: SwipeEvent) => void;  // 統一されたスワイプハンドラー
  onTap: (shop: Shop) => void;           // タップ時は店舗情報全体を渡す
  isActive: boolean;    // このカードがアクティブかどうか
  stackIndex: number;   // カードスタック内での位置（0が最前面）
}

// 使用例
const handleSwipe = (event: SwipeEvent) => {
  if (event.direction === 'right') {
    // Like処理
    addToLikes(event.shop);
    console.log(`${event.shop.name}をLikeしました`);
  } else {
    // Skip処理
    console.log(`${event.shop.name}をスキップしました`);
  }
  
  // 次のカードを表示
  showNextCard();
};

const handleTap = (shop: Shop) => {
  // 詳細ページに遷移
  router.push(`/shop/${shop.id}`);
};
```

**機能:**
- Framer Motionによるスワイプ検出
- 右スワイプ: Like追加（店舗情報とスワイプ詳細を取得）
- 左スワイプ: Skip（ログ記録用に店舗情報を取得）
- タップ: 詳細ページ遷移（店舗情報全体を使用）
- カードスタック位置の管理

#### 2. ShopCard コンポーネント
```typescript
interface ShopCardProps {
  shop: Shop;
  variant: 'swipe' | 'list';
  onClick?: (shopId: string) => void;
}
```

**機能:**
- 店舗画像、店名、一言ストーリーの表示
- スワイプ用とリスト用の表示切り替え

#### 3. BottomNavigation コンポーネント
```typescript
interface BottomNavigationProps {
  currentPage: 'home' | 'likes';
}
```

**機能:**
- ホーム/Like一覧の切り替え
- 現在ページのハイライト

## データモデル

### データ管理（開発用簡素版）

#### 1. 店舗データ（JSON形式）
```typescript
// data/shops.json
interface Shop {
  id: string;
  name: string;
  address: string;
  genre: string;
  imageUrl: string; // public/images/shops/ 内の画像パス
  story: string;    // 一言ストーリー
}
```

#### 2. ユーザーデータ（LocalStorage）
```typescript
// ブラウザのLocalStorageで管理
interface UserData {
  userId: string;
  likedShops: string[]; // shop.id の配列
}
```

#### 3. 将来的なPrismaスキーマ（本番用）
```prisma
// 本番環境用（後で実装）
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  createdAt DateTime @default(now())
  
  likes     Like[]
}

model Shop {
  id       String @id @default(cuid())
  name     String
  address  String
  genre    String
  imageUrl String?
  story    String
  
  likes    Like[]
}

model Like {
  id     String @id @default(cuid())
  userId String
  shopId String
  
  user   User @relation(fields: [userId], references: [id])
  shop   Shop @relation(fields: [shopId], references: [id])
  
  @@unique([userId, shopId])
}
```

## UI/UXデザイン

### デザインシステム詳細

#### カラーパレット（和風テーマ）
```css
:root {
  /* ブランドカラー */
  --brand-primary: #8B4513;    /* 茶色（温かみ・信頼感） */
  --brand-secondary: #D2B48C;  /* 薄茶色（サブブランド） */
  --brand-accent: #DC143C;     /* 朱色（アクション・強調） */
  
  /* ニュートラルカラー */
  --neutral-50: #FAFAFA;       /* 背景（最も薄い） */
  --neutral-100: #F5F5F5;      /* カード背景 */
  --neutral-200: #EEEEEE;      /* ボーダー・区切り線 */
  --neutral-300: #E0E0E0;      /* 非アクティブ要素 */
  --neutral-400: #BDBDBD;      /* プレースホルダー */
  --neutral-500: #9E9E9E;      /* セカンダリテキスト */
  --neutral-600: #757575;      /* サブテキスト */
  --neutral-700: #616161;      /* メインテキスト */
  --neutral-800: #424242;      /* 見出し */
  --neutral-900: #212121;      /* 最も濃い */
  
  /* 機能色 */
  --success: #4CAF50;          /* 成功・完了 */
  --warning: #FF9800;          /* 警告・注意 */
  --error: #F44336;            /* エラー・削除 */
  --info: #2196F3;             /* 情報・リンク */
  
  /* アクション色 */
  --like: #FF6B6B;             /* Like（やわらかい赤） */
  --like-hover: #FF5252;       /* Likeホバー */
  --skip: #95A5A6;             /* Skip（グレー） */
  --skip-hover: #7F8C8D;       /* Skipホバー */
  
  /* 和風アクセント */
  --washi: #F5F5DC;            /* 和紙色 */
  --sumi: #2F2F2F;             /* 墨色 */
  --kinari: #FFFEF7;           /* 生成り色 */
  --urushi: #8B0000;           /* 漆色 */
}
```

#### タイポグラフィシステム
```css
/* フォントファミリー */
--font-primary: 'Hiragino Sans', 'Yu Gothic Medium', 'Meiryo', 'Noto Sans JP', sans-serif;
--font-secondary: 'Georgia', 'Times New Roman', serif; /* 英数字用 */
--font-mono: 'SF Mono', 'Monaco', 'Consolas', monospace;

/* フォントサイズ（モバイルファースト） */
--text-xs: 0.75rem;    /* 12px - キャプション */
--text-sm: 0.875rem;   /* 14px - 小さなテキスト */
--text-base: 1rem;     /* 16px - 基本テキスト */
--text-lg: 1.125rem;   /* 18px - 大きなテキスト */
--text-xl: 1.25rem;    /* 20px - 小見出し */
--text-2xl: 1.5rem;    /* 24px - 見出し */
--text-3xl: 1.875rem;  /* 30px - 大見出し */
--text-4xl: 2.25rem;   /* 36px - タイトル */

/* 行間 */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* フォントウェイト */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

#### スペーシングシステム
```css
/* 8pxベースのスペーシング */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

#### ボーダーラディウス
```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-base: 0.25rem;  /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-full: 9999px;   /* 完全な円 */
```

#### シャドウシステム
```css
/* 和風の柔らかいシャドウ */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* カード専用シャドウ */
--shadow-card: 0 2px 8px rgba(139, 69, 19, 0.1); /* ブランドカラーベース */
--shadow-card-hover: 0 4px 16px rgba(139, 69, 19, 0.15);
```

#### Tailwind CSS設定とコンポーネント仕様

##### tailwind.config.js設定
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ブランドカラー
        brand: {
          primary: '#8B4513',
          secondary: '#D2B48C',
          accent: '#DC143C',
        },
        // 和風アクセント
        washi: '#F5F5DC',
        sumi: '#2F2F2F',
        kinari: '#FFFEF7',
        urushi: '#8B0000',
        // アクション色
        like: '#FF6B6B',
        skip: '#95A5A6',
      },
      fontFamily: {
        sans: ['Hiragino Sans', 'Yu Gothic Medium', 'Meiryo', 'Noto Sans JP', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
        mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(139, 69, 19, 0.1)',
        'card-hover': '0 4px 16px rgba(139, 69, 19, 0.15)',
      },
      animation: {
        'swipe-right': 'swipeRight 0.4s ease-out forwards',
        'swipe-left': 'swipeLeft 0.4s ease-out forwards',
        'card-enter': 'cardEnter 0.3s ease-out',
      },
      keyframes: {
        swipeRight: {
          '0%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateX(300px) rotate(25deg)', opacity: '0' },
        },
        swipeLeft: {
          '0%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateX(-300px) rotate(-25deg)', opacity: '0' },
        },
        cardEnter: {
          '0%': { transform: 'scale(0.8) translateY(20px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

##### コンポーネント実装例（Tailwind優先）

```typescript
// ボタンコンポーネント
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'like' | 'skip';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ variant, children, onClick, className = '' }) => {
  const baseClasses = 'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-brand-primary text-white px-6 py-3 rounded-lg shadow-sm hover:bg-brand-secondary hover:shadow-md hover:-translate-y-0.5',
    secondary: 'bg-transparent text-brand-primary border border-brand-primary px-6 py-3 rounded-lg hover:bg-brand-primary hover:text-white',
    like: 'bg-like text-white w-15 h-15 rounded-full shadow-lg hover:bg-red-500 hover:scale-105',
    skip: 'bg-skip text-white w-15 h-15 rounded-full shadow-lg hover:bg-gray-600 hover:scale-105',
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// カードコンポーネント
interface CardProps {
  variant: 'swipe' | 'list';
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ variant, children, className = '' }) => {
  const baseClasses = 'bg-white rounded-2xl overflow-hidden transition-all duration-300';
  
  const variantClasses = {
    swipe: 'w-75 h-96 shadow-xl hover:shadow-card-hover hover:-translate-y-1',
    list: 'shadow-card p-4 mb-4 hover:shadow-card-hover hover:-translate-y-0.5',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

// レイアウトコンポーネント
const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="max-w-sm mx-auto px-4">
    {children}
  </div>
);

const FlexCenter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex items-center justify-center ${className}`}>
    {children}
  </div>
);
```

##### 複雑なアニメーション用CSS（必要な場合のみ）
```css
/* globals.css - Tailwindで表現しにくい複雑なアニメーションのみ */

/* カードスタック効果 */
.card-stack {
  position: relative;
}

.card-stack .card:nth-child(1) {
  z-index: 3;
  transform: scale(1) translateY(0);
}

.card-stack .card:nth-child(2) {
  z-index: 2;
  transform: scale(0.95) translateY(8px);
  opacity: 0.8;
}

.card-stack .card:nth-child(3) {
  z-index: 1;
  transform: scale(0.9) translateY(16px);
  opacity: 0.6;
}

/* Framer Motionと組み合わせる場合の最適化 */
.swipe-card {
  will-change: transform;
  backface-visibility: hidden;
  perspective: 1000px;
}
```

##### 使い分けの指針

**Tailwindを使う場合:**
- 基本的なスタイリング（色、サイズ、スペーシング）
- レスポンシブデザイン
- ホバー、フォーカス状態
- 単純なアニメーション

**CSSを使う場合:**
- 複雑なアニメーション（カードスタック効果など）
- Framer Motionとの組み合わせ最適化
- パフォーマンス重視の設定（will-change等）
- Tailwindで表現しにくい複雑なセレクター

#### アニメーション仕様
```css
/* トランジション */
--transition-fast: 0.15s ease;
--transition-base: 0.2s ease;
--transition-slow: 0.3s ease;

/* イージング */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 画面設計

#### 1. ホーム画面
```
┌─────────────────────────┐
│        一瞥             │ ← ヘッダー（ブランド名）
├─────────────────────────┤
│                         │
│    ┌─────────────┐      │
│    │             │      │
│    │  店舗画像   │      │ ← スワイプカード
│    │             │      │
│    └─────────────┘      │
│    店舗名                │
│    「一言ストーリー」    │
│                         │
├─────────────────────────┤
│  🏠 ホーム  ❤️ Like一覧  │ ← 下部ナビ
└─────────────────────────┘
```

#### 2. Like一覧画面
```
┌─────────────────────────┐
│  ← Like一覧             │ ← ヘッダー（戻るボタン）
├─────────────────────────┤
│  ┌─────┐  ┌─────┐      │
│  │店舗A│  │店舗B│      │ ← グリッド表示
│  └─────┘  └─────┘      │
│  ┌─────┐  ┌─────┐      │
│  │店舗C│  │店舗D│      │
│  └─────┘  └─────┘      │
├─────────────────────────┤
│  🏠 ホーム  ❤️ Like一覧  │
└─────────────────────────┘
```

## アニメーション設計

### スワイプアニメーション詳細設計

参考ライブラリ（TinderSwipeView、DeckCollectionViewLayout、CardSlider）の実装パターンを基に、Framer Motionで以下の機能を実装します。

#### 1. カードスタック構造

```typescript
interface CardStackProps {
  cards: Shop[];
  currentIndex: number;
  onSwipe: (direction: 'left' | 'right', cardId: string) => void;
}

// カードの重なり表示（最大3枚）
const VISIBLE_CARDS = 3;
const CARD_SCALE_FACTOR = 0.05; // 後ろのカードのスケール減少率
const CARD_Y_OFFSET = 8; // 後ろのカードのY軸オフセット
```

#### 2. スワイプ検出とドラッグ制御

```typescript
// ドラッグできる範囲の制限
const dragConstraints = {
  left: -200,   // 左に最大200pxまでドラッグ可能
  right: 200,   // 右に最大200pxまでドラッグ可能  
  top: 0,       // 上にはドラッグできない
  bottom: 0     // 下にもドラッグできない
};

// スワイプと判定する最小の「勢い」
const swipeConfidenceThreshold = 10000;

// スワイプの勢いを計算する関数
const swipePower = (offset: number, velocity: number): number => {
  // offset: ドラッグした距離（px）
  // velocity: ドラッグの速度（px/s）
  // Math.abs(): マイナス値も正の値に変換
  return Math.abs(offset) * velocity;
};

// 実際の使用例とより詳細な設定
const DRAG_CONFIG = {
  // ドラッグ制限（画面サイズに応じて調整可能）
  constraints: {
    left: -200,
    right: 200,
    top: 0,
    bottom: 0
  },
  
  // 判定閾値（調整可能な設定値）
  thresholds: {
    swipeConfidence: 10000,    // スワイプ判定の基準値
    minDistance: 50,           // 最小ドラッグ距離（px）
    minVelocity: 300,          // 最小ドラッグ速度（px/s）
    maxDragTime: 2000          // 最大ドラッグ時間（ms）
  },
  
  // ドラッグ中の設定
  elastic: 0.1,                // ドラッグ制限を超えた時の弾性
  momentum: false              // 慣性を無効化（正確な制御のため）
};

// Framer Motionの導入と使用方法

// 1. インストール
// npm install framer-motion

// 2. インポート
import { motion, PanInfo, useAnimation } from 'framer-motion';

// 3. opacityについて
// opacity = 透明度を表す値（0〜1）
// opacity: 0 = 完全に透明（見えない）
// opacity: 0.5 = 半透明
// opacity: 1 = 完全に不透明（普通に見える）

// 4. 基本的な使用例
const BasicExample = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}      // 初期状態：完全に透明（見えない）
      animate={{ opacity: 1 }}      // アニメーション後：完全に表示
      transition={{ duration: 0.5 }} // 0.5秒かけてゆっくり表示
    >
      Hello World
    </motion.div>
  );
};

// 5. opacity の値による見た目の違い
const OpacityExamples = () => {
  return (
    <div>
      {/* 完全に透明（見えない） */}
      <div style={{ opacity: 0 }}>見えません</div>
      
      {/* 薄く見える */}
      <div style={{ opacity: 0.3 }}>薄く見えます</div>
      
      {/* 半透明 */}
      <div style={{ opacity: 0.5 }}>半透明です</div>
      
      {/* 少し薄い */}
      <div style={{ opacity: 0.8 }}>少し薄いです</div>
      
      {/* 完全に表示（普通） */}
      <div style={{ opacity: 1 }}>普通に見えます</div>
    </div>
  );
};

// 6. フェードイン・フェードアウトアニメーション
const FadeAnimation = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? '隠す' : '表示'}
      </button>
      
      <motion.div
        animate={{ opacity: isVisible ? 1 : 0 }}  // 表示/非表示を切り替え
        transition={{ duration: 0.3 }}
      >
        フェードイン・アウトするテキスト
      </motion.div>
    </div>
  );
};

// 4. スワイプカードでの使用例
const SwipeCard = ({ shop, onSwipe }) => {
  const controls = useAnimation();

  return (
    <motion.div
      drag="x"                           // 横方向のみドラッグ可能
      dragConstraints={dragConstraints}  // ドラッグ範囲制限
      dragElastic={0.1}                  // 制限を超えた時の弾性
      dragMomentum={false}               // 慣性無効
      onDragEnd={handleDragEnd}          // ドラッグ終了時の処理
      animate={controls}                 // アニメーション制御
      variants={cardVariants}            // アニメーションパターン
      className="swipe-card"
    >
      <img src={shop.imageUrl} alt={shop.name} />
      <h3>{shop.name}</h3>
      <p>{shop.story}</p>
    </motion.div>
  );
};

// 5. Like一覧ページでの使用例
const LikesPage = () => {
  const [likedShops, setLikedShops] = useState([]);

  return (
    <motion.div
      variants={listTransitionVariants}  // アニメーションパターン
      initial="initial"                  // 初期状態
      animate="animate"                  // アニメーション実行
      exit="exit"                        // 終了時のアニメーション
      className="p-4"
    >
      <h1>Like一覧</h1>
      
      {likedShops.map((shop, index) => (
        <motion.div
          key={shop.id}
          variants={listItemVariants}    // 子要素のアニメーション
          className="mb-4"
        >
          <ShopCard shop={shop} variant="list" />
        </motion.div>
      ))}
    </motion.div>
  );
};
```

**各設定の意味と効果:**

```typescript
// dragConstraints の効果
const dragConstraints = {
  left: -200,   // ← ユーザーが左に200px以上ドラッグできない
  right: 200,   // → ユーザーが右に200px以上ドラッグできない
  top: 0,       // ↑ 上方向のドラッグを完全に禁止
  bottom: 0     // ↓ 下方向のドラッグを完全に禁止
};

// 実際の動作例
// ユーザーがカードを右に300pxドラッグしようとした場合
// → 200pxまでしか動かない（制限がかかる）
// → 200pxを超えた部分は弾性的に戻る（elastic: 0.1）
```

```typescript
// swipeConfidenceThreshold の効果
const swipeConfidenceThreshold = 10000;

// 判定例
// ケース1: ゆっくり長距離ドラッグ
const case1 = swipePower(150, 100); // 150px × 100px/s = 15,000
// 15,000 > 10,000 → スワイプ成功

// ケース2: 速く短距離ドラッグ  
const case2 = swipePower(80, 200);  // 80px × 200px/s = 16,000
// 16,000 > 10,000 → スワイプ成功

// ケース3: 弱いドラッグ
const case3 = swipePower(50, 150);  // 50px × 150px/s = 7,500
// 7,500 < 10,000 → スワイプ失敗（元に戻る）
```

**なぜこの設定が重要か:**

1. **誤操作防止**
   ```typescript
   // 制限なしの場合
   dragConstraints: false  // ユーザーが画面外までドラッグ可能
   // → カードが見えなくなる、操作が分からなくなる
   
   // 制限ありの場合  
   dragConstraints: { left: -200, right: 200 }
   // → 適度な範囲でドラッグ、視覚的フィードバックが明確
   ```

2. **意図の明確化**
   ```typescript
   // 閾値が低すぎる場合
   swipeConfidenceThreshold: 1000
   // → 少し触っただけでスワイプ判定、誤操作が多発
   
   // 閾値が高すぎる場合
   swipeConfidenceThreshold: 50000  
   // → 強くスワイプしてもなかなか反応しない
   
   // 適切な閾値
   swipeConfidenceThreshold: 10000
   // → 意図的なスワイプのみ反応、快適な操作感
   ```

3. **パフォーマンス最適化**
   ```typescript
   // 上下ドラッグを禁止することで
   top: 0, bottom: 0
   // → 縦スクロールとの競合を防ぐ
   // → 横スワイプに集中した操作感
   ```

これらの設定により、Tinderのような**直感的で気持ちの良いスワイプ操作**が実現できます！

#### 3. カードアニメーション状態

```typescript
const cardVariants = {
  // 初期状態（最前面のカード）
  active: {
    scale: 1,
    y: 0,
    zIndex: 3,
    opacity: 1,
    rotateZ: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  
  // 2番目のカード
  next: {
    scale: 1 - CARD_SCALE_FACTOR,
    y: CARD_Y_OFFSET,
    zIndex: 2,
    opacity: 0.8,
    rotateZ: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  
  // 3番目のカード
  inactive: {
    scale: 1 - CARD_SCALE_FACTOR * 2,
    y: CARD_Y_OFFSET * 2,
    zIndex: 1,
    opacity: 0.6,
    rotateZ: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  
  // 右スワイプ（Like）
  swipeRight: {
    x: 300,
    y: -50,
    opacity: 0,
    rotateZ: 25,
    scale: 0.8,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.4
    }
  },
  
  // 左スワイプ（Skip）
  swipeLeft: {
    x: -300,
    y: -50,
    opacity: 0,
    rotateZ: -25,
    scale: 0.8,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.4
    }
  },
  
  // カード入場アニメーション
  enter: {
    scale: 1 - CARD_SCALE_FACTOR * 3,
    y: CARD_Y_OFFSET * 3,
    opacity: 0,
    rotateZ: 0
  }
};
```

#### 4. ドラッグ中のリアルタイム回転

```typescript
const calculateRotation = (dragX: number) => {
  const maxRotation = 15; // 最大回転角度
  const maxDrag = 150; // 最大ドラッグ距離
  return (dragX / maxDrag) * maxRotation;
};

// ドラッグ中の動的スタイル
const dragStyle = {
  rotateZ: calculateRotation(dragX),
  opacity: 1 - Math.abs(dragX) / 300,
};
```

#### 5. スワイプ判定ロジック

```typescript
// スワイプの「勢い」を計算する関数
const swipePower = (offset: number, velocity: number): number => {
  // offset: ドラッグした距離（px）
  // velocity: ドラッグの速度（px/s）
  // 戻り値: 距離 × 速度 = スワイプの勢い
  return Math.abs(offset) * velocity;
};

// スワイプと判定する最小の勢い（調整可能）
const swipeConfidenceThreshold = 10000;

// ユーザーがカードを離した時に呼ばれる関数
const handleDragEnd = (event: any, info: PanInfo) => {
  // 1. スワイプの勢いを計算
  const swipe = swipePower(info.offset.x, info.velocity.x);
  
  // 2. スワイプの方向を判定
  const direction = info.offset.x > 0 ? 'right' : 'left';
  
  // 3. 勢いに基づいて動作を決定
  if (swipe < -swipeConfidenceThreshold) {
    // 左方向に十分な勢いがある → Skip
    onSwipe('left', currentCard.id);
    
  } else if (swipe > swipeConfidenceThreshold) {
    // 右方向に十分な勢いがある → Like
    onSwipe('right', currentCard.id);
    
  } else {
    // 勢いが不十分 → 元の位置に戻る
    controls.start('active');
  }
};

// より詳細な判定ロジック（実装時に使用）
const handleDragEndDetailed = (event: any, info: PanInfo) => {
  const { offset, velocity } = info;
  const swipeDistance = Math.abs(offset.x);
  const swipeVelocity = Math.abs(velocity.x);
  
  // デバッグ用ログ
  console.log({
    distance: swipeDistance,
    velocity: swipeVelocity,
    power: swipePower(offset.x, velocity.x),
    direction: offset.x > 0 ? 'right' : 'left'
  });
  
  // 判定条件（複数の条件を組み合わせ）
  const isStrongSwipe = swipePower(offset.x, velocity.x) > swipeConfidenceThreshold;
  const isLongSwipe = swipeDistance > 100; // 100px以上ドラッグ
  const isFastSwipe = swipeVelocity > 500;  // 500px/s以上の速度
  
  // より柔軟な判定
  if (isStrongSwipe || (isLongSwipe && isFastSwipe)) {
    if (offset.x > 0) {
      // 右スワイプ → Like
      onSwipe('right', currentCard.id);
    } else {
      // 左スワイプ → Skip
      onSwipe('left', currentCard.id);
    }
  } else {
    // 条件を満たさない → 元に戻る
    controls.start('active');
  }
};
```

**各パラメータの説明:**

```typescript
// info.offset.x の例
// ユーザーがカードを右に150px動かした場合: 150
// ユーザーがカードを左に80px動かした場合: -80

// info.velocity.x の例  
// 速くスワイプした場合: 1200 (px/s)
// ゆっくりドラッグした場合: 300 (px/s)

// swipePower の計算例
// 右に150px、速度1200px/s の場合: 150 × 1200 = 180,000
// 左に80px、速度300px/s の場合: 80 × 300 = 24,000

// swipeConfidenceThreshold = 10,000 の場合
// 180,000 > 10,000 → Like判定
// 24,000 > 10,000 → Skip判定
// 5,000 < 10,000 → 元に戻る
```

**実際の動作例:**

1. **強いスワイプ（Like）**
   ```
   ユーザー: カードを右に素早くスワイプ
   結果: offset.x = 120, velocity.x = 1500
   計算: 120 × 1500 = 180,000 > 10,000
   動作: Like実行、カードが右に飛んでいく
   ```

2. **弱いスワイプ（元に戻る）**
   ```
   ユーザー: カードを少しだけ動かして離す
   結果: offset.x = 30, velocity.x = 200  
   計算: 30 × 200 = 6,000 < 10,000
   動作: カードが元の位置に戻る
   ```

3. **左スワイプ（Skip）**
   ```
   ユーザー: カードを左に勢いよくスワイプ
   結果: offset.x = -100, velocity.x = -800
   計算: 100 × 800 = 80,000 > 10,000
   動作: Skip実行、カードが左に飛んでいく
   ```

これにより、ユーザーの「意図」を正確に判定できます！

#### 6. カードスタック更新アニメーション

```typescript
const updateCardStack = async () => {
  // 1. 最前面カードを削除
  await controls.start('exit');
  
  // 2. 残りのカードを前に移動
  const animations = visibleCards.map((card, index) => {
    const variant = index === 0 ? 'active' : 
                   index === 1 ? 'next' : 'inactive';
    return card.controls.start(variant);
  });
  
  // 3. 新しいカードを後ろに追加
  if (nextCard) {
    await nextCard.controls.start('enter');
    await nextCard.controls.start('inactive');
  }
  
  await Promise.all(animations);
};
```

#### 7. 視覚的フィードバック

```typescript
// Like/Skipインジケーター
const IndicatorVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  }
};

// ドラッグ中の色変化（デザインシステム統一版）
const getCardTint = (dragX: number): string => {
  const DRAG_THRESHOLD = 50;
  
  if (dragX > DRAG_THRESHOLD) {
    // Tailwindのlike色を使用（10%透明度）
    return 'rgba(255, 107, 107, 0.1)'; // bg-like/10 相当
  }
  
  if (dragX < -DRAG_THRESHOLD) {
    // Tailwindのskip色を使用（10%透明度）
    return 'rgba(149, 165, 166, 0.1)'; // bg-skip/10 相当
  }
  
  return 'transparent';
};

// より良い方法：Tailwindクラスを動的に適用
const getCardTintClass = (dragX: number): string => {
  const DRAG_THRESHOLD = 50;
  
  if (dragX > DRAG_THRESHOLD) return 'bg-like/10'; // Like状態
  if (dragX < -DRAG_THRESHOLD) return 'bg-skip/10'; // Skip状態
  return 'bg-transparent'; // ニュートラル状態
};

// 使用例（Framer Motionと組み合わせ）
const cardStyle = {
  backgroundColor: dragX > 50 ? 'rgb(255 107 107 / 0.1)' : 
                   dragX < -50 ? 'rgb(149 165 166 / 0.1)' : 
                   'transparent'
};

// またはTailwindクラスで
const cardClassName = `transition-colors duration-200 ${
  dragX > 50 ? 'bg-like/10' : 
  dragX < -50 ? 'bg-skip/10' : 
  'bg-transparent'
}`;
```

#### 8. パフォーマンス最適化

```typescript
// GPU加速の有効化
const cardStyle = {
  willChange: 'transform',
  backfaceVisibility: 'hidden',
  perspective: 1000,
};

// アニメーション中の不要な再レンダリング防止
const MemoizedCard = React.memo(SwipeCard, (prevProps, nextProps) => {
  return prevProps.shop.id === nextProps.shop.id && 
         prevProps.isActive === nextProps.isActive;
});
```

#### 9. タッチ操作の最適化

```typescript
const gestureConfig = {
  drag: true,
  dragConstraints: dragConstraints,
  dragElastic: 0.1, // ドラッグの弾性
  dragMomentum: false, // 慣性を無効化
  whileDrag: { 
    scale: 1.05, // ドラッグ中の軽微な拡大
    zIndex: 10 
  }
};
```

#### 10. アクセシビリティ対応

```typescript
// キーボード操作対応
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowRight':
      onSwipe('right', currentCard.id);
      break;
    case 'ArrowLeft':
      onSwipe('left', currentCard.id);
      break;
    case 'Enter':
    case ' ':
      onTap(currentCard.id);
      break;
  }
};

// スクリーンリーダー対応
const ariaLabels = {
  swipeCard: `店舗カード: ${shop.name}. 右にスワイプでLike、左にスワイプでSkip、タップで詳細表示`,
  likeButton: `${shop.name}をLikeする`,
  skipButton: `${shop.name}をスキップする`
};
```

### ページ遷移アニメーション

#### 1. 詳細ページ遷移

```typescript
// Framer Motionのアニメーション状態の説明
const pageTransitionVariants = {
  // initial = 「最初の状態」（コンポーネントが表示される前）
  initial: { 
    opacity: 0,     // 透明（見えない）
    y: 20,          // 下に20px移動した位置
    scale: 0.95     // 95%のサイズ（少し小さい）
  },
  
  // animate = 「アニメーション後の状態」（コンポーネントが表示される時）
  animate: { 
    opacity: 1,     // 完全に表示
    y: 0,           // 元の位置
    scale: 1,       // 100%のサイズ（普通のサイズ）
    transition: {
      type: "spring",      // バネのようなアニメーション
      stiffness: 300,      // バネの硬さ（数値が大きいほど速い）
      damping: 30,         // バネの減衰（数値が大きいほど早く止まる）
      duration: 0.4        // アニメーション時間（0.4秒）
    }
  },
  
  // exit = 「終了時の状態」（コンポーネントが消える時）
  exit: { 
    opacity: 0,     // 透明になる
    y: -20,         // 上に20px移動
    scale: 0.95,    // 95%のサイズに縮小
    transition: {
      duration: 0.3  // 0.3秒で消える
    }
  }
};

// 実際の使用例と動作の流れ
const ShopDetailPage = () => {
  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"    // 最初は initial の状態
      animate="animate"    // 表示時は animate の状態に変化
      exit="exit"          // 消える時は exit の状態に変化
      className="shop-detail"
    >
      <h1>店舗詳細</h1>
      <p>店舗の情報...</p>
    </motion.div>
  );
};

// 動作の流れを時系列で説明
/*
時間: 0秒
状態: initial
見た目: 透明で、下に20px移動、95%サイズ（見えない）

時間: 0〜0.4秒
状態: initial → animate
見た目: だんだん表示され、上に移動し、サイズが大きくなる

時間: 0.4秒
状態: animate
見た目: 完全に表示、元の位置、100%サイズ（普通に見える）

ページを閉じる時:
時間: 0〜0.3秒
状態: animate → exit
見た目: だんだん透明になり、上に移動し、サイズが小さくなる

時間: 0.3秒
状態: exit
見た目: 完全に消える
*/

// より分かりやすい例（ボタンクリックで状態変更）
const AnimationDemo = () => {
  const [currentState, setCurrentState] = useState('initial');
  
  return (
    <div>
      <div>
        <button onClick={() => setCurrentState('initial')}>Initial</button>
        <button onClick={() => setCurrentState('animate')}>Animate</button>
        <button onClick={() => setCurrentState('exit')}>Exit</button>
      </div>
      
      <motion.div
        variants={pageTransitionVariants}
        animate={currentState}  // ボタンで状態を切り替え
        className="w-32 h-32 bg-blue-500 rounded-lg"
      >
        テスト
      </motion.div>
    </div>
  );
};
```

**各状態の役割:**

1. **`initial`** = 「登場前の準備状態」
   - ページが読み込まれた瞬間
   - ユーザーにはまだ見えない
   - アニメーションの開始点

2. **`animate`** = 「表示完了状態」
   - ユーザーが普通に見る状態
   - アニメーションの終了点
   - 一番重要な状態

3. **`exit`** = 「退場時の状態」
   - ページを閉じる時
   - 他のページに移動する時
   - アニメーションで消える

**視覚的なイメージ:**
```
initial:  [小さく、下に、透明] → 見えない
   ↓ (0.4秒のアニメーション)
animate:  [普通サイズ、元の位置、表示] → 普通に見える
   ↓ (ページを閉じる時)
exit:     [小さく、上に、透明] → 消える
```

#### 2. Like一覧ページ遷移

```typescript
// Like一覧ページ全体のアニメーション
const listTransitionVariants = {
  // ページが表示される前の状態
  initial: { 
    opacity: 0,    // 透明
    x: 20          // 右に20px移動した位置
  },
  
  // ページが表示される時の状態
  animate: { 
    opacity: 1,    // 完全に表示
    x: 0,          // 元の位置
    transition: {
      staggerChildren: 0.1,  // 子要素を0.1秒ずつずらして表示
      delayChildren: 0.2     // 子要素の開始を0.2秒遅らせる
    }
  },
  
  // ページが消える時の状態
  exit: { 
    opacity: 0,    // 透明に
    x: -20         // 左に20px移動
  }
};

// Like一覧の各店舗カードのアニメーション
const listItemVariants = {
  // カードが表示される前
  initial: { 
    opacity: 0,    // 透明
    y: 20          // 下に20px移動した位置
  },
  
  // カードが表示される時
  animate: { 
    opacity: 1,    // 完全に表示
    y: 0           // 元の位置
  },
  
  // カードが消える時
  exit: { 
    opacity: 0,    // 透明に
    y: -20         // 上に20px移動
  }
};

// 実際の使用例
const LikesPage = () => {
  return (
    <motion.div
      variants={listTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-4"
    >
      <h1>Like一覧</h1>
      
      {likedShops.map((shop, index) => (
        <motion.div
          key={shop.id}
          variants={listItemVariants}  // 親のstaggerChildrenで自動的にずれて表示
          className="mb-4"
        >
          <ShopCard shop={shop} variant="list" />
        </motion.div>
      ))}
    </motion.div>
  );
};
```

**動作の流れ:**

1. **ページ遷移開始**
   - Like一覧ページが右から（x: 20）フェードイン（opacity: 0→1）

2. **子要素の順次表示**
   - 0.2秒待ってから店舗カードの表示開始
   - 各カードが0.1秒ずつずれて下から（y: 20）フェードイン

3. **結果**
   - ページ全体が滑らかに表示
   - 店舗カードが1つずつ順番に現れる
   - 視覚的に美しい「波打つような」アニメーション

**視覚的なイメージ:**
```
時間軸: 0s → 0.2s → 0.3s → 0.4s → 0.5s
ページ: [フェードイン開始] → [完了]
カード1:           → [表示] 
カード2:                  → [表示]
カード3:                         → [表示]
```

## エラーハンドリング詳細設計

### エラーケースと対応策

#### 1. 認証エラー
```typescript
// 認証エラーの種類
type AuthError = 
  | 'login_failed'           // Googleログイン失敗
  | 'session_expired'        // セッション期限切れ
  | 'network_auth_error'     // 認証サーバー接続エラー
  | 'user_cancelled'         // ユーザーがログインをキャンセル

// 対応策
const handleAuthError = (error: AuthError) => {
  switch (error) {
    case 'login_failed':
      // 1. エラートースト表示
      showToast('ログインに失敗しました', 'error');
      // 2. ログイン画面に戻る
      router.push('/login');
      // 3. リトライボタン表示
      setShowRetryButton(true);
      break;
      
    case 'session_expired':
      // 1. セッション切れ通知
      showToast('セッションが切れました。再度ログインしてください', 'warning');
      // 2. ローカルデータをクリア
      localStorage.removeItem('user-data');
      // 3. ログイン画面にリダイレクト
      router.push('/login');
      break;
      
    case 'network_auth_error':
      // 1. ネットワークエラー通知
      showToast('ネットワークエラーが発生しました', 'error');
      // 2. オフラインモード提案
      setOfflineMode(true);
      // 3. 再接続ボタン表示
      setShowReconnectButton(true);
      break;
  }
};
```

#### 2. データ取得エラー
```typescript
// データエラーの種類
type DataError = 
  | 'shops_load_failed'      // 店舗データ読み込み失敗
  | 'like_save_failed'       // Like保存失敗
  | 'image_load_failed'      // 画像読み込み失敗
  | 'data_corrupted'         // データ破損

// 対応策
const handleDataError = (error: DataError, context?: any) => {
  switch (error) {
    case 'shops_load_failed':
      // 1. エラー状態を表示
      setShopsError(true);
      // 2. フォールバック用のダミーデータを表示
      setShops(FALLBACK_SHOPS);
      // 3. リロードボタン表示
      showErrorBoundary({
        title: '店舗データの読み込みに失敗しました',
        message: 'ネットワーク接続を確認してください',
        action: () => window.location.reload()
      });
      break;
      
    case 'like_save_failed':
      // 1. 一時的にローカルに保存
      const tempLikes = JSON.parse(localStorage.getItem('temp-likes') || '[]');
      tempLikes.push(context.shopId);
      localStorage.setItem('temp-likes', JSON.stringify(tempLikes));
      // 2. ユーザーに通知
      showToast('Likeを一時保存しました。後で同期されます', 'info');
      // 3. バックグラウンドで再試行
      retryLikeSave(context.shopId);
      break;
      
    case 'image_load_failed':
      // 1. デフォルト画像に置換
      setImageSrc(DEFAULT_SHOP_IMAGE);
      // 2. ログに記録（開発用）
      console.warn(`Image load failed: ${context.imageUrl}`);
      // 3. ユーザーには通知しない（UX重視）
      break;
  }
};
```

#### 3. ネットワークエラー
```typescript
// ネットワークエラーの種類
type NetworkError = 
  | 'offline'                // オフライン状態
  | 'timeout'                // タイムアウト
  | 'server_error'           // サーバーエラー（500系）
  | 'not_found'              // リソースが見つからない（404）

// 対応策
const handleNetworkError = (error: NetworkError) => {
  switch (error) {
    case 'offline':
      // 1. オフラインモードに切り替え
      setIsOffline(true);
      // 2. オフライン用UIを表示
      showOfflineBanner();
      // 3. ローカルデータのみで動作
      enableOfflineMode();
      // 4. 接続復旧を監視
      startConnectionMonitoring();
      break;
      
    case 'timeout':
      // 1. タイムアウト通知
      showToast('通信がタイムアウトしました', 'warning');
      // 2. 自動リトライ（3回まで）
      if (retryCount < 3) {
        setTimeout(() => retryLastRequest(), 2000);
        setRetryCount(prev => prev + 1);
      } else {
        // 3. 手動リトライボタン表示
        setShowManualRetry(true);
      }
      break;
  }
};
```

### エラーUI コンポーネント設計

#### 1. トースト通知
```typescript
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const Toast: React.FC<ToastProps> = ({ type, message, duration = 4000, action }) => {
  const bgColor = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 left-4 right-4 p-4 border-l-4 rounded-lg shadow-lg z-50 ${bgColor[type]}`}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium">{message}</span>
        {action && (
          <button
            onClick={action.onClick}
            className="ml-4 px-3 py-1 bg-white rounded text-sm font-medium hover:bg-gray-50"
          >
            {action.label}
          </button>
        )}
      </div>
    </motion.div>
  );
};
```

#### 2. エラーバウンダリー
```typescript
interface ErrorBoundaryProps {
  title: string;
  message: string;
  action?: () => void;
  actionLabel?: string;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ 
  title, 
  message, 
  action, 
  actionLabel = 'リトライ' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-neutral-50">
      <div className="text-center max-w-md">
        {/* 和風エラーアイコン */}
        <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">😔</span>
        </div>
        
        <h2 className="text-xl font-semibold text-neutral-800 mb-4">
          {title}
        </h2>
        
        <p className="text-neutral-600 mb-8 leading-relaxed">
          {message}
        </p>
        
        {action && (
          <button
            onClick={action}
            className="bg-brand-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-secondary transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
```

#### 3. オフラインバナー
```typescript
const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 bg-yellow-500 text-white p-2 text-center text-sm font-medium z-50"
    >
      オフラインモードで動作中です。一部機能が制限されます。
    </motion.div>
  );
};
```

### エラー監視とログ

```typescript
// エラー監視システム
class ErrorMonitor {
  static logError(error: Error, context?: any) {
    // 1. コンソールに出力（開発用）
    console.error('Error occurred:', error, context);
    
    // 2. ローカルストレージに保存（デバッグ用）
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    const logs = JSON.parse(localStorage.getItem('error-logs') || '[]');
    logs.push(errorLog);
    
    // 最新100件のみ保持
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    localStorage.setItem('error-logs', JSON.stringify(logs));
    
    // 3. 将来的にはサーバーに送信
    // sendErrorToServer(errorLog);
  }
  
  static getErrorLogs() {
    return JSON.parse(localStorage.getItem('error-logs') || '[]');
  }
  
  static clearErrorLogs() {
    localStorage.removeItem('error-logs');
  }
}

// グローバルエラーハンドラー
window.addEventListener('error', (event) => {
  ErrorMonitor.logError(event.error, {
    type: 'global_error',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  ErrorMonitor.logError(new Error(event.reason), {
    type: 'unhandled_promise_rejection'
  });
});
```

## テスト戦略

### 単体テスト
- コンポーネントのレンダリング
- スワイプ操作の動作
- Like機能の状態管理

### 統合テスト
- 認証フローの完全性
- データベース操作
- API エンドポイント

### E2Eテスト
1. ログイン → ホーム画面表示
2. スワイプ操作 → Like追加
3. Like一覧表示 → 詳細ページ遷移

### パフォーマンステスト
- 画像読み込み速度
- スワイプアニメーションの滑らかさ
- ページ遷移速度（2秒以内）