<?php get_header(); ?>

<!-- (HeroからProcessセクションまでは変更なしのため省略) -->

<!-- =============================================== -->
<!-- Hero Section -->
<!-- =============================================== -->
<section class="hero section is-visible" id="hero">
    <div class="container hero__inner">
        <div>
            <h1 class="hero__headline">
                <?php
                $hero_headline = get_field('hero_headline');
                echo $hero_headline ? $hero_headline : '価格を<span class="highlight">5倍</span>にして<br>売上<span class="highlight">30倍</span>を実現した<br>実践型経営パートナー';
                ?>
            </h1>
            <p class="hero__subtitle">
                <?php
                $hero_subtitle = get_field('hero_subtitle');
                echo $hero_subtitle ? $hero_subtitle : '20業態の立ち上げ経験を持つ現役経営者が、アドバイスだけでなく具体的な「形になる成果物」で、あなたのビジネスの実行まで伴走します。';
                ?>
            </p>
            <a href="#contact" class="btn btn--primary btn--large">
                <?php echo get_field('hero_button_text') ?: '今すぐ無料で経営診断を受ける'; ?>
            </a>
        </div>
        <div class="hero__badges">
            <?php for ($i = 1; $i <= 3; $i++) : ?>
                <?php
                $label = get_field('hero_badge_' . $i . '_label');
                $value = get_field('hero_badge_' . $i . '_value');

                // Set default values for the first loop iteration
                if ($i === 1 && !$label && !$value) {
                    $label = '顧客満足度';
                    $value = '92%';
                }
                if ($i === 2 && !$label && !$value) {
                    $label = '最高売上成長';
                    $value = '30倍';
                }
                 if ($i === 3 && !$label && !$value) {
                    $label = '支援実績';
                    $value = '20+';
                }

                if ($label && $value) :
                ?>
                    <div class="hero__badge">
                        <span class="hero__badge-label"><?php echo esc_html($label); ?></span>
                        <span class="hero__badge-value"><?php echo esc_html($value); ?></span>
                    </div>
                <?php endif; ?>
            <?php endfor; ?>
        </div>
    </div>
</section>

<!-- =============================================== -->
<!-- Problem Section -->
<!-- =============================================== -->
<section class="section" id="problem">
    <div class="container">
        <h2 class="section-title"><?php echo get_field('problem_title') ?: 'こんなお悩みありませんか？'; ?></h2>
        <p class="section-subtitle"><?php echo get_field('problem_subtitle') ?: '一つでも当てはまれば、私たちのサービスが力になれる可能性があります。'; ?></p>
        <div class="problem__grid">
            <?php
            $default_problems = [
                '価格競争から抜け出せない',
                '自社の強みが伝わっていない',
                '集客がうまくいかない',
                'アドバイスだけで実行できない'
            ];
            for ($i = 1; $i <= 4; $i++) :
                $problem_text = get_field('problem_card_' . $i . '_text') ?: $default_problems[$i-1];
                if ($problem_text) :
            ?>
                <div class="problem-card">
                    <div class="problem-card__icon">✓</div>
                    <h3 class="problem-card__title"><?php echo esc_html($problem_text); ?></h3>
                </div>
            <?php endif; endfor; ?>
        </div>
    </div>
</section>

<!-- =============================================== -->
<!-- Results Section -->
<!-- =============================================== -->
<section class="results section">
    <div class="container">
         <h2 class="section-title"><?php echo get_field('results_title') ?: '数字が証明する、確かな実績'; ?></h2>
         <p class="section-subtitle"><?php echo get_field('results_subtitle') ?: '論より証拠。私たちの支援がもたらした売上成長の一例です。'; ?></p>
         <div class="results__content">
            <?php
            $results_svg = get_field('results_svg_code');
            $default_svg = '<svg width="100%" height="auto" viewBox="0 0 800 400" role="img" aria-labelledby="results-graph-title"><title id="results-graph-title">導入前と導入後の売上成長率の推移を示すグラフ</title><rect width="800" height="400" fill="#ffffff" rx="10"></rect><g stroke="#e0e0e0" stroke-width="1"><line x1="100" y1="50" x2="100" y2="350"></line><line x1="100" y1="350" x2="700" y2="350"></line><line x1="100" y1="300" x2="700" y2="300" stroke-dasharray="5,5"></line><line x1="100" y1="200" x2="700" y2="200" stroke-dasharray="5,5"></line><line x1="100" y1="100" x2="700" y2="100" stroke-dasharray="5,5"></line></g><text x="80" y="355" text-anchor="end" fill="#666" font-size="12">0倍</text><text x="80" y="255" text-anchor="end" fill="#666" font-size="12">10倍</text><text x="80" y="155" text-anchor="end" fill="#666" font-size="12">20倍</text><text x="80" y="55" text-anchor="end" fill="#666" font-size="12">30倍</text><text x="100" y="375" text-anchor="middle" fill="#666" font-size="12">0ヶ月</text><text x="400" y="375" text-anchor="middle" fill="#666" font-size="12">6ヶ月</text><text x="700" y="375" text-anchor="middle" fill="#666" font-size="12">12ヶ月</text><line x1="100" y1="340" x2="400" y2="340" stroke="#999" stroke-width="3"></line><text x="250" y="325" text-anchor="middle" fill="#999" font-size="14" font-weight="bold">導入前</text><path d="M 400 340 Q 450 320 500 280 T 600 180 Q 650 120 700 50" fill="none" stroke="var(--primary-color)" stroke-width="4"></path><text x="550" y="130" text-anchor="middle" fill="var(--primary-color)" font-size="16" font-weight="bold">導入後</text><path d="M 690 60 L 700 50 L 690 40" fill="none" stroke="var(--primary-color)" stroke-width="4"></path></svg>';
            echo $results_svg ?: $default_svg;
            ?>
         </div>
    </div>
