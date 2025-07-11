// フォーム設定ファイル
// 本番環境でのAPI統合用の設定

const FORM_CONFIG = {
    // reCAPTCHA設定
    recaptcha: {
        siteKey: '6LfaCn8rAAAAAHEyoB0KVEtsXPIm_iSRMZB9gk_v', // 本番環境で設定
        secretKey: 'RECAPTCHA_SECRET_KEY_PLACEHOLDER' // サーバーサイドで使用
    },
    
    // チャットワーク設定
    chatwork: {
        apiToken: 'CHATWORK_API_TOKEN_PLACEHOLDER', // 本番環境で設定
        roomId: 'CHATWORK_ROOM_ID_PLACEHOLDER', // 通知先のルームID
        webhookUrl: 'CHATWORK_WEBHOOK_URL_PLACEHOLDER' // Webhook URL（オプション）
    },
    
    // フォーム送信先設定
    api: {
        endpoint: '/api/contact', // バックエンドのエンドポイント
        timeout: 10000, // タイムアウト（ミリ秒）
        retryAttempts: 3 // リトライ回数
    },
    
    // スパム防止設定
    security: {
        honeypot: true, // ハニーポット有効化
        rateLimiting: {
            enabled: true,
            maxRequests: 5, // 最大リクエスト数
            windowMs: 900000 // 15分間
        },
        blockedDomains: [
            // スパムが多いドメインを追加
            'example-spam.com',
            'temp-mail.org'
        ]
    },
    
    // 通知設定
    notifications: {
        chatwork: {
            enabled: true,
            template: `[info][title]新しいお問い合わせ[/title]
会社名: {company}
お名前: {name}
メール: {email}
電話番号: {phone}
相談内容: {service}

詳細:
{message}

送信日時: {timestamp}
[/info]`
        },
        email: {
            enabled: false, // 必要に応じて有効化
            to: 'contact@sadame.com',
            subject: '【さだめ】新しいお問い合わせ'
        }
    }
};

// 環境変数から設定を読み込む関数
function loadConfig() {
    if (typeof process !== 'undefined' && process.env) {
        // Node.js環境での設定読み込み
        return {
            ...FORM_CONFIG,
            recaptcha: {
                siteKey: process.env.RECAPTCHA_SITE_KEY || FORM_CONFIG.recaptcha.siteKey,
                secretKey: process.env.RECAPTCHA_SECRET_KEY || FORM_CONFIG.recaptcha.secretKey
            },
            chatwork: {
                apiToken: process.env.CHATWORK_API_TOKEN || FORM_CONFIG.chatwork.apiToken,
                roomId: process.env.CHATWORK_ROOM_ID || FORM_CONFIG.chatwork.roomId,
                webhookUrl: process.env.CHATWORK_WEBHOOK_URL || FORM_CONFIG.chatwork.webhookUrl
            }
        };
    }
    return FORM_CONFIG;
}

// チャットワーク通知関数
async function sendChatworkNotification(formData) {
    const config = loadConfig();
    
    if (!config.chatwork.apiToken || !config.chatwork.roomId) {
        throw new Error('Chatwork configuration missing');
    }
    
    const message = config.notifications.chatwork.template
        .replace('{company}', formData.company || '未入力')
        .replace('{name}', formData.name || '未入力')
        .replace('{email}', formData.email || '未入力')
        .replace('{phone}', formData.phone || '未入力')
        .replace('{service}', getServiceLabel(formData.service))
        .replace('{message}', formData.message || '未入力')
        .replace('{timestamp}', new Date(formData.timestamp).toLocaleString('ja-JP'));
    
    const response = await fetch(`https://api.chatwork.com/v2/rooms/${config.chatwork.roomId}/messages`, {
        method: 'POST',
        headers: {
            'X-ChatWorkToken': config.chatwork.apiToken,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `body=${encodeURIComponent(message)}`
    });
    
    if (!response.ok) {
        throw new Error(`Chatwork API error: ${response.status}`);
    }
    
    return response.json();
}

// サービス選択肢のラベル変換
function getServiceLabel(serviceValue) {
    const serviceLabels = {
        'ai-consulting': 'AI顧問サービス',
        'business-plan': '事業計画策定',
        'sns-management': 'SNS運用',
        'web-development': 'LP・Web制作',
        'line-solution': 'LINE施策',
        'development': '開発支援',
        'education': '教育・研修',
        'other': 'その他'
    };
    
    return serviceLabels[serviceValue] || serviceValue;
}

// reCAPTCHA検証関数（サーバーサイド用）
async function verifyRecaptcha(token, remoteip = null) {
    const config = loadConfig();
    
    const params = new URLSearchParams({
        secret: config.recaptcha.secretKey,
        response: token
    });
    
    if (remoteip) {
        params.append('remoteip', remoteip);
    }
    
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    });
    
    const result = await response.json();
    
    return {
        success: result.success,
        score: result.score, // v3の場合
        action: result.action, // v3の場合
        challengeTs: result.challenge_ts,
        hostname: result.hostname,
        errorCodes: result['error-codes']
    };
}

// スパム検証関数
function validateSpamScore(recaptchaResult, threshold = 0.5) {
    if (!recaptchaResult.success) {
        return { valid: false, reason: 'reCAPTCHA verification failed' };
    }
    
    if (recaptchaResult.score < threshold) {
        return { valid: false, reason: 'Low reCAPTCHA score (potential spam)' };
    }
    
    return { valid: true };
}

// モジュールエクスポート（Node.js環境用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FORM_CONFIG,
        loadConfig,
        sendChatworkNotification,
        verifyRecaptcha,
        validateSpamScore,
        getServiceLabel
    };
}

// ブラウザ環境用グローバル変数
if (typeof window !== 'undefined') {
    window.FORM_CONFIG = FORM_CONFIG;
    window.loadConfig = loadConfig;
    window.getServiceLabel = getServiceLabel;
}