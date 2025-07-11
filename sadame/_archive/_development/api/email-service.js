// メール送信サービス
// Node.js環境で使用する場合のサンプル実装

const nodemailer = require('nodemailer');

// メール送信設定
const createTransporter = () => {
    // Gmail, SendGrid, AWS SES などのSMTPサービスを使用
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

// メールテンプレート
const getEmailTemplate = (formData) => {
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

    const serviceLabel = serviceLabels[formData.service] || formData.service;

    return {
        subject: `【株式会社さだめ】新規お問い合わせ: ${formData.company}様`,
        text: `
新しいお問い合わせを受信しました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ お客様情報
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

会社名: ${formData.company}
お名前: ${formData.name}
メールアドレス: ${formData.email}
電話番号: ${formData.phone || '未入力'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ ご相談内容
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

サービス: ${serviceLabel}

詳細・ご要望:
${formData.message || '未入力'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ システム情報
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

送信日時: ${new Date(formData.timestamp).toLocaleString('ja-JP')}
IPアドレス: ${formData.ip || '不明'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

このメールは自動送信されています。
お客様への返信は、2営業日以内を目安に行ってください。

株式会社さだめ
お問い合わせ管理システム
        `,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Hiragino Sans', 'Meiryo', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #1e293b;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f8f9fa;
            padding: 30px;
            border: 1px solid #dee2e6;
            border-radius: 0 0 5px 5px;
        }
        .section {
            background-color: white;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 5px;
            border: 1px solid #e9ecef;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 2px solid #3b82f6;
        }
        .field {
            margin-bottom: 10px;
        }
        .label {
            font-weight: bold;
            color: #6c757d;
        }
        .value {
            color: #212529;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            font-size: 14px;
            color: #6c757d;
            text-align: center;
        }
        .message-box {
            background-color: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #3b82f6;
            margin-top: 10px;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2 style="margin: 0;">新規お問い合わせ</h2>
        <p style="margin: 5px 0 0;">株式会社さだめ お問い合わせ管理システム</p>
    </div>
    
    <div class="content">
        <div class="section">
            <div class="section-title">お客様情報</div>
            <div class="field">
                <span class="label">会社名:</span>
                <span class="value">${formData.company}</span>
            </div>
            <div class="field">
                <span class="label">お名前:</span>
                <span class="value">${formData.name}</span>
            </div>
            <div class="field">
                <span class="label">メールアドレス:</span>
                <span class="value"><a href="mailto:${formData.email}">${formData.email}</a></span>
            </div>
            <div class="field">
                <span class="label">電話番号:</span>
                <span class="value">${formData.phone || '未入力'}</span>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">ご相談内容</div>
            <div class="field">
                <span class="label">サービス:</span>
                <span class="value">${serviceLabel}</span>
            </div>
            <div class="field">
                <span class="label">詳細・ご要望:</span>
                <div class="message-box">${formData.message || '未入力'}</div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">システム情報</div>
            <div class="field">
                <span class="label">送信日時:</span>
                <span class="value">${new Date(formData.timestamp).toLocaleString('ja-JP')}</span>
            </div>
            <div class="field">
                <span class="label">IPアドレス:</span>
                <span class="value">${formData.ip || '不明'}</span>
            </div>
        </div>
        
        <div class="footer">
            <p>このメールは自動送信されています。<br>
            お客様への返信は、2営業日以内を目安に行ってください。</p>
            <p>&copy; 2025 株式会社さだめ</p>
        </div>
    </div>
</body>
</html>
        `
    };
};

// 自動返信メールテンプレート
const getAutoReplyTemplate = (formData) => {
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

    const serviceLabel = serviceLabels[formData.service] || formData.service;

    return {
        subject: '【株式会社さだめ】お問い合わせを受け付けました',
        text: `
${formData.name} 様

この度は株式会社さだめにお問い合わせいただき、誠にありがとうございます。
以下の内容でお問い合わせを受け付けました。

────────────────────────────────────
■ お問い合わせ内容
────────────────────────────────────

ご相談サービス: ${serviceLabel}

詳細・ご要望:
${formData.message || 'なし'}

────────────────────────────────────

担当者より2営業日以内にご連絡させていただきます。
今しばらくお待ちください。

なお、お急ぎの場合は下記までお電話でお問い合わせください。
TEL: 096-227-6559（平日 9:00-18:00）
Email: support@sadame.info

今後ともよろしくお願いいたします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
株式会社さだめ
〒861-4131 熊本県熊本市南区薄場1-15-22
TEL: 096-227-6559
Email: support@sadame.info
Web: https://sadame.info
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Hiragino Sans', 'Meiryo', sans-serif;
            line-height: 1.8;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 30px 0;
            border-bottom: 2px solid #3b82f6;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
        }
        .content {
            padding: 30px 0;
        }
        .greeting {
            font-size: 16px;
            margin-bottom: 20px;
        }
        .box {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #e9ecef;
            font-size: 14px;
            color: #6c757d;
        }
        .contact-info {
            background-color: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">株式会社さだめ</div>
    </div>
    
    <div class="content">
        <div class="greeting">
            ${formData.name} 様<br><br>
            この度は株式会社さだめにお問い合わせいただき、誠にありがとうございます。<br>
            以下の内容でお問い合わせを受け付けました。
        </div>
        
        <div class="box">
            <h3 style="margin-top: 0; color: #1e293b;">お問い合わせ内容</h3>
            <p><strong>ご相談サービス:</strong> ${serviceLabel}</p>
            <p><strong>詳細・ご要望:</strong><br>
            ${formData.message ? formData.message.replace(/\n/g, '<br>') : 'なし'}</p>
        </div>
        
        <p>担当者より2営業日以内にご連絡させていただきます。<br>
        今しばらくお待ちください。</p>
        
        <div class="contact-info">
            <strong>お急ぎの場合</strong><br>
            下記までお電話でお問い合わせください。<br>
            TEL: 096-227-6559（平日 9:00-18:00）<br>
            Email: support@sadame.info
        </div>
        
        <p>今後ともよろしくお願いいたします。</p>
    </div>
    
    <div class="footer">
        <strong>株式会社さだめ</strong><br>
        〒861-4131 熊本県熊本市南区薄場1-15-22<br>
        TEL: 096-227-6559<br>
        Email: <a href="mailto:support@sadame.info">support@sadame.info</a><br>
        Web: <a href="https://sadame.info">https://sadame.info</a>
    </div>
</body>
</html>
        `
    };
};

// メール送信関数
async function sendEmail(formData) {
    const transporter = createTransporter();
    
    // 管理者への通知メール
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@sadame.com';
    const adminMailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || '株式会社さだめ お問い合わせシステム'}" <${process.env.EMAIL_FROM || 'noreply@sadame.com'}>`,
        to: adminEmail,
        ...getEmailTemplate(formData)
    };
    
    // 自動返信メール
    const autoReplyOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || '株式会社さだめ'}" <${process.env.EMAIL_FROM || 'noreply@sadame.com'}>`,
        to: formData.email,
        replyTo: adminEmail,
        ...getAutoReplyTemplate(formData)
    };
    
    const results = {
        adminEmail: { success: false },
        autoReply: { success: false }
    };
    
    try {
        // 管理者への通知メール送信
        const adminResult = await transporter.sendMail(adminMailOptions);
        results.adminEmail = {
            success: true,
            messageId: adminResult.messageId
        };
        console.log('Admin notification email sent:', adminResult.messageId);
    } catch (error) {
        console.error('Failed to send admin email:', error);
        results.adminEmail = {
            success: false,
            error: error.message
        };
    }
    
    try {
        // 自動返信メール送信
        const autoReplyResult = await transporter.sendMail(autoReplyOptions);
        results.autoReply = {
            success: true,
            messageId: autoReplyResult.messageId
        };
        console.log('Auto-reply email sent:', autoReplyResult.messageId);
    } catch (error) {
        console.error('Failed to send auto-reply email:', error);
        results.autoReply = {
            success: false,
            error: error.message
        };
    }
    
    return results;
}

module.exports = {
    sendEmail,
    getEmailTemplate,
    getAutoReplyTemplate
};

/*
使用方法:

1. 必要なパッケージをインストール:
   npm install nodemailer

2. 環境変数を設定:
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ADMIN_EMAIL=admin@sadame.com
   EMAIL_FROM=noreply@sadame.com
   EMAIL_FROM_NAME=株式会社さだめ

3. Gmailの場合、アプリパスワードを生成:
   - Googleアカウントの2段階認証を有効化
   - アプリパスワードを生成してSMTP_PASSに設定

4. その他のメールサービス:
   - SendGrid: SMTP_HOST=smtp.sendgrid.net
   - AWS SES: SMTP_HOST=email-smtp.region.amazonaws.com
   - Mailgun: SMTP_HOST=smtp.mailgun.org
*/