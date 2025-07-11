# フォーム機能強化 - バックエンド統合ガイド

## 概要

このドキュメントは、強化されたコンタクトフォームとバックエンドAPIを統合するためのガイドです。

## 必要な設定

### 1. 環境変数

以下の環境変数を設定してください：

```bash
# reCAPTCHA v3
RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here

# Chatwork API
CHATWORK_API_TOKEN=your_chatwork_api_token_here
CHATWORK_ROOM_ID=your_chatwork_room_id_here

# Optional: Webhook URL
CHATWORK_WEBHOOK_URL=your_webhook_url_here
```

### 2. reCAPTCHA設定

1. [Google reCAPTCHA](https://www.google.com/recaptcha/admin/)にアクセス
2. 新しいサイトを登録（v3を選択）
3. ドメインを追加：`sadame.com`, `localhost`（開発用）
4. サイトキーとシークレットキーを取得

### 3. Chatwork設定

1. [Chatwork API](https://developer.chatwork.com/)でAPIトークンを取得
2. 通知を送信するルームのIDを確認
3. ルームにAPI用のボットを追加

## API エンドポイント実装例

### Node.js + Express

```javascript
const express = require('express');
const { sendChatworkNotification, verifyRecaptcha, validateSpamScore } = require('./form-config.js');

const app = express();
app.use(express.json());

app.post('/api/contact', async (req, res) => {
    try {
        const { recaptcha_token, ...formData } = req.body;
        
        // reCAPTCHA検証
        const recaptchaResult = await verifyRecaptcha(recaptcha_token, req.ip);
        const spamValidation = validateSpamScore(recaptchaResult, 0.5);
        
        if (!spamValidation.valid) {
            return res.status(400).json({
                success: false,
                message: 'セキュリティ検証に失敗しました'
            });
        }
        
        // フォームデータ検証
        if (!formData.name || !formData.email || !formData.company) {
            return res.status(400).json({
                success: false,
                message: '必須項目が入力されていません'
            });
        }
        
        // Chatwork通知送信
        await sendChatworkNotification(formData);
        
        // データベースに保存（オプション）
        // await saveContactForm(formData);
        
        res.json({
            success: true,
            message: 'お問い合わせを受け付けました'
        });
        
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'サーバーエラーが発生しました'
        });
    }
});
```

### PHP実装例

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

// reCAPTCHA検証
function verifyRecaptcha($token) {
    $secretKey = $_ENV['RECAPTCHA_SECRET_KEY'];
    
    $response = file_get_contents('https://www.google.com/recaptcha/api/siteverify?' . http_build_query([
        'secret' => $secretKey,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR']
    ]));
    
    return json_decode($response, true);
}

// Chatwork通知送信
function sendChatworkNotification($formData) {
    $apiToken = $_ENV['CHATWORK_API_TOKEN'];
    $roomId = $_ENV['CHATWORK_ROOM_ID'];
    
    $message = "[info][title]新しいお問い合わせ[/title]\n";
    $message .= "会社名: " . $formData['company'] . "\n";
    $message .= "お名前: " . $formData['name'] . "\n";
    $message .= "メール: " . $formData['email'] . "\n";
    $message .= "電話番号: " . ($formData['phone'] ?? '未入力') . "\n";
    $message .= "相談内容: " . getServiceLabel($formData['service']) . "\n\n";
    $message .= "詳細:\n" . ($formData['message'] ?? '未入力') . "\n";
    $message .= "送信日時: " . date('Y-m-d H:i:s') . "\n[/info]";
    
    $postdata = http_build_query(['body' => $message]);
    
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "X-ChatWorkToken: $apiToken\r\nContent-Type: application/x-www-form-urlencoded\r\n",
            'content' => $postdata
        ]
    ]);
    
    return file_get_contents("https://api.chatwork.com/v2/rooms/$roomId/messages", false, $context);
}

