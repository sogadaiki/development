# お問い合わせフォーム セットアップガイド

このガイドでは、株式会社さだめのお問い合わせフォームを正常に動作させるためのセットアップ手順を説明します。

## 必要な準備

### 1. Google reCAPTCHA v3の設定

1. [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)にアクセス
2. 新しいサイトを登録：
   - ラベル: `株式会社さだめ`
   - reCAPTCHAタイプ: `reCAPTCHA v3`
   - ドメイン: `sadame.com`, `www.sadame.com`, `localhost`（開発用）
3. サイトキーとシークレットキーを取得

### 2. チャットワークAPIの設定

1. [ChatWork APIトークン管理画面](https://www.chatwork.com/service/packages/chatwork/subpackages/api/token.php)にアクセス
2. APIトークンを生成
3. 通知を送信したいルームIDを確認
   - ルームURLの`#!rid`以降の数字がルームID
   - 例: `https://www.chatwork.com/#!rid123456789` → ルームIDは `123456789`

### 3. メール送信の設定

#### Gmailを使用する場合
1. Googleアカウントで[2段階認証を有効化](https://myaccount.google.com/security)
2. [アプリパスワードを生成](https://myaccount.google.com/apppasswords)
3. 生成されたパスワードを`SMTP_PASS`に設定

#### SendGridを使用する場合
1. [SendGrid](https://sendgrid.com/)にサインアップ
2. APIキーを生成
3. 以下の設定を使用：
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your_sendgrid_api_key
   ```

## セットアップ手順

### 1. 依存パッケージのインストール

```bash
# プロジェクトディレクトリに移動
cd /path/to/sadame

# package.jsonが存在しない場合は初期化
npm init -y

# 必要なパッケージをインストール
npm install express cors express-rate-limit nodemailer dotenv
```

### 2. 環境変数の設定

```bash
# .env.exampleをコピーして.envを作成
cp .env.example .env

# .envファイルを編集して実際の値を設定
# 必須項目：
# - RECAPTCHA_SITE_KEY
# - RECAPTCHA_SECRET_KEY
# - CHATWORK_API_TOKEN
# - CHATWORK_ROOM_ID
# - SMTP設定（SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS）
# - ADMIN_EMAIL
```

### 3. フロントエンドの設定

1. `index.html`のreCAPTCHAサイトキーを更新：
```html
<!-- 18行目のプレースホルダーを実際のサイトキーに置き換え -->
<script src="https://www.google.com/recaptcha/api.js?render=YOUR_ACTUAL_SITE_KEY" async defer></script>
```

2. `form-config.js`のプレースホルダーを更新（オプション）：
```javascript
// 本番環境では環境変数から読み込まれるため、この手順は開発環境のみ必要
recaptcha: {
    siteKey: 'YOUR_ACTUAL_SITE_KEY',
    // secretKeyはサーバーサイドのみで使用
}
```

### 4. APIサーバーの起動

```bash
# 環境変数を読み込んでサーバーを起動
node api/contact.js

# または、dotenvを使用して起動
node -r dotenv/config api/contact.js

# PM2を使用する場合（本番環境推奨）
npm install -g pm2
pm2 start api/contact.js --name "sadame-contact-api"
```

### 5. 動作確認

1. ブラウザで `http://localhost:8000` にアクセス（静的サーバー）
2. お問い合わせフォームに移動
3. テスト送信を実行
4. 以下を確認：
   - 管理者メールアドレスに通知メールが届く
   - 入力したメールアドレスに自動返信メールが届く
   - チャットワークに通知が投稿される

## 本番環境へのデプロイ

### 1. サーバー要件

- Node.js 14以上
- SSL証明書（HTTPS必須）
- リバースプロキシ（Nginx推奨）

### 2. Nginxの設定例

```nginx
server {
    listen 443 ssl http2;
    server_name sadame.com www.sadame.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    # 静的ファイル
    location / {
        root /var/www/sadame;
        try_files $uri $uri/ /index.html;
    }

    # APIエンドポイント
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. セキュリティ設定

1. **環境変数の保護**
   - `.env`ファイルをGitに含めない（`.gitignore`に追加）
   - 本番サーバーでは環境変数を安全に管理

2. **CORS設定**
   - `api/contact.js`の`ALLOWED_ORIGINS`を本番ドメインのみに制限

3. **レート制限**
   - 現在の設定: 15分間に5回まで
   - 必要に応じて調整

## トラブルシューティング

### メールが送信されない

1. SMTP設定を確認
2. ファイアウォールでポート587/465がブロックされていないか確認
3. メールプロバイダーの送信制限を確認

### チャットワーク通知が送信されない

1. APIトークンが有効か確認
2. ルームIDが正しいか確認
3. APIトークンにメッセージ送信権限があるか確認

### reCAPTCHAエラー

1. サイトキーとシークレットキーが一致しているか確認
2. ドメインが登録されているか確認
3. ブラウザのコンソールでエラーを確認

### CORSエラー

1. APIサーバーが起動しているか確認
2. `ALLOWED_ORIGINS`に現在のドメインが含まれているか確認
3. プロトコル（http/https）が一致しているか確認

## サポート

問題が解決しない場合は、以下の情報を含めてお問い合わせください：

- エラーメッセージ（ブラウザコンソール、サーバーログ）
- 環境情報（Node.jsバージョン、OS）
- 実行した手順

---

最終更新: 2025年1月