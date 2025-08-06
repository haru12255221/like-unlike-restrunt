# 一瞥（いちべつ）- Local Guide App

地域のお店と感性で出会う「偶然」を提供する、Tinderライクなスワイプ式ローカルガイドアプリです。

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript
- **スタイリング**: Tailwind CSS + カスタム和風テーマ
- **アニメーション**: Framer Motion
- **テスト**: Jest + React Testing Library
- **リンター**: ESLint

## セットアップ

### 依存関係のインストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

### テストの実行

```bash
# 全テストを実行
npm test

# テストをウォッチモードで実行
npm run test:watch
```

### ビルド

```bash
npm run build
```

### リンター

```bash
npm run lint
```

## プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # ホームページ
├── components/
│   ├── ui/                # UIコンポーネント
│   │   ├── Button.tsx     # ボタンコンポーネント
│   │   └── Card.tsx       # カードコンポーネント
│   ├── layout/            # レイアウトコンポーネント
│   │   ├── Container.tsx  # コンテナ
│   │   └── FlexCenter.tsx # フレックスセンター
│   └── motion/            # Framer Motionコンポーネント
└── __tests__/             # テストファイル
```

## デザインシステム

### カラーパレット

- **ブランドカラー**: 茶色系（温かみ・信頼感）
- **アクション色**: Like（赤系）、Skip（グレー系）
- **和風アクセント**: 和紙色、墨色、生成り色

### コンポーネント

- **Button**: primary, secondary, like, skip の4つのバリアント
- **Card**: swipe, list の2つのバリアント
- **Layout**: Container, FlexCenter

## 開発ガイドライン

### テスト駆動開発（TDD）

このプロジェクトではTDDアプローチを採用しています：

1. テストを先に書く
2. 最小限の実装でテストを通す
3. リファクタリングで品質を向上

### コンポーネント設計

- 再利用可能なコンポーネントを作成
- TypeScriptで型安全性を確保
- Tailwind CSSでスタイリング
- アクセシビリティを考慮

## 次のステップ

このプロジェクト基盤が完成しました。次は以下のタスクに進むことができます：

1. 店舗データモデルとテストデータの作成
2. 認証機能の実装
3. スワイプカード機能の実装
4. Like機能とローカルストレージ管理

詳細は `.kiro/specs/ichibetsu-local-guide/tasks.md` を参照してください。