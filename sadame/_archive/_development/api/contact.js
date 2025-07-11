// サンプルAPI実装（Node.js + Express）
// 実際の本番環境では、このファイルを参考にバックエンドAPIを実装してください

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { sendChatworkNotification, verifyRecaptcha, validateSpamScore } = require('../form-config.js');
const { sendEmail } = require('./email-service.js');

const app = express();

// ミドルウェア設定
app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://sadame.com', 'https://www.sadame.com']
        : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:8000'],
    methods: ['POST'],
    allowedHeaders: ['Content-Type']
}));

// レート制限設定
const contactFormLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分
    max: 5, // 最大5回のリクエスト
    message: {
        success: false,
        message: 'リクエストが多すぎます。しばらく時間をおいて再度お試しください。'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// 入力値サニタイズ関数
function sanitizeInput(data) {
    const sanitized = {};
    
    // HTMLタグを除去し、トリミング
    if (data.company) sanitized.company = data.company.replace(/<[^>]*>/g, '').trim();
    if (data.name) sanitized.name = data.name.replace(/<[^>]*>/g, '').trim();
    if (data.email) sanitized.email = data.email.replace(/<[^>]*>/g, '').trim();
    if (data.phone) sanitized.phone = data.phone.replace(/<[^>]*>/g, '').trim();
    if (data.service) sanitized.service = data.service.replace(/<[^>]*>/g, '').trim();
    if (data.message) sanitized.message = data.message.replace(/<[^>]*>/g, '').trim();
    
    return sanitized;
}

// バリデーション関数
function validateFormData(data) {
    const errors = [];
    
    if (!data.company || data.company.length < 2) {
        errors.push('会社名を正しく入力してください');
    }
    
    if (!data.name || data.name.length < 2) {
        errors.push('お名前を正しく入力してください');
    }
    
    if (!data.email) {
        errors.push('メールアドレスを入力してください');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.push('有効なメールアドレスを入力してください');
        }
    }
    
    if (data.phone) {
        const phoneRegex = /^[\d\-\(\)\+\s]{10,15}$/;
        if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
            errors.push('有効な電話番号を入力してください');
        }
    }
    
    if (!data.service) {
        errors.push('ご相談内容を選択してください');
    }
    
    const validServices = [
        'ai-consulting', 'business-plan', 'sns-management', 
        'web-development', 'line-solution', 'development', 
        'education', 'other'
    ];
    
    if (data.service && !validServices.includes(data.service)) {
        errors.push('無効なサービスが選択されています');
    }
    
    return errors;
}

// スパムドメインチェック
function checkSpamDomain(email) {
    const spamDomains = [
        '10minutemail.com',
        'temp-mail.org',
        'guerrillamail.com',
        'mailinator.com',
        'throwaway.email'
    ];
    
    const domain = email.split('@')[1];
    return spamDomains.includes(domain.toLowerCase());
}

// メインのコンタクトフォームエンドポイント
app.post('/api/contact', contactFormLimiter, async (req, res) => {
    try {
        console.log('Contact form submission received:', {
            timestamp: new Date().toISOString(),
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
        
        const { recaptcha_token, ...rawFormData } = req.body;
        
        // 入力値サニタイズ
        const formData = sanitizeInput(rawFormData);
        
        // 基本バリデーション
        const validationErrors = validateFormData(formData);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: validationErrors.join(', '),
                errors: validationErrors
            });
        }
        
        // スパムドメインチェック
        if (checkSpamDomain(formData.email)) {
            console.log('Spam domain detected:', formData.email);
            return res.status(400).json({
                success: false,
                message: 'このメールドメインからの送信は受け付けておりません'
            });
        }
        
        // reCAPTCHA検証
        if (!recaptcha_token) {
            return res.status(400).json({
                success: false,
                message: 'セキュリティ検証が必要です'
            });
        }
        
        try {
            const recaptchaResult = await verifyRecaptcha(recaptcha_token, req.ip);
            const spamValidation = validateSpamScore(recaptchaResult, 0.5);
            
            if (!spamValidation.valid) {
                console.log('reCAPTCHA validation failed:', {
                    reason: spamValidation.reason,
                    score: recaptchaResult.score,
                    action: recaptchaResult.action
                });
                
                return res.status(400).json({
                    success: false,
                    message: 'セキュリティ検証に失敗しました。ページを再読み込みしてお試しください。'
                });
            }
            
            console.log('reCAPTCHA validation successful:', {
                score: recaptchaResult.score,
                action: recaptchaResult.action
            });
            
        } catch (recaptchaError) {
            console.error('reCAPTCHA verification error:', recaptchaError);
            return res.status(500).json({
                success: false,
                message: 'セキュリティ検証でエラーが発生しました'
            });
        }
        
        // タイムスタンプ追加
        const submissionData = {
            ...formData,
            timestamp: new Date().toISOString(),
            ip: req.ip,
            userAgent: req.get('User-Agent')
        };
        
        // メール送信
        try {
            const emailResults = await sendEmail(submissionData);
            console.log('Email notification results:', emailResults);
        } catch (emailError) {
            console.error('Email notification failed:', emailError);
            // メール送信失敗でもフォーム送信は成功とする
        }
        
        // Chatwork通知送信
        try {
            await sendChatworkNotification(submissionData);
            console.log('Chatwork notification sent successfully');
        } catch (chatworkError) {
            console.error('Chatwork notification failed:', chatworkError);
            // Chatwork送信失敗でもフォーム送信は成功とする
        }
        
        // データベース保存（オプション）
        // try {
        //     await saveContactFormToDatabase(submissionData);
        //     console.log('Form data saved to database');
        // } catch (dbError) {
        //     console.error('Database save failed:', dbError);
        // }
        
        // 成功レスポンス
        res.json({
            success: true,
            message: 'お問い合わせを受け付けました。2営業日以内にご連絡いたします。'
        });
        
        console.log('Contact form processed successfully:', {
            company: formData.company,
            email: formData.email,
            service: formData.service
        });
        
    } catch (error) {
        console.error('Contact form processing error:', {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({
            success: false,
            message: 'サーバーでエラーが発生しました。しばらく時間をおいて再度お試しください。'
        });
    }
});

// ヘルスチェックエンドポイント
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'contact-form-api'
    });
});

// 404ハンドラー
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'エンドポイントが見つかりません'
    });
});

// エラーハンドラー
app.use((err, req, res, next) => {
    console.error('Unhandled error:', {
        error: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    });
    
    res.status(500).json({
        success: false,
        message: 'サーバーでエラーが発生しました'
    });
});

// サーバー起動
const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Contact Form API server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

module.exports = app;

/* 
使用方法:

1. 必要なパッケージをインストール:
   npm install express cors express-rate-limit

2. 環境変数を設定:
   RECAPTCHA_SITE_KEY=your_site_key
   RECAPTCHA_SECRET_KEY=your_secret_key
   CHATWORK_API_TOKEN=your_api_token
   CHATWORK_ROOM_ID=your_room_id
   NODE_ENV=production

3. サーバーを起動:
   node api/contact.js

4. フロントエンドから /api/contact にPOSTリクエストを送信

リクエスト例:
{
  "company": "テスト株式会社",
  "name": "山田太郎",
  "email": "yamada@example.com",
  "phone": "090-1234-5678",
  "service": "ai-consulting",
  "message": "AIの導入についてご相談したいです。",
  "recaptcha_token": "reCAPTCHA_token_here"
}
*/