</section>

<!-- =============================================== -->
<!-- Story Section -->
<!-- =============================================== -->
<section class="story section" id="story">
    <div class="container">
        <div class="story__grid">
            <div class="story__image-wrapper">
                <?php 
                $story_image = get_field('story_image');
                if( !empty($story_image) ): ?>
                    <img src="<?php echo esc_url($story_image['url']); ?>" alt="<?php echo esc_attr($story_image['alt']); ?>" class="story__image">
                <?php else: ?>
                    <img src="https://placehold.co/400x400/00A1A7/FFFFFF?text=SOGA" alt="株式会社さだめ 代表取締役 曽我" class="story__image">
                <?php endif; ?>
            </div>
            <div class="story__text">
                <h3><?php echo get_field('story_title') ?: 'なぜ私が「形になる成果物」にこだわるのか'; ?></h3>
                <?php 
                $story_content = get_field('story_content');
                $default_story_content = '<p>競輪選手を目指し、365日10時間自転車に乗り続けた6年間。プロになれなかった挫折から学んだのは、「正しい方向性と具体的な実行計画がなければ、努力は報われない」という事実でした。</p><p class="story__highlight"><strong>「アドバイスだけでは、事業は1ミリも前に進まない」</strong></p><p>この信念に基づき、飲食業界で年商6億円の事業を築いた経験と、20以上の業態立ち上げで得た知見を全て投入します。机上の空論ではない、現場で即使える「事業計画書」「ブランドデザイン」「教育マニュアル」といった具体的な成果物をお渡しし、あなたの事業が確実に前進するまで伴走します。</p>';
                echo $story_content ?: $default_story_content;
                ?>
            </div>
        </div>
    </div>
</section>

<!-- =============================================== -->
<!-- Testimonials Section -->
<!-- =============================================== -->
<section class="testimonials section" id="testimonials">
    <div class="container">
        <h2 class="section-title"><?php echo get_field('testimonials_title') ?: 'お客様の声'; ?></h2>
        <p class="section-subtitle"><?php echo get_field('testimonials_subtitle') ?: '私たちの支援で、ビジネスを飛躍させた経営者たちの声をお聞きください。'; ?></p>
        <div class="testimonials__grid">
            <?php for ($i = 1; $i <= 3; $i++) : ?>
                <?php 
                $testimonial_text = get_field('testimonial_' . $i . '_text');
                // Use default for the first one if it's empty
                if ($i === 1 && !$testimonial_text) {
                     $testimonial_text = '価格を5倍にすることに最初は恐怖しかありませんでした。でも、曽我さんが一緒に作ってくれたブランドコンセプトと販促ツールのおかげで、お客様に価値が伝わり、結果的に客数も6倍に。もう価格競争には戻れません。';
                }
                
                if ($testimonial_text) : 
                    $author_image = get_field('testimonial_' . $i . '_author_image');
                    $author_name = get_field('testimonial_' . $i . '_author_name');
                    $author_title = get_field('testimonial_' . $i . '_author_title');

                    if ($i === 1 && !$author_name) $author_name = '田中 雅子 様';
                    if ($i === 1 && !$author_title) $author_title = 'PremelCake オーナー';
                ?>
                    <div class="testimonial-card">
                        <p class="testimonial-card__text"><?php echo esc_html($testimonial_text); ?></p>
                        <div class="testimonial-card__author">
                            <?php if( !empty($author_image) ): ?>
                                <img src="<?php echo esc_url($author_image['url']); ?>" alt="<?php echo esc_attr($author_image['alt']); ?>" class="testimonial-card__author-img">
                            <?php elseif ($i === 1) : ?>
                                <img src="https://placehold.co/120x120/F25C05/FFFFFF?text=T" alt="田中様" class="testimonial-card__author-img">
                            <?php endif; ?>
                            <div>
                                <div class="testimonial-card__author-name"><?php echo esc_html($author_name); ?></div>
                                <div class="testimonial-card__author-title"><?php echo esc_html($author_title); ?></div>
                            </div>
                        </div>
                    </div>
                <?php endif; ?>
            <?php endfor; ?>
        </div>
    </div>
</section>

