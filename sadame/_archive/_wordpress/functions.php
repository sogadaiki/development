<?php

// テーマの基本設定
function sadame_theme_setup() {
    // titleタグをWordPressに管理させる
    add_theme_support('title-tag');
    // アイキャッチ画像を有効化
    add_theme_support('post-thumbnails');
    // メニュー機能を有効化
    register_nav_menus(array(
        'header_menu' => 'ヘッダーメニュー',
    ));
}
add_action('after_setup_theme', 'sadame_theme_setup');

// CSSとJSファイルの読み込み
function sadame_theme_scripts() {
    // Google Fontsの読み込み
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Poppins:wght@700&display=swap', array(), null);
    
    // メインのスタイルシート(style.css)を読み込む
    wp_enqueue_style('sadame-style', get_stylesheet_uri());
}
add_action('wp_enqueue_scripts', 'sadame_theme_scripts');


// カスタマイザーの設定
function sadame_customize_register($wp_customize) {
    
    // --- ヒーローセクションの設定 ---
    $wp_customize->add_section('sadame_hero_section', array(
        'title'    => 'ヒーローセクション設定',
        'priority' => 30,
    ));

    // 背景画像
    $wp_customize->add_setting('hero_background_image');
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'hero_background_image', array(
        'label'    => '背景画像',
        'section'  => 'sadame_hero_section',
        'settings' => 'hero_background_image',
    )));

    // オーバーレイカラー
    $wp_customize->add_setting('hero_overlay_color', array(
        'default'   => 'rgba(248, 250, 252, 0.8)',
        'transport' => 'refresh',
    ));
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'hero_overlay_color', array(
        'label'    => '背景オーバーレイの色',
        'section'  => 'sadame_hero_section',
        'settings' => 'hero_overlay_color',
    )));

    // --- フッター設定 ---
    $wp_customize->add_section('sadame_footer_section', array(
        'title'    => 'フッター設定',
        'priority' => 120,
    ));

    // コピーライトテキスト
    $wp_customize->add_setting('footer_copyright_text', array(
        'default'   => '&copy; ' . date('Y') . ' 株式会社さだめ. All Rights Reserved.',
        'transport' => 'refresh',
    ));
    $wp_customize->add_control('footer_copyright_text', array(
        'label'    => 'コピーライトテキスト',
        'section'  => 'sadame_footer_section',
        'type'     => 'textarea',
    ));
}
add_action('customize_register', 'sadame_customize_register');


// ヒーローのインラインスタイルを出力
function sadame_hero_inline_styles() {
    $bg_image_url = get_theme_mod('hero_background_image');
    $overlay_color = get_theme_mod('hero_overlay_color', 'rgba(248, 250, 252, 0.8)');
    
    $style = '';
    if ($bg_image_url) {
        $style .= ".hero { background-image: url('" . esc_url($bg_image_url) . "'); }";
    }
    if ($overlay_color) {
        $style .= ".hero::before { background-color: " . esc_attr($overlay_color) . "; }";
    }

    if (!empty($style)) {
        // 'sadame-style'は上で登録したstyle.cssのハンドル名
        wp_add_inline_style('sadame-style', $style); 
    }
}
add_action('wp_enqueue_scripts', 'sadame_hero_inline_styles');

// ACF JSONファイルの読み込みパスを設定
function my_acf_json_load_point( $paths ) {
    // remove original path (optional)
    unset($paths[0]);

    // append path
    $paths[] = get_stylesheet_directory() . '/acf-json';
    
    return $paths;    
}
add_filter('acf/settings/load_json', 'my_acf_json_load_point');

?>
