# ランディングページ再設計 — 用件定義・仕様書 (v1.0)

> **更新日:** 2025‑07‑08\
> **作成:** ChatGPT ＆ daiki\
> **変更**: ブランドカラー確定・主要サービスKPI反映・確認事項更新

---

## 1. プロジェクト概要

- **目的**: 生成AIをフル活用した事業支援・顧問サービスを軸に、貴社すべてのサービスをワンストップで訴求するおしゃれで信頼感のあるLPを制作する。
- **想定公開**: 2025年◯月◯日（※要確認）
- **主要指標(KPI)**:
  - リード獲得率 ◯% → ◯%へ向上
  - 滞在時間 ◯秒以上
  - 直帰率 ◯%以下

## 2. ターゲット

| ペルソナ       | 課題             | 解決策          | 主なCTA  |
| ---------- | -------------- | ------------ | ------ |
| 中小企業経営者    | DX/AI活用のノウハウ不足 | 顧問型AI活用支援    | 無料相談予約 |
| マーケ責任者     | SNS・LP施策が分断    | ワンストップ制作/運用  | 事例DL   |
| 自治体／福祉施設担当 | 住民向け施策のDX化     | LINEスタンプラリー等 | 問い合わせ  |

## 3. コアメッセージ

1. **「生成AI × ビジネス支援」で実務を加速**
2. **アイデアから実装まで、最速4週間納品**
3. **成功事例多数：TikTok運用からLP制作まで一気通貫**

## 4. サイト構成（IA）

```
/  ── Hero（タグライン＋主要CTA）
    ├ Services（7カード：AI顧問、事業計画、SNS運用、LP制作、LINE施策、開発支援、教育研修）
    ├ KPI Highlights（サービス毎の定量データ）
    ├ Case Studies（3件 + スライダー）
    ├ Process / Flow（5ステップ）
    ├ Voice / Testimonials
    ├ About Us（代表メッセージ＆チーム紹介）
    ├ Blog Teaser（3本）
    ├ Contact CTA（フォーム + SNSリンク）
    └ Footer
```

## 5. デザイン要件

### 5.1 カラーパレット（確定）

| 役割                                       | カラー    | HEX       |
| ---------------------------------------- | ------ | --------- |
| Base                                     | ホワイト   | #FFFFFF   |
| Primary                                  | ブルー    | #007BFF\* |
| Secondary                                | グリーン   | #28C76F\* |
| Text                                     | ダークグレー | #111111   |
|                                          |        |           |
| \*実際のHEXはデザイナーと調整可（ブルー↔グリーンのグラデーションも検討）。 |        |           |

### 5.2 トーン＆マナー

- **レイアウト**: 余白を活かしたクリーンデザイン＋大胆な見出し（LIGインスパイア）
- **フォント**: 日本語 *Noto Sans JP*、英字 *Inter*
- **アニメーション**:
  - Hero：フェード＋パララックス
  - Section in：スクロール連動カウンター
  - CTA：ホバーでスケールアップ

## 6. サービス概要 & KPI (★NEW)

| サービス       | USP                     | 実績・KPI                            |
| ---------- | ----------------------- | --------------------------------- |
| **AI顧問**   | ツール選定から業務フロー実装まで伴走      | 平均\*\*70%\**工数削減（12種業務で50‑83%削減*） |
| **LP制作**   | 企画・デザイン・コーディングをAI支援で高速化 | **3営業日**で初稿納品、Core Web Vitals 90+ |
| **LINE施策** | スタンプラリーや予約など独自アプリ開発     | 運用アカウント**友だち20,000人超**、CVR改善×1.4  |

> \*詳細は付録A「Efficiency Impact Table」を参照。

## 7. コンテンツ要件

| セクション          | 要素                  | 担当                | 状態 |
| -------------- | ------------------- | ----------------- | -- |
| Hero           | キャッチコピー・背景ビジュアル     | ChatGPT草案→daiki校正 | 🔲 |
| Services       | 7カードの見出し＋本文（70–90字） | daiki             | 🔲 |
| KPI Highlights | 上表の数値をインフォグラフ化      | デザイナー             | 🔲 |
| Case Studies   | 事例概要＋KPI            | daiki             | 🔲 |
| Testimonials   | 顧客コメント3件            | 営業チーム             | 🔲 |
| Blog Teaser    | 最新記事タイトル・サムネ        | CMS自動             | 🔳 |

## 8. 機能要件

1. **レスポンシブ / モバイルファースト**（Tailwind CSS）
2. **問い合わせフォーム**：HubSpot API連携、reCAPTCHA v3
3. **CMS**：Headless（Sanity / Strapi 選定中）
4. **アナリティクス**：GA4 + Microsoft Clarity
5. **パフォーマンス**：Lighthouse Performance 90+、CLS < 0.1
6. **アクセシビリティ**：WCAG 2.1 AA

## 9. 非機能要件

- ページロード：TTFB < 100ms（Vercel Edge）
- SEO：Core Web Vitals基準クリア＋構造化データ
- セキュリティ：HTTPS/TLS1.3、CSP設定

## 10. 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript + TailwindCSS + shadcn/ui
- **ホスティング**: Vercel (Edge Functions)
- **CI/CD**: GitHub Actions
- **デザインツール**: Figma → Zeplin

## 11. 外部連携・埋め込み

- TikTokフィード（@sogashacho）
- LINEミニアプリ導線（スタンプラリー）
- Calendly 埋め込み（相談予約）

## 12. マイルストーン

| Phase          | 期間   | 主要成果物                    |
| -------------- | ---- | ------------------------ |
| Kickoff        | W1   | 要件確定・スケジュール（本ドキュメントv1.0） |
| IA & Wireframe | W2   | サイトマップ・ワイヤー              |
| Visual Design  | W3   | Figmaハイフィデル comps        |
| Development    | W4–5 | コーディング完了・レビュー            |
| Launch         | W6   | 本番公開 & QA                |

## 13. 今後の確認事項（残項目）

1. **CMS選定**（Sanity / Strapi / 他）
2. **フォーム送信後のThank Youフロー**（自動DL資料有無）
3. **公開希望日 & イベント**（キャンペーン併用など）

## 付録A. Efficiency Impact Table（抜粋）

| 業務                 | 導入前 → 導入後    | 削減率      |
| ------------------ | ------------ | -------- |
| ECサイト顧客コメント返信      | 2h/日 → 30m/日 | **‑75%** |
| YouTube動画マルチコンテンツ化 | 1h/本 → 30m/本 | **‑50%** |
| YouTube動画→SEO記事化   | 5h/本 → 2h/本  | **‑60%** |
| DM作成               | 30m/本 → 5m/本 | **‑83%** |
| Web広告クリエイティブ       | 30m/本 → 5m/本 | **‑83%** |
| ...                | ...          | ...      |

*フルテーブルは別途スプレッドシート共有予定。*

---

*本仕様書は継続的にアップデート予定。コメント歓迎！*