// メイン処理
try {
    // reCAPTCHA検証
    $recaptchaResult = verifyRecaptcha($input['recaptcha_token']);
    
    if (!$recaptchaResult['success'] || $recaptchaResult['score'] < 0.5) {
        throw new Exception('セキュリティ検証に失敗しました');
    }
    
    // フォームデータ検証
    if (empty($input['name']) || empty($input['email']) || empty($input['company'])) {
        throw new Exception('必須項目が入力されていません');
    }
    
    // Chatwork通知送信
    sendChatworkNotification($input);
    
    echo json_encode([
        'success' => true,
        'message' => 'お問い合わせを受け付けました'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
```

## フロントエンド設定更新

### 1. reCAPTCHAサイトキーの設定

`index.html`の以下の部分を更新：

```html
<!-- reCAPTCHA v3 -->
<script src="https://www.google.com/recaptcha/api.js?render=YOUR_ACTUAL_SITE_KEY" async defer></script>
```

### 2. JavaScript設定の更新

`script.js`の以下の部分を更新：

```javascript
// Get reCAPTCHA token
async function getReCaptchaToken() {
    return new Promise((resolve, reject) => {
        if (typeof grecaptcha === 'undefined') {
            reject(new Error('reCAPTCHA not loaded'));
            return;
        }
        
        grecaptcha.ready(() => {
            grecaptcha.execute('YOUR_ACTUAL_SITE_KEY', { action: 'contact_form' })
                .then(token => resolve(token))
                .catch(error => reject(error));
        });
    });
}

// Submit form data
async function submitFormData(data) {
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
}
```

## セキュリティ考慮事項

### 1. レート制限

API呼び出しにレート制限を実装：

```javascript
// Express.js example with express-rate-limit
const rateLimit = require('express-rate-limit');

const contactFormLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分
    max: 5, // 最大5回のリクエスト
    message: 'Too many contact form submissions, please try again later.'
});

app.use('/api/contact', contactFormLimiter);
```

### 2. 入力値検証

すべての入力値に対して厳密な検証を実装：

```javascript
function validateInput(data) {
    const sanitized = {};
    
    // HTMLタグを除去
    sanitized.name = data.name.replace(/<[^>]*>/g, '').trim();
    sanitized.company = data.company.replace(/<[^>]*>/g, '').trim();
    
    // メールアドレス検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        throw new Error('Invalid email format');
    }
    sanitized.email = data.email.trim();
    
    return sanitized;
}
```

### 3. CORS設定

適切なCORS設定を実装：

```javascript
app.use(cors({
    origin: ['https://sadame.com', 'https://www.sadame.com'],
    methods: ['POST'],
    allowedHeaders: ['Content-Type']
}));
```

## テスト方法

### 1. 開発環境でのテスト

```bash
# テスト用のreCAPTCHAキー（常に成功）
RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

### 2. Chatwork通知テスト

```javascript
// テスト用の関数
async function testChatworkNotification() {
    const testData = {
        company: 'テスト株式会社',
        name: 'テスト太郎',
        email: 'test@example.com',
        phone: '090-1234-5678',
        service: 'ai-consulting',
        message: 'これはテストメッセージです。',
        timestamp: new Date().toISOString()
    };
    
    try {
        await sendChatworkNotification(testData);
        console.log('Chatwork notification sent successfully');
    } catch (error) {
        console.error('Failed to send Chatwork notification:', error);
    }
}
```

## デプロイ前チェックリスト

- [ ] 本番用のreCAPTCHAキーに更新
- [ ] Chatwork APIトークンとルームIDを設定
- [ ] CORS設定を本番ドメインに更新
- [ ] レート制限の設定
- [ ] SSL証明書の設定
- [ ] エラーログの設定
- [ ] バックアップの設定

## トラブルシューティング

### よくある問題

1. **reCAPTCHA検証失敗**
   - サイトキーが正しいか確認
   - ドメインがreCAPTCHAに登録されているか確認

2. **Chatwork通知が送信されない**
   - APIトークンの権限を確認
   - ルームIDが正しいか確認
   - APIレート制限に達していないか確認

3. **CORS エラー**
   - サーバーのCORS設定を確認
   - プリフライトリクエストの処理を確認

## サポート

問題が発生した場合は、以下の情報を含めてお問い合わせください：

- エラーメッセージ
- ブラウザの開発者ツールのコンソールログ
- サーバーのエラーログ
- 実行環境の詳細