# ピッチタイマー WordPress アップロード詳細ガイド

## 準備されたファイル

1. **wordpress-content.html** - WordPressの投稿/固定ページに貼り付けるHTMLコンテンツ
2. **wordpress-custom.css** - WordPressのカスタムCSSに追加するスタイル
3. **script-wordpress.js** - WordPress用に音声ファイルパスを修正したJavaScript
4. **voice/** フォルダ - 音声ファイル（start.mp3, end.mp3, 30.mp3, 10.mp3）

## アップロード手順

### ステップ1: 音声ファイルのアップロード

1. WordPress管理画面にログイン
2. 「メディア」→「新規追加」をクリック
3. voice フォルダ内の4つの音声ファイルをドラッグ&ドロップ
   - start.mp3
   - end.mp3
   - 30.mp3
   - 10.mp3
4. アップロード完了後、各ファイルのURLをコピー（後で使用）

### ステップ2: JavaScriptファイルの音声パス修正

1. `script-wordpress.js` を開く
2. 以下の部分を修正：
   ```javascript
   // 修正前
   const timeUpAudio = new Audio('YOUR_WORDPRESS_SITE_URL/wp-content/uploads/YEAR/MONTH/end.mp3');
   
   // 修正後（実際のURLに置き換え）
   const timeUpAudio = new Audio('https://yoursite.com/wp-content/uploads/2024/12/end.mp3');
   ```
3. 4つの音声ファイル全て（timeUpAudio, startAudio, warning30Audio, warning10Audio）のURLを実際のメディアライブラリのURLに変更

### ステップ3: WordPress投稿/固定ページの作成

1. 「投稿」または「固定ページ」→「新規追加」
2. タイトルを入力（例：「車座商談タイマー」）
3. エディタを「テキスト」または「HTML」モードに切り替え
4. `wordpress-content.html` の内容をコピー&ペースト
5. **公開はまだしない**

### ステップ4: カスタムCSSの追加

**方法A: テーマカスタマイザーを使用**
1. 「外観」→「カスタマイズ」
2. 「追加CSS」をクリック
3. `wordpress-custom.css` の内容をコピー&ペースト
4. 「公開」をクリック

**方法B: 子テーマを使用**
1. 子テーマの `style.css` を開く
2. `wordpress-custom.css` の内容を末尾に追加
3. ファイルを保存してアップロード

### ステップ5: JavaScriptの追加

**方法A: プラグインを使用（推奨）**
1. 「Insert Headers and Footers」プラグインをインストール
2. プラグインを有効化
3. 「設定」→「Insert Headers and Footers」
4. 「Scripts in Footer」欄に以下を追加：
   ```html
   <script>
   // script-wordpress.js の内容をここに貼り付け
   </script>
   ```

**方法B: 子テーマのfunctions.phpを使用**
1. 子テーマの `functions.php` を開く
2. 以下のコードを追加：
   ```php
   function enqueue_pitch_timer_script() {
       wp_enqueue_script('pitch-timer', get_stylesheet_directory_uri() . '/js/script-wordpress.js', array(), '1.0.0', true);
   }
   add_action('wp_enqueue_scripts', 'enqueue_pitch_timer_script');
   ```
3. 子テーマの `js` フォルダに `script-wordpress.js` をアップロード

### ステップ6: 投稿/固定ページの公開

1. 作成した投稿/固定ページに戻る
2. 「公開」をクリック
3. 公開されたページにアクセスしてテスト

## 動作確認

1. ページが正しく表示されるか確認
2. 設定パネル（ピッチ時間、発表者数、テーマカラー）が動作するか確認
3. タイマーが正しく動作するか確認
4. 音声ファイルが正しく再生されるか確認

## トラブルシューティング

### 音声が再生されない場合
- 音声ファイルのURLが正しいか確認
- メディアライブラリで音声ファイルが正しくアップロードされているか確認
- ブラウザのコンソール（F12）でエラーメッセージを確認

### スタイルが適用されない場合
- カスタムCSSが正しく追加されているか確認
- 他のテーマやプラグインとの競合がないか確認

### JavaScriptが動作しない場合
- JavaScriptが正しく読み込まれているか確認
- ブラウザのコンソールでエラーメッセージを確認
- 他のプラグインとの競合がないか確認

## 推奨プラグイン

- **Insert Headers and Footers**: JavaScriptの追加に便利
- **Custom CSS JS**: カスタムCSS/JSの管理に便利
- **WP File Manager**: ファイルの管理に便利

## 注意点

1. 音声ファイルのパスは環境に応じて変更が必要
2. 他のテーマやプラグインとの競合に注意
3. WordPress更新時にカスタマイズが失われる可能性があるため、子テーマの使用を推奨
4. 定期的にバックアップを取ることを推奨