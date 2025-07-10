# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Sadame Inc. (株式会社さだめ) company website - a modern landing page built with vanilla HTML, CSS, and JavaScript, inspired by LIG Inc.'s design aesthetic.

## Development Setup

### Running the Development Server
This is a static site with no build process. To run locally:
```bash
# Using Python (if available)
python3 -m http.server 8000

# Or use VS Code Live Server extension
# Right-click on index.html → "Open with Live Server"
```

### Key Commands
- **Linting**: Currently no linting setup. When implementing fixes, ensure:
  - Consistent 4-space indentation in JavaScript
  - CSS properties follow the existing order pattern
  - Japanese comments are preserved

- **Testing**: No automated tests. Manual testing checklist in `test-features.md`

## Architecture Overview

### Core Files Structure
```
├── index.html      # Main landing page (1500+ lines)
├── style.css       # All styles (2300+ lines) 
├── script.js       # All JavaScript (1500+ lines)
└── pitch-timer/    # Separate mini-app for business pitch timing
```

### JavaScript Architecture
The codebase uses a modular function pattern with initialization on DOMContentLoaded:

1. **Initialization Flow** (`script.js`):
   - `initViewportHeight()` - Manages viewport units for mobile browsers
   - `initSmoothScrolling()` - Section-based smooth scroll
   - `initScrollAnimations()` - Intersection Observer animations
   - `initMobileMenu()` - Mobile navigation handling
   - `initSectionSnap()` - Scroll snap with indicators
   - `initLogoScrollToTop()` - Logo click/hover effects

2. **Key Features**:
   - **Scroll System**: Custom scroll-snap implementation with section indicators
   - **Particle Effects**: Dynamic particle burst on logo interaction
   - **Responsive Scaling**: Content scales based on viewport height when < 900px
   - **Mobile Handling**: Separate touch event handling for mobile devices

3. **Critical Functions**:
   - `createParticleBurst()` - Logo animation effects
   - `handleSectionSnap()` - Section scroll locking
   - `updateActiveIndicator()` - Section navigation dots

### CSS Architecture
- Uses CSS custom properties extensively for theming
- Mobile-first responsive design with breakpoints at 768px and 1024px
- Section-based layout with `.section-snap` classes for full-height sections
- Heavy use of CSS animations and transitions

### Current Issues

1. **Mobile Scroll Bug**: After clicking the logo on mobile devices (≤480px), scrolling becomes disabled. The issue appears to be related to conflicting event handlers between the mobile menu system and particle effects.

2. **Performance Concerns**: Multiple scroll event listeners without proper cleanup, potential memory leaks from particle animations.

## Development Guidelines

### When Making Changes
1. **Preserve Japanese Content**: All text content and comments in Japanese should remain unchanged
2. **Test Responsive Behavior**: Always test at mobile (≤768px), tablet, and desktop breakpoints
3. **Check Scroll Functionality**: Ensure smooth scrolling works after any JavaScript changes
4. **Particle Effects**: Currently unified code for all devices - maintain this approach

### Known Gotchas
- The logo has forced sizing with `!important` flags due to conflicting styles
- Mobile menu uses `overflow: hidden` on body - this can interfere with other features
- Multiple initialization functions run on page load - order matters
- WordPress theme files exist but the main site runs as standalone HTML

### Testing Approach
Given no automated testing, manually verify:
1. Logo hover/click animations work correctly
2. Smooth scrolling between sections
3. Mobile menu opens/closes properly
4. All carousels function with touch/swipe
5. KPI counter animations trigger on scroll
6. Video background falls back gracefully

## WordPress Integration
The project includes WordPress theme files (`functions.php`, `header.php`, `footer.php`) but the main landing page operates independently. The ACF (Advanced Custom Fields) configuration suggests content management capabilities that aren't currently utilized in the static version.

## Development Philosophy (ビジネス視点での開発方針)

### 優先順位の考え方
- **最優先事項**: 顧客満足度
- 機能追加や修正の判断は、エンドユーザーへの価値提供を基準とする

### 開発アプローチ
- **スピード重視**: スピード8：品質2の割合
- **反復型開発**: まず動くものを作ってから修正・改善
- 完璧を求めすぎず、素早くリリースしてフィードバックを得る

### 成果の評価基準
- 要件定義（REQUIREMENTS.md）に沿った成果物であること
- 定められた機能が正しく動作すること

### コミュニケーションスタイル
- **技術説明**: 詳細な技術的説明を含める
- **問題解決**: 問題が発生した場合は、深く分析して最適な解決案を1つ提示
- 複数の選択肢より、推奨案を明確に示す

### 自律的作業モード
以下のキーワードで指示された場合は、細かい確認を取らずに自律的に作業を進める：
- **「一気に進めて」** - 要件を深く理解し、可能な限り完成まで進める
- **「自動で進めて」** - 細かい実装判断は任せて、大きな方向性のみ確認
- **「確認不要で」** - 途中確認なしで最後まで実装

**自律モード時の動作**：
1. 要件を深く分析して全体像を把握
2. 必要な実装をすべてリストアップ
3. 優先順位を自動判断
4. エラーが出ても自力で解決を試みる
5. 完了時に実施内容をまとめて報告

**例**：
```
❌ 通常モード: 「この機能を実装してください」→ 都度確認しながら進める
✅ 自律モード: 「この機能を一気に進めて」→ 完成まで自律的に実装
```

### リスク管理
- **ブランチ作成基準**: 元の仕様に戻すまでに30分以上かかる変更
- リスクのある変更は必ず別ブランチで開発
- 例：
  ```bash
  git checkout -b feature/risky-change
  # 開発作業
  git checkout main  # 問題があれば簡単に戻せる
  ```

### 実践例
```bash
# 小さな修正（30分以内で戻せる）
# → 直接 main ブランチで作業

# 大きな機能追加やアーキテクチャ変更
git checkout -b feature/major-update
# 作業完了後、動作確認してからマージ
```

### コンテキスト管理
- **引き継ぎ書の作成**: コンテキストウィンドウが限界に近づいた際は、必ず次のセッションのための詳細な引き継ぎ書を作成する
- **引き継ぎ書の内容**:
  1. 現在進行中の作業内容と進捗状況
  2. 直面している問題と試した解決策
  3. 次に実行すべきアクション
  4. 重要な変更箇所とその理由
  5. 未解決の課題と優先順位
  6. 参考になるファイルパスや行番号
- **保存場所**: 引き継ぎ内容は会話の最後に明確に記載し、次回のセッション開始時に参照できるようにする

### セキュリティ設定（推奨）
Claude Codeで危険なコマンドを制限するには、`~/.claude.json`に以下の設定を追加することを推奨：

```json
{
  "restrictions": {
    "disallowedCommands": [
      "rm -rf /",
      "sudo rm -rf",
      "chmod -R 777 /",
      "mkfs",
      "dd if=/dev/zero",
      ":(){:|:&};:",  // Fork bomb
      "curl | bash",   // 未検証スクリプトの実行
      "wget -O- | sh"  // 未検証スクリプトの実行
    ],
    "requireConfirmation": [
      "rm -rf",
      "git push --force",
      "git reset --hard",
      "DROP DATABASE",
      "DELETE FROM",
      "TRUNCATE"
    ]
  }
}
```

**重要な制限事項**：
- システム全体に影響を与えるコマンドは実行前に必ず確認
- データベースの破壊的操作は慎重に
- 本番環境への直接デプロイは避ける
- 機密情報を含むファイルの操作は細心の注意を払う