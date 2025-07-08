<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    
    <!-- =============================================== -->
    <!-- Site Header -->
    <!-- =============================================== -->
    <header class="site-header">
        <div class="container site-header__inner">
            <a href="<?php echo esc_url(home_url('/')); ?>#hero" class="site-header__logo">
                <?php bloginfo('name'); ?>
            </a>
            <nav class="site-header__nav">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'header_menu',
                    'container'      => false,
                    'menu_class'     => 'site-header__nav-list',
                    'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
                    'fallback_cb'    => false, // メニュー未設定時に何もしない
                ));
                ?>
            </nav>
            <a href="#contact" class="btn btn--primary site-header__cta">無料経営診断</a>
        </div>
    </header>

    <main>