<!-- =============================================== -->
<!-- Features Section -->
<!-- =============================================== -->
<section class="features section" id="features">
    <div class="container">
        <h2 class="section-title"><?php echo get_field('features_title') ?: '選ばれる3つの理由'; ?></h2>
        <p class="section-subtitle"><?php echo get_field('features_subtitle') ?: '私たちが多くの経営者から選ばれ、成果を出し続けられる理由をご紹介します。'; ?></p>
        <div class="features__grid">
             <?php 
             $default_features = [
                1 => ['title' => '1. 形になる成果物', 'text' => '事業計画書、マニュアル、デザイン等、すぐに使える具体的なツールを提供します。', 'icon' => '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>'],
                2 => ['title' => '2. 20業態の実戦経験', 'text' => '机上の空論ではない、現場で培った生きた知識で、最適な戦略を立案します。', 'icon' => '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.28a4.5 4.5 0 0 0-1.88-2.218a4.5 4.5 0 0 0-2.3-2.728M12 12c-.618 0-1.197-.156-1.747-.433m-2.288-4.014A4.5 4.5 0 0 0 5.274 2.28M12 12c.618 0 1.197.156 1.747.433m2.288 4.014A4.5 4.5 0 0 0 18.727 18M12 12v9m-9-9h18" /></svg>'],
                3 => ['title' => '3. 実行までの完全伴走', 'text' => '作って終わりではありません。成果が出るまで、責任を持ってサポートします。', 'icon' => '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>']
            ];
             for ($i = 1; $i <= 3; $i++) :
                $feature_title = get_field('feature_' . $i . '_title') ?: $default_features[$i]['title'];
                if ($feature_title) :
                    $feature_text = get_field('feature_' . $i . '_text') ?: $default_features[$i]['text'];
                    $feature_icon = get_field('feature_' . $i . '_icon_svg') ?: $default_features[$i]['icon'];
            ?>
                <div class="feature-card">
                    <div class="feature-card__icon"><?php echo $feature_icon; ?></div>
                    <h3 class="feature-card__title"><?php echo esc_html($feature_title); ?></h3>
                    <p><?php echo esc_html($feature_text); ?></p>
                </div>
            <?php endif; endfor; ?>
        </div>
    </div>
</section>

<!-- =============================================== -->
<!-- Process Section -->
<!-- =============================================== -->
<section class="process section">
    <div class="container">
        <h2 class="section-title"><?php echo get_field('process_title') ?: '成功への3ステップ'; ?></h2>
        <p class="section-subtitle"><?php echo get_field('process_subtitle') ?: '最短距離で成果を出すための、シンプルで効果的なプロセスです。'; ?></p>
        <div class="process__timeline">
            <?php
            $default_processes = [
                1 => ['label' => 'STEP 1', 'title' => '無料経営診断', 'text' => '現状の課題を分析し、あなたのビジネスが持つ真の成長可能性を明確にします。'],
                2 => ['label' => 'STEP 2', 'title' => '戦略立案＆成果物作成', 'text' => '診断結果に基づき、具体的な実行計画と、すぐに使えるツール（成果物）を制作します。'],
                3 => ['label' => 'STEP 3', 'title' => '実行伴走＆成果創出', 'text' => '計画を実行に移し、PDCAを回しながら、目に見える成果が出るまで伴走します。']
            ];
             for ($i = 1; $i <= 3; $i++) :
                $process_title = get_field('process_' . $i . '_title') ?: $default_processes[$i]['title'];
                if ($process_title) : 
                    $process_label = get_field('process_' . $i . '_step_label') ?: $default_processes[$i]['label'];
                    $process_text = get_field('process_' . $i . '_text') ?: $default_processes[$i]['text'];
            ?>
                <div class="process-item">
                    <div class="process-item__step"><?php echo esc_html($process_label); ?></div>
                    <h3 class="process-item__title"><?php echo esc_html($process_title); ?></h3>
                    <p><?php echo esc_html($process_text); ?></p>
                </div>
            <?php endif; endfor; ?>
        </div>
    </div>
</section>

<!-- =============================================== -->
<!-- Contact Section (REVISED STRUCTURE) -->
<!-- =============================================== -->
<section class="contact-section-wrapper section" id="contact">
    <div class="container">
        <div class="contact__inner">
            <h2 class="contact__title"><?php echo get_field('contact_title') ?: 'あなたのビジネスを変える<br>第一歩を踏み出しませんか？'; ?></h2>
            <p class="contact__description"><?php echo get_field('contact_description') ?: '通常3万円の経営診断を、今なら完全無料でご提供します。無理な勧誘は一切ありません。まずはお気軽にご相談ください。'; ?></p>
            <a href="#contact-form" class="btn btn--primary btn--large" style="background: var(--white-color); color: var(--secondary-color);"><?php echo get_field('contact_button_text') ?: '無料診断を予約する'; ?></a>
        </div>
        <div class="contact__form-wrapper" id="contact-form">
            <div class="contact-form">
                 <h3 class="section-title" style="margin-bottom: 32px; font-size: 1.75rem;">無料経営診断 申込フォーム</h3>
                <?php
                $shortcode = get_field('contact_form_shortcode');
                echo $shortcode ? do_shortcode($shortcode) : '<p style="text-align:center;">お問い合わせフォームのショートコードをACFで設定してください。</p>';
                ?>
            </div>
        </div>
    </div>
</section>


<?php get_footer(); ?>
