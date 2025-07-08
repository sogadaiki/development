    </main>

    <!-- =============================================== -->
    <!-- Site Footer -->
    <!-- =============================================== -->
    <footer class="site-footer">
        <div class="container">
            <p><?php echo nl2br(get_theme_mod('footer_copyright_text', '&copy; ' . date('Y') . ' 株式会社さだめ. All Rights Reserved.')); ?></p>
        </div>
    </footer>

    <!-- =============================================== -->
    <!-- Floating CTA -->
    <!-- =============================================== -->
    <a href="#contact" class="btn btn--primary floating-cta" id="floatingCta">
        無料診断に申し込む
    </a>

    <?php wp_footer(); ?>

    <script>
    /* * 元のHTMLにあったJavaScriptをここに配置します。
     * WordPress環境でjQueryが読み込まれるため、$()が使用できますが、
     * 依存関係をなくすためVanilla JSのままにしておくことを推奨します。
    */
    document.addEventListener('DOMContentLoaded', () => {

        // --- Smooth Scroll for navigation ---
        const navLinks = document.querySelectorAll('.site-header__nav-list a, .site-header__logo, .hero .btn, .contact__inner .btn, .floating-cta');
        navLinks.forEach(link => {
            link.addEventListener('click', e => {
                const href = link.getAttribute('href');
                if (href.startsWith('#') || (href.includes('#') && href.split('#')[0] === window.location.pathname.replace(/\/$/, ""))) {
                    e.preventDefault();
                    const targetId = href.substring(href.indexOf('#') + 1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });

        // --- Animate sections on scroll ---
        const sections = document.querySelectorAll('.section');
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        // --- Floating CTA visibility ---
        const floatingCta = document.getElementById('floatingCta');
        const heroSection = document.getElementById('hero');

        if (floatingCta && heroSection) {
             const ctaObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        floatingCta.classList.add('is-visible');
                    } else {
                        floatingCta.classList.remove('is-visible');
                    }
                });
            }, { threshold: 0 }); 

            ctaObserver.observe(heroSection);
        }

        // --- Form Validation ---
        // Contact Form 7などのプラグイン利用を推奨するため、簡易バリデーションは削除。
        // プラグインを使わない場合は、元のバリデーションロジックをここに記述します。
    });
    </script>

</body>
</html>
